## Motivation

Market makers continuously quote bid and ask prices, profiting from the spread while managing two fundamental risks: **inventory risk** (adverse price moves on accumulated positions) and **adverse selection** (informed traders picking off stale quotes). Optimal market making requires balancing tighter spreads for more fills against wider spreads for less adverse selection, while dynamically adjusting for inventory and volatility.

I wanted to understand this tradeoff quantitatively, so I built the entire stack from scratch: order book engine, analytical model, RL agent, and formal verification.

## Three Components

**Limit Order Book Engine.** An L2 order book with price-time priority matching, supporting limit orders, market orders, and cancellations. Pure Python throughput: ~134K orders/sec. The bottleneck is dict lookup for price levels and linear scan for sorted insertion. A Cython/CUDA implementation would target >10M orders/sec with parallel price-level matching.

**Avellaneda-Stoikov vs RL.** The analytical optimal market making model (Avellaneda & Stoikov, 2008) as a baseline, compared against a PPO agent trained for 500K timesteps in a Gymnasium environment with GARCH(1,1) price dynamics and background agents (noise traders, momentum traders, mean-reversion traders).

**Z3 Formal Verification.** Mathematical proofs that critical invariants hold for *all* possible inputs, not just tested cases: no crossed book, positive spreads, inventory mean-reversion, and price-time priority. All 4 properties verified in under 6ms each.

## The Avellaneda-Stoikov Model

The A-S model computes a **reservation price** and **optimal spread** analytically:

$$r = s - q \cdot \gamma \cdot \sigma^2 \cdot \tau$$

$$\delta = \gamma \cdot \sigma^2 \cdot \tau + \frac{2}{\gamma} \cdot \ln\left(1 + \frac{\gamma}{\kappa}\right)$$

Where $s$ is mid-price, $q$ is inventory, $\gamma$ is risk aversion, $\sigma$ is volatility, $\tau$ is time remaining, and $\kappa$ is order arrival intensity.

The key insight: the reservation price shifts *away* from mid when inventory is non-zero. A long position ($q > 0$) lowers the reservation price, making the ask more attractive and encouraging inventory reduction. This is provably mean-reverting, which I confirmed with Z3.

## Results

The A-S agent demonstrates superior risk management across all metrics. Over 5,000 steps, it achieves a Sharpe ratio of $-25.03$ vs $-441.61$ for the RL agent, with inventory std of $7.19$ vs $22.40$, and max drawdown of $2.99$ vs $19.23$.

The RL agent trained with PPO learns a non-trivial policy: it controls inventory better than a random baseline (std 22.40 vs 40.97 for random) and quotes adaptive spreads. But it does not outperform the analytical optimum. This is expected: A-S computes the closed-form solution under its model assumptions, while PPO must discover the strategy from noisy reward signals dominated by stochastic price moves.

A structured reward decomposition separating spread capture from inventory mark-to-market would likely close the gap. This is a known challenge in RL for market making (Spooner et al., 2018).

## What I Learned

The most interesting finding was how clearly formal verification complements statistical testing. 85 unit tests cover specific scenarios, but Z3 proves that no crossed book and positive spread invariants hold for *every* parameter combination. The proofs run in milliseconds and provide guarantees that no amount of testing can match.

On the RL side, the main lesson was about reward shaping. The composite reward ($\text{step\_pnl} - \lambda \cdot q^2$) is dominated by stochastic PnL noise, making the inventory penalty signal hard to learn from. Explained variance stayed near 0 throughout training. Decomposing the reward into separate spread capture and inventory components would give the agent cleaner learning signals.
