## The gap is 10.2x median and 32.8x worst, across 13 benchmarks

Thirteen automata benchmarks on an RTX 4070, each checked against a CPU oracle before it is timed. Triton's median is 10.2x slower than hand-written CUDA and its worst is 32.8x, on hamming. The number circulated already; the mechanism did not.

## Two thirds of the gap is a launch flag and a packing loss

The anchor kernel is a work-efficient NFA worklist, and its regret is batch dependent: 10.1x at batch 4096, 26x at saturation. It splits three ways: the default `num_warps` costs 2.8 to 3.7x and is free to fix, warp-redundant scalar execution costs a lane-packing component, and about 2x survives both.

## The residual is 2x of stall, not of instructions

At matched occupancy the Triton worklist issues fewer warp instructions than CUDA and sits below both roofline ceilings, so the objection that I wrote a worse kernel does not hold. It still spends 15.3x more cycles stalled on the dependent load and issues at 9.9 percent of peak against CUDA's 41. A CUDA warp holds 32 independent loads in flight; a lock-step tile serialises them.

## Swap the NFA for a DFA and the residual falls to 1.05x

The same lane-packed Triton kernel matches CUDA at 1.05x once the transition table spills to DRAM: when the kernel waits on memory anyway, losing intra-warp overlap costs nothing. That regime dependence also answers why Triton is excellent at flash-attention and poor at automata.

## `scf.condition` carries one `i1`, so the fix cannot live in the tile IR

A per-lane exit needs a per-lane predicate, and `scf.condition` carries one `i1`. So I built the cure below the tile IR: a TritonGPU to LLVM per-lane retirement pass in `libtriton`, gated against the CPU oracle and guarded by a verifier that makes it a no-op when it cannot prove safety.

## The pass gives 2.3 to 6.7x where it should and 1.0x where it should not

Same source, lowered to the thread model: 2.3 to 6.7x on control-bound kernels on the 4070, 1.6 to 3.8x on an A100, and about 1.0x on gather-bound SpMV and MoE. Across eight workloads the regret tracks per-step scalar control, not memory irregularity: a graph pointer chase at 1.00x, MoE top-k routing at 2.36x, ragged attention at 0.64x where the tile wins.

## Upstream declined the in-tree pass, and was right to

I opened an RFC and a pull request on `triton-lang/triton` asking for the pass in tree. The maintainers declined, so it ships out of tree as a loadable plugin; separate patches from the same work did land, in Triton and in LLVM's MLIR. I am the sole author, and the measurement paper is accepted at IEEE HPEC 2026 for an oral talk and IEEE Xplore.
