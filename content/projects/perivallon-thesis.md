## At 120 cm and a 176 pixel input, the activation map is a 6 by 6 grid

The annotations are image-level labels, so where comes out of the classifier's activation map, whose resolution the network stride sets. A landfill covers part of one cell, and the map cannot point at it even when the classifier is confident. Enlarging the input at inference makes the grid finer without touching a weight, at a compute cost quadratic in the side.

## The readout law is `cell = max(0.47 * object_size, 5.5 * GSD)`, fitted on 26,041 objects

I fitted the law on per-object observations from five sources: it sets the output cell for a given object size and ground sampling distance, and its error is 0.409 doublings on the fit against 0.411 on held-out aerial data.

## The readout that moves the pointing game 0.080 to 0.307 drops AUROC 0.790 to 0.719

Both at 120 cm, six seeds per readout size: the change that fixes pointing hurts deciding. At 30 cm the classifier falls to chance, AUROC 0.581 and F1 0.000, while the map still places 71.6 percent of annotated sites inside the hottest 10 percent of area. On a second dataset and a second sensor, aerial orthophotos, AUROC moves minus 17.8 percent and the pointing game plus 148.8 percent, bootstrap interval minus 0.210 to minus 0.144.

## At 1 percent of territory visited the enlarged readout finds about 2.5 times as much at 120 cm

An inspector asks what share of sites a given amount of territory visited turns up. At 5 percent visited:

| Ground resolution | Native readout | Enlarged readout |
| --- | --- | --- |
| 120 cm | 0.243 | 0.463 |
| 60 cm | 0.550 | 0.736 |
| 30 cm | 0.709 | 0.762 |

## A model beat the oracle of its own grid on 2026-07-25, and the rewrite found three defects

Every experiment registers its prediction before the measurement, and the log keeps both. That impossible score sent me back through the localisation evaluation, where one of three defects biased the IoU by an amount that depended on grid size, and grid size is what the thesis compares. Only post-rewrite numbers appear here, and a per-object ceiling of 0.772 was retracted afterwards as a best-of-four that chance beats.

## Validation rank predicts test rank at Spearman 0.966 across 44 configurations

On recall at 10 percent of area, the configuration picked on validation is also the best on test. The work sits inside PERIVALLON, a Horizon Europe project; the repository is private and the thesis is in writing for December 2026.
