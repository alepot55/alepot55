## In short

- **Problem:** Italian day-ahead prices are set zonally on GME/IPEX, and on 1 January 2025 the uniform national purchase price (PUN) stopped being how buyers settle, so demand now clears at the zonal price and forecasting has to be per zone across all seven of them.
- **Mechanism:** a LightGBM regressor with explicit feature engineering against a LEAR baseline, scored as rMAE versus the weekly naive, behind scheduled ingestion, TimescaleDB, an async FastAPI backend and a dashboard.
- **Development figure:** on the synthetic development dataset the LightGBM model reaches rMAE of about 0.52. That number comes from **synthetic data**, not from the market: no accuracy has been measured on real prices.
- **State:** the real ENTSO-E numbers wait on an API token, whose registration takes a few working days. Everything else, ingestion, model, API, risk, backtest and dashboard, runs end to end.

## The market

Italian day-ahead electricity prices are set zonally on the GME/IPEX exchange. On 1 January 2025 the uniform national purchase price (PUN) stopped being how Italian buyers settle on the day-ahead market: demand now clears at the price of its own zone, and GME publishes PUN Index GME after the fact as a volume-weighted average of the zonal prices. That makes per-zone forecasting, across NORD, CNOR, CSUD, SUD, CALA, SICI and SARD, the practical problem for anyone trading or hedging Italian power.

## What I set out to build

I wanted a system that did the whole thing end to end, not a notebook:

- ingest the data
- engineer the features
- train and evaluate the model
- serve forecasts through an API
- surface them in a dashboard a trader could actually read

## The model

- LightGBM regressor with explicit feature engineering, rather than a black-box deep model.
- Features: price lags, rolling statistics, residual demand (load net of renewable generation), calendar encoding, gas TTF, and weather.
- Baseline: LEAR, the daily-recalibrated LASSO model that is standard in the electricity price forecasting literature.
- LEAR runs via epftoolbox, with a transparent fallback to `sklearn.linear_model.LassoLarsIC` when the library API drifts between versions.

## How it is scored

Everything is scored with rMAE against a weekly naive forecast, never MAPE.

$$\text{rMAE} = \frac{\text{MAE}_{\text{model}}}{\text{MAE}_{\text{naive}}}, \qquad \hat{p}^{\,\text{naive}}_{t} = p_{t-168}$$

- `MAE_model`: mean absolute error of the model being scored
- `MAE_naive`: mean absolute error of the naive forecast
- the naive forecast is the price 168 hours earlier, one week back
- a value below 1 means the model beats that naive

MAPE is banned on purpose: it blows up near zero or negative prices, which are common in the European market once renewable surplus pushes prices below zero.

On the synthetic development dataset the LightGBM model reaches rMAE of about 0.52. The honest caveat is that real ENTSO-E numbers wait on an API token, and registration takes a few working days, so 0.52 is a development figure and not a production claim.

## The stack

The model is the easy part. Most of the work is the production system around it.

Data sources:

- prices, load, and generation from ENTSO-E
- weather from Open-Meteo, forecast plus ERA5 archive
- gas from TTF futures

Scheduling, under Celery beat, with exponential-backoff retry on every task:

- hourly prices
- six-hourly weather
- a daily gas pull
- a 10:30 day-ahead forecast
- a Monday retrain

Storage and serving:

- TimescaleDB hypertables with chunk compression past 30 days
- an async FastAPI backend
- a Streamlit dashboard
- Docker Compose, with an nginx and Let's Encrypt overlay for production

## Time handling

All timestamps are UTC in the database, and the conversion to Europe/Rome happens only at render time in the frontend. ENTSO-E data after 1 October 2025 arrives at 15-minute resolution, so the client always resamples to hourly before persisting.

## Risk and backtesting

Forecasting is only half of a trading tool. The risk side computes:

- parametric, historical, and Monte Carlo VaR with Expected Shortfall
- enforced position limits
- four predefined stress tests: gas spike, renewable surplus, north-south congestion, winter demand peak

The backtest engine:

- walk-forward iteration with no look-ahead bias
- fills at the next hour's price
- annualized Sharpe and Sortino with max drawdown
- a Diebold-Mariano test against the seasonal naive, to check whether the edge is statistically real rather than lucky

## What I learned

The metric choice is a modeling decision, not an afterthought. Switching from MAPE to rMAE against a seasonal-168 baseline changed which models looked good, because the naive weekly forecast is genuinely hard to beat on a market with strong weekly seasonality.

The second lesson was operational. A forecasting model in a notebook is a demo, while a model behind scheduled ingestion, retry logic, a regression gate in CI, and a dashboard that falls back to deterministic synthetic data (clearly badged, never a silent hallucination) is a system.

The CI gate in particular caught more of my own mistakes than the unit tests did. It fails a merge when per-horizon MAE regresses by more than 5 percent, or when empirical coverage leaves the 0.78 to 0.82 window.
