## In short

- **Problem.** Illegal landfills can be spotted from the air, but the annotations that exist are image-level labels, not boxes. A classifier trained on those labels can be asked *where* through its activation map, and that map degrades fast as satellite ground resolution drops from 30 cm to 120 cm.
- **Finding 1, a law.** The output cell of the activation map should be `cell = max(0.47 * object_size, 5.5 * GSD)`. Fitted on 26,041 per-object observations across five sources, it holds out on aerial data with no generalisation gap: 0.409 doublings of error on the fit against 0.411 held out.
- **Finding 2, a free lever.** Feeding the *same frozen weights* a larger input at inference time roughly doubles localisation at 120 cm: recall at 10 percent of area goes from 0.282 to 0.560, the pointing game from 0.080 to 0.307. No retraining, no new labels.
- **The surprise.** The lever makes the model *worse* at deciding whether an image contains a landfill while making it better at saying where. That dissociation replicates on a second dataset and a second sensor.
- **State.** Seventy logged experiments, thesis in writing, target graduation December 2026. The repository is private, and it is university work inside PERIVALLON (Horizon Europe).

## Why the lever is interesting

A convolutional or transformer backbone trained for classification produces an activation map whose resolution is set by the network stride, not by the object. At 120 cm ground resolution and a 176 pixel input, that map is a 6 by 6 grid over the whole scene. A landfill occupies a fraction of one cell, so the map cannot point at it even when the classifier is confident it is there.

Enlarging the input at inference makes the grid finer without touching a single weight. The cost is real, quadratic in the side, but it is inference compute rather than annotation effort, and annotation is the scarce resource here.

## The dissociation

The same change that fixes pointing hurts deciding. Measured at 120 cm across readout sizes, on six seeds per cell:

- classification AUROC falls from 0.790 to 0.719, about 9 percent
- localisation recall at 10 percent of area rises from 0.281 to 0.563, about 100 percent

Pushed to the extreme at 30 cm, the classifier reaches chance (AUROC 0.581, F1 0.000) while the map still places 71.6 percent of the annotated sites inside the hottest 10 percent of area. The two abilities are not the same ability, and a single number cannot report both.

This is not a property of one dataset. On a different dataset and a different sensor, aerial orthophotos rather than satellite, AUROC moves minus 17.8 percent while the pointing game moves plus 148.8 percent, with a bootstrap interval of minus 0.210 to minus 0.144.

## What it is worth operationally

The question an inspector actually asks is how much illegal waste gets found for a given amount of territory visited. Visiting 5 percent of the territory, share of annotated sites found:

- at 120 cm, native readout: 0.243
- at 120 cm, enlarged readout: 0.463
- at 60 cm, native: 0.550, enlarged: 0.736
- at 30 cm, native: 0.709, enlarged: 0.762

The lever is worth most exactly where the imagery is cheapest, which is the useful direction. At 1 percent of territory it is worth about 2.5 times at 120 cm.

## Method, and one thing that went wrong

Every experiment registers its prediction before the measurement is taken, and the log keeps both. Seventy of them are recorded.

The discipline paid for itself on 2026-07-25. A model scored *above the oracle of its own grid*, which is impossible. The whole localisation evaluation was rewritten, and it had three defects, one of which biased the IoU by an amount that depended on grid size, which is precisely the comparison the thesis is about. Only post-rewrite numbers are reported anywhere. A separate per-object ceiling of 0.772 was retracted afterwards when it turned out to be a best-of-four that chance beats.

Choosing configurations on validation rather than test is checked rather than assumed: across 44 configurations, the Spearman correlation between validation and test rank is 0.966 on recall at 10 percent of area, and the configuration picked on validation is also the best on test.
