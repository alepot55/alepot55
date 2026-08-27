## Slicing before the split moves GTZAN accuracy by 5 to 10 percent

The usual pipeline cuts each track into segments and then draws the train and test sets, so segments of one song sit on both sides of the split. Reordering the two steps changes the reported number by 5 to 10 percent. Published GTZAN scores above 90 percent generally come from the leaky ordering.

## 60/20/20 across tracks first, then 10 segments of 3 seconds

| Stage | Choice |
| --- | --- |
| Split | 60/20/20 across tracks, before any audio is cut |
| Slice | each 30-second track becomes 10 segments of 3 seconds |
| Features | 128-bin log Mel-spectrogram per segment |
| Normalisation | scaler fitted on the training segments only |

The scaler is the second leak, and it survives a correct track-level split.

## 3 architectures trained on the same leak-free split

| Model | Design |
| --- | --- |
| Efficient_VGG | VGG-inspired baseline with reduced parameters |
| ResSE_AudioCNN | residual blocks with squeeze-and-excitation attention |
| UNet_Audio_Classifier | a U-Net encoder repurposed for classification |

Each is scored on segments from tracks held out before slicing.

## 82 to 83 percent test accuracy, cross-validation mean near 90 percent

The U-Net encoder was the best of the three: 82 to 83 percent on the GTZAN test tracks, and a cross-validation mean around 90 percent over the same track-level folds.

## The same model transfers to 2 further datasets without fine-tuning

It classifies Indian Classical Music and Tabla Taala recordings with no fine-tuning on either. I built this with Camilla Sed in 2024.
