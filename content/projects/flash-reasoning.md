## Motivation

Reasoning LLMs like DeepSeek-R1 and OpenAI o1 think by exploring *decision trees*: they generate multiple reasoning branches, backtrack, and try alternative paths. This is powerful for complex problems, but it creates a fundamental memory problem.

Standard inference engines treat every branch as an independent sequence. If branches A and B share a 2,000-token prefix (which they almost always do), the engine stores that prefix **twice** in the KV-Cache. Multiply by dozens of branches and you get $O(n \times b)$ memory waste: VRAM exhaustion, throughput collapse, and inference costs that scale quadratically with reasoning depth.

## The Key Insight

Branches in a reasoning tree are not independent sequences. They form a *tree*. The attention mechanism should understand this structure. If ten branches share the same prefix, the KV-Cache should store that prefix **once** and let all branches reference it.

This insight led to **Tree-Aware Attention**: a system that physically deduplicates shared prefix blocks and fuses the entire attention computation into a single Triton kernel.

## How It Works

**PhysicalKVAllocator** maintains a pool of KV blocks with reference counting. When a new branch forks from an existing prefix, it increments the reference count instead of copying memory. When a branch is pruned, it decrements, and the block is freed only when no branch references it.

**Fused GQA Kernel** performs gather, GQA head expansion, and scaled dot-product attention in a single kernel launch. Standard engines launch 3 separate kernels with intermediate materializations; Flash-Reasoning does it in one pass.

**Online Softmax** follows FlashAttention's numerically stable approach, computing softmax incrementally without materializing the full attention matrix. This keeps memory usage proportional to block size, not sequence length.

## Results

The numbers surprised even me. On standard reasoning workloads:

- **$2.54\times$ faster** than standard attention
- **96.6% VRAM reduction** via physical deduplication
- **Effective bandwidth of 1,194 GB/s**, exceeding the physical HBM limit of 900 GB/s

That last number seems impossible until you understand what's happening: shared prefix blocks are accessed so frequently by different branches that they get cached in L2 (~5 TB/s effective bandwidth), amortizing the HBM cost across all branches. The kernel exploits this locality by design.

## Lessons Learned

The biggest lesson was that kernel fusion matters more than algorithmic optimization at this level. The reference counting and tree structure were straightforward. The $10\times$ came from eliminating kernel launch overhead and intermediate memory allocations. Triton's autotuning was essential for portability across A100, H100, and RTX architectures without manually writing separate kernels.
