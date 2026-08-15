## In short

- Published GTZAN results are inflated by data leakage: tracks are sliced into segments before the train/test split, so segments of the same song end up on both sides.
- I built a pipeline that splits at track level first and slices afterwards, with the scaler fitted only on training data.
- A U-Net encoder repurposed for classification reached 82 to 83 percent test accuracy under leak-free evaluation, with a cross-validation mean around 90 percent.
- The same model transfers to Indian Classical Music and Tabla Taala datasets without fine-tuning.

## The leakage problem in GTZAN

The standard benchmark slices audio tracks into segments before splitting into train and test sets. Segments from the same song then appear on both sides, which inflates accuracy numbers and makes results unreproducible.

Splitting properly changes reported accuracy by 5 to 10 percent compared to naive approaches.

## The pipeline

- **Track-level split first**: 60/20/20 across tracks, before any audio slicing
- **Slicing after the split**: each 30-second track becomes 10 segments of 3 seconds
- **Features**: 128-bin log Mel-spectrograms computed per 3-second segment
- **Scaler fitted on training data only**: another common source of leakage that many pipelines miss

## Architectures compared

- **Efficient_VGG**: lightweight baseline inspired by VGG, with reduced parameters
- **ResSE_AudioCNN**: residual blocks with squeeze-and-excitation attention
- **UNet_Audio_Classifier**: an encoder from the U-Net architecture repurposed for classification

## Results

The U-Net encoder architecture achieved the best performance:

- **82 to 83 percent test accuracy** on GTZAN with proper leak-free evaluation
- **Cross-validation mean around 90 percent**, so the performance is consistent
- **Strong transfer** to Indian Classical Music and Tabla Taala datasets without fine-tuning

These numbers sit below many published results on GTZAN, and that is by design. Papers reporting over 90 percent typically carry data leakage in their evaluation pipeline, so 83 percent measured properly is the more honest benchmark.

## What I took from it

Evaluation methodology matters as much as model architecture. The U-Net encoder was not a novel idea, but paired with a rigorous leak-free pipeline it outperformed supposedly superior architectures evaluated with flawed methodology.

In ML research, honest evaluation is itself a contribution.

This project was a collaboration with Camilla Sed.
