## The Membar patch removes about 30 `bar.sync` instructions and buys no speedup

Modelling `ttg.warp_yield` and `ttg.warp_return` as a CTA-wide rendezvous stops Triton's Membar analysis inserting a redundant barrier after every `warp_specialize`. On an H100 build the generated PTX loses about 30 `bar.sync` instructions and runs somewhere between 0.5 percent slower and 0.3 percent faster. I published that negative result on the pull request instead of quoting the barrier count and leaving it to imply a win.

## Three MLIR patches: a crash, an unchecked read, a buffer overrun

| Patch | What was wrong |
| --- | --- |
| `mem2reg` on a zero-extent alloca | Promotion never checked the extent in the memref shape, so `mlir-opt --mem2reg` asserted on legal input. |
| `scf` loop unroller | `loopUnrollByFactor` read bounds it had not established were constant, on the shapes where the trip-count query answered anyway. |
| `vector.multi_reduction` verifier | Out-of-range and duplicate `reduction_dims` reached `getReductionMask()`, which wrote past the end of a `SmallVector<bool>`. |

## A documentation fix sat 43 days, then merged in under a day

I first sent it inside a larger pull request, next to a change a maintainer had already pushed back on, and it waited 43 days without CI. Extracted onto a fresh branch, one file, nothing contested, it merged in under a day. I no longer tie an uncontroversial fix to a contested one.

## Four changes did not land, and I withdrew one myself

| Change | Outcome |
| --- | --- |
| Membar twin on the entry side | Declined as marginal. I had measured that it left the generated code unchanged. |
| fp8 block-pointer loads | Declined: block pointers are deprecated and being removed. |
| Defensive error path in `global_scratch_alloc` | Withdrawn after a reviewer showed the assert is unreachable from generated code. |
| Per-lane retirement pass (RFC) | Maintainers asked for it out of tree. It ships as a loadable plugin. |

## Every state on this page was checked against the GitHub API on 27 August 2026

That covers the merged patches, the ten changes still open under review, and the closures above. Where maintainers fixed a reported bug themselves from my reproducer, the page credits the report.
