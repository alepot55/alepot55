## Motivation

Italian day-ahead electricity prices are set zonally on the GME/IPEX exchange, and on 1 January 2025 the single national price (PUN) was abolished as the dispatch reference. That makes per-zone forecasting (NORD, CNOR, CSUD, SUD, CALA, SICI, SARD) the practical problem for anyone trading or hedging Italian power. I wanted a system that did the whole thing end to end: ingest the data, engineer the features, train and evaluate the model, serve forecasts through an API, and surface them in a dashboard a trader could actually read.

## The Model

The core forecaster is a LightGBM regressor with explicit feature engineering rather than a black-box deep model: price lags, rolling statistics, residual demand (load net of renewable generation), calendar encoding, gas TTF, and weather. The baseline is LEAR, the daily-recalibrated LASSO model that is standard in the electricity price forecasting literature, via epftoolbox with a transparent fallback to `sklearn.linear_model.LassoLarsIC` when the library API drifts between versions.

Everything is scored with rMAE against a weekly naive forecast, never MAPE:

$$\text{rMAE} = \frac{\text{MAE}_{\text{model}}}{\text{MAE}_{\text{naive}}}, \qquad \hat{p}^{\,\text{naive}}_{t} = p_{t-168}$$

MAPE is banned on purpose: it blows up near zero or negative prices, which are common in the European market once renewable surplus pushes prices below zero. On the synthetic development dataset the LightGBM model reaches rMAE $\approx 0.52$, comfortably inside the "good" range. The honest caveat is that real ENTSO-E numbers wait on an API token (registration takes a few working days), so $0.52$ is a development figure, not a production claim.

## The Stack

The model is the easy part. Most of the work is the production system around it. Prices, load, and generation come from ENTSO-E, weather from Open-Meteo (forecast plus ERA5 archive), and gas from TTF futures. Celery beat schedules the ingestion (hourly prices, six-hourly weather, a daily gas pull, a 10:30 day-ahead forecast, a Monday retrain), and every task has exponential-backoff retry. It all lands in TimescaleDB hypertables with chunk compression past 30 days. An async FastAPI backend serves it, a Streamlit dashboard reads it, and the whole thing runs under Docker Compose with an nginx and Let's Encrypt overlay for production.

A detail I cared about: all timestamps are UTC in the database, and the conversion to Europe/Rome happens only at render time in the frontend. ENTSO-E data after 1 October 2025 arrives at 15-minute resolution, so the client always resamples to hourly before persisting.

## Risk and Backtesting

Forecasting is only half of a trading tool. The system computes parametric, historical, and Monte Carlo VaR with Expected Shortfall, enforces position limits, and runs four predefined stress tests (gas spike, renewable surplus, north-south congestion, winter demand peak). The backtest engine does walk-forward iteration with no look-ahead bias, fills at the next hour's price, reports annualized Sharpe and Sortino with max drawdown, and runs a Diebold-Mariano test against the seasonal naive to check whether the edge is statistically real rather than lucky.

## What I Learned

The biggest lesson was that the metric choice is a modeling decision, not an afterthought. Switching from MAPE to rMAE against a seasonal-168 baseline changed which models looked good, because the naive weekly forecast is genuinely hard to beat on a market with strong weekly seasonality. The second lesson was operational: a forecasting model in a notebook is a demo, but a model behind scheduled ingestion, retry logic, a regression gate in CI, and a dashboard that falls back to deterministic synthetic data (clearly badged, never a silent hallucination) is a system. The CI gate in particular, which fails a merge when per-horizon MAE regresses by more than 5 percent or empirical coverage leaves the $[0.78, 0.82]$ window, caught more of my own mistakes than the unit tests did.
