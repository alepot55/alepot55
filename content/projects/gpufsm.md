## In short

- **Problem.** On finite automata, a workload with data-dependent control flow, unpredictable memory access and almost no arithmetic intensity, Triton trails hand-written CUDA by roughly 10x: a number that circulates without a mechanism behind it.
- **Diagnosis.** I call the gap *abstraction regret*, the cost a DSL imposes not through its algorithms but through the execution model it forces you to express them in, and I trace the irreducible part to intra-warp memory-level parallelism the tile IR cannot express.
- **Cure.** A TritonGPU to LLVM per-lane-retirement pass, built below the tile IR because `scf.condition` makes a per-lane exit inexpressible inside it.
- **Result.** 2.3 to 6.7x on control-bound kernels on an RTX 4070, 1.6 to 3.8x on an A100, and about 1.0x on gather-bound kernels, which is exactly where the diagnosis predicts no gain.
- **Status.** Paper at PPoPP 2027 after a TACO desk reject and a CGO pivot. The compiler work is upstream as an RFC and a pull request on `triton-lang/triton`.

## Problem and prior work

Tile-based GPU DSLs are supposed to make kernel writing tractable: write Python, let the compiler handle the hardware. On regular workloads that mostly holds. On *irregular* ones it does not.

What was missing was never the number, it was the mechanism:

- Prior work blamed the execution paradigm, tile/SPMD against thread-SIMT, rather than the height of the abstraction.
- It stopped there: no account of *why* the gap exists.
- It offered no idea of *what* would close it.

This project answers both questions.

## Decomposition of the gap

The anchor is a work-efficient NFA worklist. Measured in stages, the regret is batch dependent: 10.1x at batch 4096 and 26x at a batch that saturates the GPU. It decomposes into three independently measured components:

1. **A launch configuration artifact**, 2.8 to 3.7x, from the default `num_warps`. This one is free to fix and has nothing to do with the abstraction.
2. **A lane-packing-recoverable component**, from warp-redundant scalar execution.
3. **An irreducible residual of about 2x**, which is the interesting one.

## Evidence on the residual

The residual is not what the usual suspects would predict. Against CUDA, the per-lane Triton worklist:

- runs at matched occupancy
- issues *fewer* warp instructions
- sits below both the issue and the bandwidth roofline ceilings
- still spends 15.3x more cycles stalled on the dependent load
- still issues at 9.9 percent of peak, against CUDA's 41 percent

So it is latency bound, and the cause is structural. A CUDA warp has 32 lanes each issuing an independent load, and those loads overlap in flight. A lock-step tile serialises the dependent next-state load, so the abstraction denies intra-warp memory-level parallelism.

The same anatomy reproduces on an A100: same 26x total, `num_warps` component 3.7x on both architectures. It is a property of the paradigm, not of one GPU.

## Regime dependence: NFA against DFA

The residual is regime dependent, which is the strongest evidence that the diagnosis is right. Run the memory-bound DFA instead of the NFA and the residual disappears: lane-packed Triton matches CUDA at 1.05x once the transition table spills to DRAM. When the kernel is waiting on memory anyway, losing intra-warp overlap costs nothing.

This unifies both faces of the regret and answers a question people actually ask: why Triton excels at flash-attention and collapses on automata.

## Why the cure cannot live inside the tile IR

The missing primitive is a per-lane region that lowers each lane to an independent instruction stream. I proved that lowering it *inside* the tile IR is structurally impossible: `scf.condition` carries a single `i1`, so a per-lane exit cannot be expressed there at all.

## The compiler pass and what it measures

The cure is built below the IR: a TritonGPU to LLVM per-lane-retirement pass, wired into `libtriton`, correctness-gated against a CPU oracle and guarded by a soundness verifier. The same idiomatic per-lane source, lowered to the thread model, gives:

- 2.3 to 6.7x on control-bound lock-step kernels on an RTX 4070
- 1.6 to 3.8x reproduced on an A100 from the same pinned build recipe
- about 1.0x on gather-bound SpMV and MoE, exactly as the law predicts

That last line matters more than the first two. A cure that speeds up everything is a cure that has not been understood.

## Generality across eight workloads

Across eight oracle-gated irregular workloads the regret turns out to be created by per-step *scalar control*, not by memory irregularity. The evidence is built to be falsifiable:

- a graph pointer-chase negative control at 1.00x: maximal memory irregularity, no scalar control, no regret
- MoE top-`k` routing at 2.36x: an ML-shaped workload, regret present
- dense ragged attention at 0.64x: a sign flip where the tile *wins*

Every kernel is checked against a CPU oracle before it is timed, and every number in the paper traces back to a versioned CSV.

## Implementation

The engineering lives in `gpufsm`:

- one API, one correctness oracle, one NFA representation in CSR
- a registry where a new backend is one file and one line
- CPU, Triton, CUDA and Warp backends in tree
- Gluon attempted and abandoned: `gl.load` always returns a laid-out tensor, and the data-dependent CSR loop has no scalar load to stand on

That last failure is itself a finding: on automata the abstraction regret is first a control-flow limit, not only a layout one.

## Status

The paper went to PPoPP 2027 after a TACO desk reject and a CGO pivot. The compiler work went upstream as an RFC and a pull request on `triton-lang/triton`, where the maintainers pushed back on the first version and were right to.
