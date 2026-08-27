## In short

- **Client.** An independent renewable energy developer, working in Italian solar and in power trading.
- **Built.** Two systems that run and produce real output rather than demos: pvsite, which finds land where a photovoltaic plant can legally be built, and Energy Forecast IT, which forecasts day-ahead electricity prices per bidding zone. Both run on the client's own machines, not on a public site.
- **Measured.** pvsite has screened 677,534 cadastral parcels in one province and returned 45,728 ranked sites. Energy Forecast IT reaches rMAE between 0.34 and 0.39 in all seven zones on real ENTSO-E history.
- **The constraint that shaped both.** A wrong answer that looks authoritative is worse than no answer, so both systems are built to say "undetermined" rather than to guess.

## pvsite: which land is legally buildable

The engine reads an entire province out of the cadastre and returns the parcels where a ground-mounted photovoltaic plant can legally stand, each one carrying the reason it survived. It runs three ordered stages: statutory eligibility, then legal exclusions, then a weighted ranking.

The design decision that matters is the third truth value. A constraint that could not be verified, because a source is missing or does not cover that territory, does not silently pass. It returns undetermined, and an undetermined parcel is never presented as admissible.

## Energy Forecast IT: what the power will cost tomorrow

Since 2025 Italian buyers settle at their own zone's price rather than at a single national one, so a forecast has seven targets. The system ingests prices, load, generation, weather and gas on a schedule, trains per zone, and serves the forecasts behind an API and a dashboard, with risk limits and walk-forward backtesting alongside.

## How the work runs

The client is not a software team, so the deliverable is not a repository. Each pvsite run ships a CSV, a GeoPackage and a lock file recording the commit and the exact rule set that produced it, so a result can be defended months later against the version of the law that was in force when it was computed.

Both systems are reviewed against parcels and prices the client already knows the answer to. That is the only calibration that counts here: the test is not whether the output looks plausible, it is whether it agrees with the sites a person who does this for a living already judged.
