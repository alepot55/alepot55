## In short

- **Why.** I build on OpenAI Triton and on LLVM's MLIR every day. When one of them is wrong, the cheap move is a local workaround; the useful move is a patch upstream, where it fixes the problem for everyone.
- **What landed.** Five patches merged: one substantive change to Triton's Membar analysis, three to MLIR (a mem2reg crash, the `scf` loop unroller, and the vector dialect verifier), and one documentation fix.
- **What else counts.** Three further Triton bugs were reported with a runnable reproducer and fixed by the maintainers themselves. The credit there is for the report, not for a landed patch, and the page says so.
- **State.** Ten more changes are open upstream and under review. Every state on this page was checked against the GitHub API on 27 August 2026.

## The merged patches

**Triton, `[Membar] Treat the warp_specialize terminators as CTA sync points`.** Modelling `ttg.warp_yield` and `ttg.warp_return` as a CTA-wide rendezvous stops Membar inserting a redundant barrier after every `warp_specialize`. On an H100 build the generated PTX loses about 30 `bar.sync` instructions. It buys no measurable speedup, between minus 0.5 and plus 0.3 percent, and I published that negative result on the pull request rather than leaving the barrier count to imply a win.

**MLIR, `Fix mem2reg crash on zero-extent alloca`.** Whole-buffer promotion did not check for a zero extent in the memref shape, so `mlir-opt --mem2reg` asserted on a legal input.

**MLIR, `Do not read non-constant loop bounds when unrolling`.** `loopUnrollByFactor` read bounds it had not established were constant, on three shapes where the trip-count query answered anyway.

**MLIR, `Verify multi_reduction reduction dimensions`.** Out-of-range and duplicate `reduction_dims` reached `getReductionMask()`, which then wrote past the end of a `SmallVector<bool>`. The fix rejects them in the verifier, where a malformed op belongs.

## What the review taught me

The most useful lesson was about packaging, not about compilers. The documentation fix first travelled inside a larger pull request, next to a change a maintainer had already pushed back on. It sat for 43 days without CI. Extracted onto a fresh branch, one file, nothing contested, it merged in under a day.

The rule I took from it: never tie an uncontroversial fix to a contested one. They do not average out, the contested half blocks both.

## Where I was wrong

Not everything landed, and the closures are as informative as the merges.

- A twin of the Membar patch, on the entry side, was declined as marginal. It was: I had measured that it did not change the generated code, and said so in the description.
- A fix to fp8 block-pointer loads was declined because block pointers are deprecated and being removed.
- A defensive error path in `global_scratch_alloc` I withdrew myself, after a reviewer showed the assert is unreachable from generated code.
- The per-lane retirement pass was proposed as an RFC, and the maintainers' answer was to ship it out of tree. It now lives as a loadable plugin instead.
