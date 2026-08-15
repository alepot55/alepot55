## In short

- **Problem:** a market maker quotes both sides continuously and earns the spread, against inventory risk on the position it accumulates and adverse selection from informed traders picking off stale quotes.
- **Mechanism:** a from-scratch L2 order book, the Avellaneda-Stoikov analytical policy, a PPO agent trained in the same simulator, and Z3 proofs that the book invariants hold for every input.
- **Measured:** about 134K orders per second in pure Python, 4 invariants proved in under 6ms each, and Avellaneda-Stoikov ahead of the PPO agent on every risk metric over 5,000 steps.
- **State:** the whole stack runs in pure Python. The Cython/CUDA matching engine that would target more than 10M orders per second is a design, not an implementation.

## The tradeoff being modelled

- Tighter spreads mean more fills and more adverse selection.
- Wider spreads mean fewer fills and less adverse selection.
- The optimum moves with inventory and with volatility, so the quote has to be recomputed continuously.

I wanted to understand this tradeoff quantitatively, so I built the entire stack from scratch: order book engine, analytical model, RL agent, and formal verification.

## The limit order book engine

- L2 order book with price-time priority matching.
- Supports limit orders, market orders, and cancellations.
- Pure Python throughput of about 134K orders per second.
- Bottlenecks: dict lookup for price levels, and linear scan for sorted insertion.
- A Cython/CUDA implementation would target more than 10M orders per second with parallel price-level matching.

## The two policies compared

**Avellaneda-Stoikov.** The analytical optimal market making model (Avellaneda and Stoikov, 2008), used as the baseline.

**PPO agent.** A reinforcement learning agent trained for 500K timesteps in a Gymnasium environment.

Both run in the same simulator:

- GARCH(1,1) price dynamics.
- Background agents: noise traders, momentum traders, and mean-reversion traders.

## The Avellaneda-Stoikov formulas

The model computes a reservation price and an optimal spread in closed form.

$$r = s - q \cdot \gamma \cdot \sigma^2 \cdot \tau$$

$$\delta = \gamma \cdot \sigma^2 \cdot \tau + \frac{2}{\gamma} \cdot \ln\left(1 + \frac{\gamma}{\kappa}\right)$$

- `s`: mid-price
- `q`: inventory
- `gamma`: risk aversion
- `sigma`: volatility
- `tau`: time remaining
- `kappa`: order arrival intensity

The reservation price shifts away from mid whenever inventory is non-zero. A long position, `q` above zero, lowers the reservation price, which makes the ask more attractive and pushes inventory back towards flat. That mean reversion is provable, and I confirmed it with Z3.

## What Z3 proves

Four invariants, each proved for all possible inputs rather than for tested cases:

1. No crossed book.
2. Positive spreads.
3. Inventory mean-reversion.
4. Price-time priority.

Each property is verified in under 6ms.

## Results over 5,000 steps

Avellaneda-Stoikov leads the PPO agent on every metric:

- Sharpe ratio: -25.03 against -441.61.
- Inventory standard deviation: 7.19 against 22.40.
- Max drawdown: 2.99 against 19.23.

The PPO agent still learns a non-trivial policy: inventory standard deviation of 22.40 against 40.97 for a random baseline, plus adaptive spreads. It does not reach the analytical optimum.

That is the expected outcome. Avellaneda-Stoikov computes the closed-form solution under its own model assumptions, while PPO has to discover the strategy from noisy reward signals dominated by stochastic price moves. A structured reward decomposition separating spread capture from inventory mark-to-market would likely close the gap, a known challenge in RL for market making (Spooner et al., 2018).

## What I learned

Formal verification complements statistical testing instead of replacing it. 85 unit tests cover specific scenarios, while Z3 proves that no crossed book and positive spread hold for every parameter combination. The proofs run in milliseconds and give a guarantee that no amount of testing can match.

The reinforcement learning lesson was about reward shaping:

- The composite reward `step_pnl - lambda * q^2` is dominated by stochastic PnL noise.
- The inventory penalty is therefore hard to learn from, and explained variance stayed near 0 throughout training.
- Decomposing the reward into separate spread capture and inventory components would give the agent cleaner learning signals.
