## The PUN stopped being the settlement price on 1 January 2025

Italian buyers now clear on GME/IPEX at the price of their own zone: NORD, CNOR, CSUD, SUD, CALA, SICI, SARD. GME still publishes PUN Index GME after the fact, as a volume-weighted average of the zonal prices.

## LightGBM on 6 feature families, against a daily-recalibrated LASSO

Features: price lags, rolling statistics, residual demand (load net of renewable generation), calendar encoding, gas TTF and weather. The baseline is LEAR, the standard in the electricity price forecasting literature, run through epftoolbox with a fallback to `sklearn.linear_model.LassoLarsIC` when the library API drifts between versions.

## The naive to beat is the price 168 hours earlier

Scoring is rMAE, never MAPE, which blows up near the zero and negative prices renewable surplus produces in Europe.

$$\text{rMAE} = \frac{\text{MAE}_{\text{model}}}{\text{MAE}_{\text{naive}}}, \qquad \hat{p}^{\,\text{naive}}_{t} = p_{t-168}$$

- `MAE_model`: mean absolute error of the model being scored
- `MAE_naive`: mean absolute error of the naive, the price one week back
- below 1 means the model beat that naive

## Absolute error runs 7.4 EUR/MWh in the north to 10.5 on Sicily

The last 60 days of history are held out, and across six monthly walk-forward folds no zone crossed 0.6 rMAE. These are offline holdout numbers: the model has not yet run live in shadow mode.

## Five scheduled jobs, and 15-minute ENTSO-E data resampled to hourly

Celery beat runs each with exponential-backoff retry.

| job | cadence |
|---|---|
| price ingest, ENTSO-E | hourly |
| weather ingest, Open-Meteo forecast plus ERA5 | six-hourly |
| TTF gas pull | daily |
| day-ahead forecast | 10:30 |
| retrain | Monday |

Timestamps are UTC in TimescaleDB hypertables, compressed past 30 days, and converted to Europe/Rome only at render time. ENTSO-E has published at 15-minute resolution since 1 October 2025, so the ingest client downsamples before writing.

## Three VaR methods, four stress tests, and a CI gate at 5 percent

The risk side computes parametric, historical and Monte Carlo VaR with Expected Shortfall under enforced position limits, then stresses the book against a gas spike, renewable surplus, north-south congestion and a winter demand peak. The backtest fills at the next hour's price and runs a Diebold-Mariano test against the seasonal naive. The CI gate caught more of my own mistakes than the unit tests did: it fails a merge when per-horizon MAE regresses by more than 5 percent, or when empirical coverage leaves the 0.78 to 0.82 window.
