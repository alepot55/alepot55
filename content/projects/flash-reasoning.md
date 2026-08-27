## In short

- **Problem.** Reasoning LLMs explore branches that almost always share long prefixes, and standard inference engines store each shared prefix once per branch, so KV-cache waste grows as `O(n * b)` until VRAM is exhausted.
- **Mechanism.** Tree-aware attention deduplicates shared prefix blocks by reference counting, and fuses gather, GQA head expansion and softmax into a single Triton kernel.
- **Result.** 2.54x faster than standard attention, 96.6 percent VRAM reduction, and 1,194 GB/s effective bandwidth against a 900 GB/s physical HBM peak.
- **Explanation.** The bandwidth figure is not an error: shared prefix blocks stay resident in L2, so the kernel reads faster than HBM allows by design.
- **Status.** Triton autotuning ports the kernel across A100, H100 and RTX architectures without hand-writing separate variants.

## The duplication problem

Reasoning LLMs like DeepSeek-R1 and OpenAI o1 think by exploring *decision trees*: they generate multiple reasoning branches, backtrack, and try alternative paths. This is powerful for complex problems, but it creates a fundamental memory problem.

Standard inference engines treat every branch as an independent sequence. If branches A and B share a 2,000-token prefix, which they almost always do, the engine stores that prefix **twice** in the KV-Cache. Multiply by dozens of branches and the `O(n * b)` waste produces:

- VRAM exhaustion
- throughput collapse
- inference costs that scale quadratically with reasoning depth

## The structural insight

Branches in a reasoning tree are not independent sequences. They form a *tree*, and the attention mechanism should understand that structure. If ten branches share the same prefix, the KV-Cache should store that prefix **once** and let all branches reference it.

This is **Tree-Aware Attention**: physical deduplication of shared prefix blocks, plus fusion of the entire attention computation into a single Triton kernel.

## Components

**PhysicalKVAllocator.** Maintains a pool of KV blocks with reference counting. A new branch forking from an existing prefix increments the reference count instead of copying memory; a pruned branch decrements it, and the block is freed only when no branch references it.

**Fused GQA kernel.** Performs gather, GQA head expansion, and scaled dot-product attention in a single kernel launch. Standard engines launch 3 separate kernels with intermediate materializations; Flash-Reasoning does it in one pass.

**Online softmax.** Follows FlashAttention's numerically stable approach, computing softmax incrementally without materializing the full attention matrix. Memory usage stays proportional to block size, not to sequence length.

## Measured results

On standard reasoning workloads:

- **2.54x faster** than standard attention
- **96.6 percent VRAM reduction** via physical deduplication
- **Effective bandwidth of 1,194 GB/s**, exceeding the physical HBM limit of 900 GB/s

## Why the bandwidth exceeds the HBM peak

That last number seems impossible until you look at where the reads land. Shared prefix blocks are accessed so frequently by different branches that they stay cached in L2, at about 5 TB/s effective bandwidth, which amortizes the HBM cost across all branches. The kernel exploits this locality by design, not by accident.

## Where the speedup comes from

- Kernel fusion mattered more than algorithmic optimization at this level.
- The reference counting and the tree structure were straightforward.
- The 2.54x came from eliminating kernel launch overhead and intermediate memory allocations.
- Triton's autotuning was essential for portability across A100, H100 and RTX architectures without manually writing separate kernels.
