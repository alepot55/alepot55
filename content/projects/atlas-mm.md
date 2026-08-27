## The two bottlenecks are dict lookup and linear insertion, and the 10M/s fix is unwritten

The L2 engine matches on price-time priority and takes limit orders, market orders and cancellations, all in pure Python. Its ceiling sits in the dict lookup for price levels and the linear scan for sorted insertion. A Cython/CUDA rewrite with parallel price-level matching would target more than 10M orders per second; I designed it and never implemented it.

## Both policies quote into the same GARCH(1,1) book, PPO after 500K timesteps

Prices follow GARCH(1,1), and three kinds of background agent trade against the quotes: noise, momentum, and mean-reversion. Avellaneda and Stoikov (2008) solve for the reservation price and spread in closed form; the PPO agent trained 500K timesteps in a Gymnasium wrapper on that same simulator. A tighter spread buys fills and pays adverse selection, and the optimum moves with inventory and volatility, so the quote is recomputed every step.

## Inventory mean-reversion is one of the four invariants, each proved in under 6ms

The reservation price leaves mid whenever inventory is non-zero: a long position lowers it, making the ask more attractive and pulling inventory back to flat.

$$r = s - q \cdot \gamma \cdot \sigma^2 \cdot \tau$$

- `s`: mid-price
- `q`: inventory
- `gamma`: risk aversion
- `sigma`: volatility
- `tau`: time remaining

Z3 proves that property, along with no crossed book, positive spreads and price-time priority, for every input; the 85 unit tests only cover the cases I thought to write.

## Avellaneda-Stoikov leads on all three risk metrics over 5,000 steps

| Metric | Avellaneda-Stoikov | PPO |
| --- | --- | --- |
| Sharpe ratio | -25.03 | -441.61 |
| Inventory standard deviation | 7.19 | 22.40 |
| Max drawdown | 2.99 | 19.23 |

PPO does learn a policy: its inventory swing is about half the 40.97 of a random baseline, and its spreads adapt to the state.

## The reward is dominated by PnL noise, so explained variance stayed near 0

The composite reward `step_pnl - lambda * q^2` is swamped by stochastic price moves, so the inventory penalty is hard to learn from and explained variance stayed near 0 for the whole run. Splitting it into a spread-capture term and an inventory mark-to-market term would give the agent cleaner signals, a known difficulty in RL for market making (Spooner et al., 2018).
