## In short

- **Teaching is the larger half.** Over 800 hours across four years, in machine learning, Python and algorithms, plus technical lead on university thesis projects.
- **Building is the other half.** Two production systems for an independent renewable energy developer, running on his machines and producing real output.
- **pvsite** reads an entire Italian province out of the cadastre and returns the parcels where a ground-mounted photovoltaic plant can legally be built: 677,534 parcels in, 45,728 out, each carrying the reason it survived.
- **Energy Forecast IT** forecasts day-ahead electricity prices for all seven Italian bidding zones, reaching rMAE between 0.34 and 0.39 on real ENTSO-E history.

## The teaching

Students rarely fail because the material is hard. They fail because a prerequisite is missing and nobody identified it, or because a subtly wrong mental model makes everything downstream confusing.

So the first job is diagnosing the actual gap rather than the apparent one. A student struggling with backpropagation may need the chain rule; a student stuck on concurrency may have a wrong model of what threads share. Then progressive problem solving: start just barely within reach, solve it together, add one step of complexity at a time.

Four years of it produced supervised theses in machine learning, computer vision, distributed systems and GPU computing, across Sapienza, Politecnico di Milano and other Italian universities.

## The client work

Both systems run on the client's own machines and produce real output, not demos. The client is not a software team, so the deliverable is not a repository: each pvsite run ships a CSV, a GeoPackage and a lock file recording the commit and the exact rule set that produced it, so a result can be defended months later against the version of the law in force when it was computed.

The design decision that shaped both is the same. A wrong answer that looks authoritative is worse than no answer, so a constraint that could not be verified returns undetermined rather than passing quietly, and an undetermined parcel is never presented as admissible.

Calibration is against reality, not plausibility. Both systems are checked on parcels and prices the client already knows the answer to. The test is not whether the output looks reasonable, it is whether it agrees with the sites someone who does this for a living already judged.

## Why both

Teaching is the fastest way to find the assumptions you stopped questioning. Every student who asks why something works the way it does forces one back into the open, and that has made me a better engineer on the client work too. It runs the other way as well: a system that has to defend its answers to a paying client is where the examples come from.
