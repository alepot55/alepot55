## In short

- **Problem:** an Italian province holds one to two million cadastral parcels and only a few thousand are worth a phone call, and a list that looks authoritative and is wrong costs a salesperson weeks.
- **Mechanism:** three ordered stages, statutory eligibility, then legal exclusions, then a weighted ranking, with a third truth value so that an unverifiable constraint yields undetermined instead of zero.
- **Measured:** on the province of Viterbo, 677,534 cadastral parcels in and 45,728 out, 17,838 hectares. The eligibility stage does most of that work before anything expensive is computed.
- **State:** every run ships a CSV, a GeoPackage and a lock file with the commit and the rule set, guarded by 55 test modules. The portal surfaces land worth looking at, never a site that is authorisable.

## The input, and why it cannot be done by hand

Finding land for a ground-mounted photovoltaic plant in Italy starts from the cadastre, and an Italian province holds one to two million parcels. Somewhere in there are a few thousand worth a phone call. The rest are ruled out by law, by a protected area, by slope, or by being too small for a plant to exist on at all.

Doing that by hand is not slow, it is impossible. Doing it badly is worse than not doing it: a list that looks authoritative and is wrong costs a salesperson weeks.

## Stage 1: who is eligible

The first question is not "is this land agricultural?" but "does it fall into a statutory category that permits ground-mounted PV?". The law lists the categories:

- motorway buffers
- industrial areas
- closed quarries
- sites with existing plants

They combine with OR, and a partial overlap is enough. Most of the province never gets past this stage, which is what makes the expensive checks affordable: on Viterbo, 628,168 of the 677,534 parcels are out before ranking begins.

## Stage 2: who is excluded

On what survives, the constraints are checked:

- parks
- Natura 2000
- landscape protection
- landslide hazard
- flood hazard

This is a boolean, legal check, not a score. A site inside Natura 2000 does not become buildable because it has excellent irradiance.

## The third truth value

The rule that took the longest to get right. A constraint that could not be verified does not count as zero: the parcel comes out **undetermined**, and undetermined is never admissible.

When a whole region has no data source for a given constraint, every parcel in it comes out undetermined and the province delivers no leads at all. That is the correct answer, and the output says so: each row carries which layer was never queried, so the action is "ask the municipality" instead of an empty file.

## Stage 3: in what order

The survivors are ranked on seven weighted criteria:

1. usable area
2. distance to the substation
3. slope
4. plot shape
5. forest cover
6. share free of penalty constraints
7. legal solidity of the statutory category

The weights live in a file that can be read and argued with. Every score carries a **confidence** equal to the share of its weight backed by data that was actually available.

## How usable area is computed

The area that counts is the part of the parcel that falls inside a statutory category, not the parcel as registered. The two diverge by an order of magnitude.

Below 2.25 usable hectares the criterion is zero, not small: that is the 1.5 MWp minimum plant at 15,000 m² per MWp. It is not land that yields little, it is land on which no plant is born.

## What every run writes

- a CSV that opens in Excel and QGIS
- a GeoPackage with the geometries
- a lock file recording the exact commit and rule set that produced the list

The lock file exists so that "this list from March, which rules made it?" has an answer six months later that is not "nobody knows any more".

The same discipline runs through the test suite: 55 test modules, and the guards that matter are the ones asserting the CSV and the portal agree, because they once did not.

## What the portal does not claim

The portal surfaces land worth looking at. It does not say a site is authorisable. Between "this parcel falls in a category and touches no known constraint" and "you can build here" sit a planning certificate, a grid connection quote and a full review.

The engine shortens the first half of the work and does not touch the second, and the documentation says so in twelve numbered points before anyone reaches a result.

## Two bugs the tests did not catch

Both came from running the real analysis rather than from the suite. Neither was red in CI, and each cost one criterion on every province of a national run.

- A single badly digitised airport ring wiped an entire layer for a province, because the union ran on raw rings and the repair ran after it.
- A public Overpass endpoint that resolves IPv6 only returned a network error that was not an HTTP code, so it never reached the retry loop and a layer went silently missing.
