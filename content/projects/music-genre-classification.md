## Motivation

Music genre classification sounds like a solved problem, until you look at how most papers evaluate their models. The standard GTZAN benchmark has a well-known data leakage issue: audio tracks are sliced into segments *before* splitting into train/test sets, meaning segments from the same song can appear in both. This inflates accuracy numbers and makes results unreproducible.

I wanted to build a pipeline that does it right: rigorous methodology first, state-of-the-art accuracy second.

## The Approach

**Leak-free data pipeline**: the critical step is splitting at the *track level* (60/20/20) before any audio slicing. Each 30-second track is sliced into 10 segments of 3 seconds only *after* the split. This guarantees no information leakage between train and test sets. This distinction changes reported accuracy by 5-10% compared to naive approaches.

**Feature extraction**: 128-bin log Mel-spectrograms computed from each 3-second segment, with the scaler fitted exclusively on training data. This is another common source of leakage that many pipelines miss.

**Architecture tournament**: three CNN architectures were designed and compared:
- **Efficient_VGG**: lightweight baseline inspired by VGG with reduced parameters
- **ResSE_AudioCNN**: residual blocks with squeeze-and-excitation attention
- **UNet_Audio_Classifier**: an encoder from U-Net architecture repurposed for classification

## Results

The U-Net encoder architecture achieved the best performance:

- **82-83% test accuracy** on GTZAN with proper leak-free evaluation
- **~90% cross-validation mean** demonstrating consistent performance
- **Strong transfer** to Indian Classical Music and Tabla Taala datasets without fine-tuning

These numbers are lower than many published results on GTZAN, and that's by design. Papers reporting 90%+ typically have data leakage in their evaluation pipeline. Our 83% with proper methodology is a more honest benchmark.

## What I Learned

The biggest takeaway was that **evaluation methodology is as important as model architecture**. The U-Net encoder wasn't a novel idea, but combined with a rigorous, leak-free pipeline, it outperformed supposedly superior architectures that were evaluated with flawed methodology. In ML research, honest evaluation is itself a contribution.

This project was a collaboration with Camilla Sed.
