## A 2,000-token prefix shared by ten branches is stored once per branch

Reasoning models like DeepSeek-R1 and o1 generate a branch, backtrack, and retry, so branches that fork late share almost their whole prefix. A standard inference engine treats each branch as an independent sequence and writes the shared prefix again for each one, so KV-cache waste grows as `O(n * b)` in prefix length and branch count until VRAM runs out.

## Reference counting on the block pool removes 96.6 percent of the KV-cache

Every branch draws its KV blocks from one pool. Forking off an existing prefix increments a reference count instead of copying the blocks, pruning a branch decrements it, and a block is freed only at zero. Against the same tree stored per branch, that is 96.6 percent less VRAM.

## Gather, GQA head expansion and softmax fuse into one launch instead of three

A standard engine materialises an intermediate tensor between each launch, while the Triton kernel does the gather, the GQA head expansion and the scaled dot-product in a single pass. The softmax runs online in FlashAttention's numerically stable form, so memory tracks the block size and not the sequence length. The 2.54x traces to the removed launch overhead and the removed intermediate allocations.

## The reads that beat the HBM peak land in L2 at about 5 TB/s

Shared prefix blocks are read by every branch that references them, so they stay resident in L2 at roughly 5 TB/s. The effective bandwidth counts the bytes the kernel consumed, so a single HBM fetch is charged to every branch that reads the block.

## One kernel source autotunes across A100, H100 and RTX

I wrote the kernel in Triton. Its autotuner searches the launch configuration per target, so a new architecture costs a re-tune and no second kernel.
