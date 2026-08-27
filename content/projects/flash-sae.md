## The dense path allocates a latent matrix 1,024x larger than the arithmetic

Anthropic's *Scaling Monosemanticity* showed that sparse autoencoders pull human-interpretable features out of a language model's activations. The encoder already selects the top-`k` latents, and the PyTorch decoder then multiplies through the full dense latent matrix anyway.

## Two fused Triton kernels take decoder memory to O(batch * k * d_model)

One kernel computes the projection, selects the top-`k`, and returns only the sparse indices and values, so the dense hidden state is never written. The decoder scatter-gathers the `k` active columns directly instead of building a `[batch, n_features]` intermediate, taking its memory down from `O(batch * n_features * d_model)`.

## Ghost gradients revive dead latents at zero added memory

Dead latents, features that stop firing, are a known failure mode in SAE training. The kernel tracks activation over a sliding window and injects a small gradient into the latents that show none, inside the same fused pass.

## 1.78x on the full forward pass and 25 percent less memory, on one RTX 4070

I measured in bfloat16 at one shape, on one consumer card. The decoder gain drives the total.

| parameter | value |
| --- | --- |
| `batch` | 1024 |
| `d_model` | 4096 |
| `n_features` | 65,536 |
| `k` | 64 |

## One import line switches it in, and the FP8 path is unmeasured

Existing training loops run unchanged. FP8 quantization on Ada Lovelace and later cuts memory further, and I have not measured by how much.
