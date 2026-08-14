## The problem

Finding land for a ground-mounted photovoltaic plant in Italy starts from the cadastre, and an Italian province holds one to two million parcels. Somewhere in there are a few thousand worth a phone call. The rest are ruled out by law, by a protected area, by slope, by being too small for a plant to exist on at all.

Doing that by hand is not slow, it is impossible. Doing it badly is worse than not doing it: a list that looks authoritative and is wrong costs a salesperson weeks.

## Three stages, in this order

**Who is eligible.** The first question is not "is this land agricultural?" but "does it fall into a statutory category that permits ground-mounted PV?". The law lists them: motorway buffers, industrial areas, closed quarries, sites with existing plants. They combine with OR, and a partial overlap is enough. This stage discards roughly $80\%$ of the territory before anything else is computed, which is what makes the rest affordable.

**Who is excluded.** On what survives, the constraints are checked: parks, Natura 2000, landscape protection, landslide and flood hazard. This is a boolean, legal check, not a score. A site inside Natura 2000 does not become buildable because it has excellent irradiance.

The rule that took the longest to get right is the third state. A constraint that could not be verified does not count as zero. The parcel comes out **undetermined**, and undetermined is never admissible. When a whole region has no data source for a given constraint, every parcel in it comes out undetermined and the province delivers no leads at all. That is the correct answer, and the output says so: each row carries which layer was never queried, so the action is "ask the municipality" instead of an empty file.

**In what order.** The survivors are ranked on seven weighted criteria: usable area, distance to the substation, slope, plot shape, forest cover, share free of penalty constraints, and the legal solidity of the statutory category. The weights live in a file that can be read and argued with. Every score carries a **confidence** equal to the share of its weight backed by data that was actually available.

## Usable area, not cadastral area

The area that counts is the part of the parcel that falls inside a statutory category, not the parcel as registered. The two diverge by an order of magnitude.

Below $2.25$ usable hectares the criterion is zero, not small: that is the $1.5$ MWp minimum plant at $15{,}000$ m² per MWp. It is not land that yields little, it is land on which no plant is born.

## Reproducibility as an output

Every run writes three files: a CSV that opens in Excel and QGIS, a GeoPackage with the geometries, and a lock file recording the exact commit and rule set that produced the list. The third one exists so that "this list from March, which rules made it?" has an answer six months later that is not "nobody knows any more".

The same discipline runs through the test suite: 55 test modules, and the guards that matter are the ones asserting the CSV and the portal agree, because they once did not.

## What it does not say

The portal surfaces land worth looking at. It does not say a site is authorisable. Between "this parcel falls in a category and touches no known constraint" and "you can build here" sit a planning certificate, a grid connection quote and a full review. The engine shortens the first half of the work and does not touch the second, and the documentation says so in twelve numbered points before anyone reaches a result.

The interesting bugs came from running the real analysis, not from the tests. A single badly digitised airport ring wiped an entire layer for a province, because the union ran on raw rings and the repair ran after it. A public Overpass endpoint that resolves IPv6 only returned a network error that was not an HTTP code, so it never reached the retry loop and a layer went silently missing. Neither was red in CI, and each cost one criterion on every province of a national run.
