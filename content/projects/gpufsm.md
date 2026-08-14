## The gap everybody quotes and nobody explains

Tile-based GPU DSLs are supposed to make kernel writing tractable: write Python, let the compiler
handle the hardware. On regular workloads that mostly holds. On *irregular* ones it does not. On
finite automata, a workload with data-dependent control flow, unpredictable memory access and almost
no arithmetic intensity, Triton trails hand-written CUDA by roughly $10\times$.

That number circulates. What was missing was the mechanism. Prior work blamed the execution paradigm,
tile/SPMD against thread-SIMT, rather than the height of the abstraction, but stopped there: no
account of *why*, and no idea of *what* would close it.

This project answers both. I call the gap **abstraction regret**: the cost a DSL imposes not through
its algorithms but through the execution model it forces you to express them in.

## Anatomy: taking the gap apart

The anchor is a work-efficient NFA worklist. Measured in stages, the regret is batch dependent,
$10.1\times$ at batch 4096 and $26\times$ at a batch that saturates the GPU, and it decomposes into
three independently measured components:

1. **A launch configuration artifact**, $2.8$ to $3.7\times$, from the default `num_warps`. This one
   is free to fix and has nothing to do with the abstraction.
2. **A lane-packing-recoverable component**, from warp-redundant scalar execution.
3. **An irreducible residual of about $2\times$**, which is the interesting one.

The residual is not what the usual suspects would predict. At matched occupancy, issuing *fewer*
warp instructions than CUDA, and sitting below both the issue and the bandwidth roofline ceilings, the
per-lane Triton worklist still spends $15.3\times$ more cycles stalled on the dependent load, and
issues at $9.9\%$ of peak against CUDA's $41\%$.

So it is latency bound, and the cause is structural: a CUDA warp has 32 lanes each issuing an
independent load, and those loads overlap in flight. A lock-step tile serialises the dependent
next-state load. The abstraction denies intra-warp memory-level parallelism.

The same anatomy reproduces on an A100: same $26\times$ total, `num_warps` component $3.7\times$ on
both architectures. It is a property of the paradigm, not of one GPU.

## The regime that closes

The residual is regime dependent, which is the strongest evidence that the diagnosis is right. Run
the memory-bound DFA instead of the NFA and the residual disappears: lane-packed Triton matches CUDA
at $1.05\times$ once the transition table spills to DRAM. When the kernel is waiting on memory anyway,
losing intra-warp overlap costs nothing.

This unifies both faces of the regret and explains a question people actually ask: why does Triton
excel at flash-attention and collapse on automata?

## Cure: below the IR, not inside it

The missing primitive is a per-lane region that lowers each lane to an independent instruction
stream. I then proved that lowering it *inside* the tile IR is structurally impossible: `scf.condition`
carries a single `i1`, so a per-lane exit cannot be expressed there at all.

So the cure is built below it. A TritonGPU to LLVM per-lane-retirement pass, wired into `libtriton`,
correctness-gated against a CPU oracle and guarded by a soundness verifier. The same idiomatic
per-lane source, lowered to the thread model, gives:

- $2.3$ to $6.7\times$ on control-bound lock-step kernels on an RTX 4070
- $1.6$ to $3.8\times$ reproduced on an A100 from the same pinned build recipe
- about $1.0\times$ on gather-bound SpMV and MoE, exactly as the law predicts

That last line matters more than the first two. A cure that speeds up everything is a cure that has
not been understood.

## Generality, with a negative control

Across eight oracle-gated irregular workloads the regret turns out to be created by per-step *scalar
control*, not by memory irregularity. The evidence is built to be falsifiable:

- a graph pointer-chase negative control at $1.00\times$: maximal memory irregularity, no scalar
  control, no regret
- MoE top-$k$ routing at $2.36\times$: an ML-shaped workload, regret present
- dense ragged attention at $0.64\times$, a sign flip where the tile *wins*

Every kernel is checked against a CPU oracle before it is timed, and every number in the paper traces
back to a versioned CSV.

## Where it stands

The engineering lives in `gpufsm`: one API, one correctness oracle, one NFA representation in CSR, and
a registry where a new backend is one file and one line. CPU, Triton, CUDA and a Warp backend are in;
Gluon was attempted and could not express the kernel at all, since `gl.load` always returns a
laid-out tensor and the data-dependent CSR loop has no scalar load to stand on. That failure is itself
a finding: on automata the abstraction regret is first a control-flow limit, not only a layout one.

The paper went to PPoPP 2027 after a TACO desk reject and a CGO pivot, and the compiler work went
upstream as an RFC and a pull request on `triton-lang/triton`, where the maintainers pushed back on the
first version and were right to.
