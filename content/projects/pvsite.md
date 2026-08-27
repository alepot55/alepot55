## 628,168 of 677,534 parcels are out before anything expensive runs

Statutory eligibility runs first and it is cheap: motorway buffers, industrial areas, closed quarries, closed landfills, sites with an existing plant, combined with OR, a partial overlap enough. On Viterbo it removes 92.7 percent of the province. The thirteen constraint layers and the seven weighted criteria only ever run on the 49,366 that survive.

## 611 parcels are large enough on their own, not 45,728

45,728 come out ranked, but the ranking is per parcel and the average parcel holds 0.22 usable hectares. The client's smallest plant is 1.5 MWp, needing 2.25 usable hectares at 15,000 square metres per MWp, and 611 parcels clear that alone. The rest rank because they are legally clean and can be assembled with their neighbours.

Usable hectares are the part of a parcel falling inside a statutory category, not its cadastral area. On Viterbo the two differ by almost half: 17,838 cadastral hectares against 10,041 usable.

## An unverifiable constraint returns undetermined, never zero

A parcel whose landslide layer never answered comes out undetermined, and undetermined is never admissible. When a region has no source for a layer at all, every parcel in it comes out undetermined and the province delivers no leads. Each row names the layer that was never queried, so the next action is to call the municipality rather than to open an empty file.

## Every run writes a lock file, because the rule set gets asked about six months later

Each run emits a CSV, a GeoPackage of the geometries, and a lock file recording the commit and the version of the law that produced them. A weekly canary re-downloads the article from Normattiva and fails the build if the text changed. 55 test modules guard the pipeline, and the ones that matter assert that the CSV and the portal agree, because they once did not.

## Two bugs that CI stayed green through

Both came from running a real province, and each cost one criterion everywhere. A single badly digitised airport ring wiped an entire layer for a province, because the union ran on the raw rings and the repair ran after it. A public Overpass endpoint that resolved IPv6 only returned a network error with no HTTP code, so it never reached the retry loop and a layer went silently missing.

## What it does not claim

It surfaces land worth a phone call. Between a parcel that falls in a category and touches no known constraint, and a site anyone can build on, sit a planning certificate, a grid connection quote and a full review. No site it has found has been built on yet.
