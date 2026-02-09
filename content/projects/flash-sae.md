## Motivation

Sparse Autoencoders (SAEs) are one of the most promising tools in **Mechanistic Interpretability**, the field trying to understand what neural networks actually learn inside their weights. Anthropic's *Scaling Monosemanticity* paper showed that SAEs can extract human-interpretable features from large language models.

The problem: training SAEs on production-scale models is painfully slow. The standard PyTorch implementation materializes dense activation matrices even though >99% of latent features are inactive at any time. For a typical SAE with $n = 65{,}536$ features and top-$k = 64$, PyTorch allocates a matrix that is **$1{,}024\times$ larger** than necessary.

I built Flash-SAE to fix this.

## The Key Insight

SAE computation is inherently sparse, but PyTorch doesn't know that. The encoder selects only $k = 64$ active latents out of $65{,}536$, yet the decoder multiplies through the full dense matrix. By fusing the top-$k$ selection directly into the encoder kernel and using sparse scatter-gather operations in the decoder, we can skip the dense intermediate entirely.

## How It Works

**Sparse Encoder**: a single fused Triton kernel computes the projection, selects the top-$k$ activations, and returns only the sparse indices and values, never materializing the full $65{,}536$-dimensional hidden state.

**Sparse Decoder**: instead of creating a dense $[\text{batch}, n_{\text{features}}]$ matrix, the kernel directly scatter-gathers only the $k$ active columns. Memory usage drops from $O(\text{batch} \times n_{\text{features}} \times d_{\text{model}})$ to $O(\text{batch} \times k \times d_{\text{model}})$.

**Ghost Gradients**: dead latents (features that never activate) are a critical problem in SAE training. The kernel detects latents with zero activation over a sliding window and injects small gradient signals to revive them, all within the same fused kernel with no additional memory cost.

## Results

Benchmarked on RTX 4070, $\text{batch} = 1024$, $d_{\text{model}} = 4096$, $n_{\text{features}} = 65{,}536$, $k = 64$, bfloat16:

- **Decoder: $13.6\times$ speedup, 97% memory reduction.** The sparse gather avoids materializing the dense matrix entirely
- **Full forward pass: $1.78\times$ speedup, 25% memory reduction.** The encoder gains are modest, but the decoder dominates
- **FP8 quantization** on Ada Lovelace+ GPUs provides further memory savings

The library is a **drop-in replacement**: change one import line and get $13\times$ on the decoder. Full autograd compatibility means existing training loops work unchanged.

## Why It Matters

Mechanistic Interpretability is limited by compute. Researchers at Anthropic, EleutherAI, and independent labs need to train thousands of SAEs to map out the features of frontier models. Flash-SAE makes each training run nearly $2\times$ faster and uses significantly less memory, enabling larger-scale experiments on consumer hardware.
