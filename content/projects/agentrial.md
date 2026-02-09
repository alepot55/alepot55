## Motivation

AI agents are unreliable. The same agent, same prompt, same model can pass on Monday and fail on Wednesday. Research shows LLMs exhibit up to **72% variance** across runs, even at `temperature=0`. Yet the standard practice is to run an agent once, see it work, and ship it.

I built agentrial because I was tired of anecdotes. I wanted **confidence intervals**.

## The Core Insight

Agent evaluation is a statistical problem, not a pass/fail one. A single successful run tells you nothing about production reliability. You need multiple trials, proper statistical tests, and a framework that tracks *where* failures happen, not just *that* they happen.

agentrial borrows from clinical trial methodology: run your agent $N$ times, compute Wilson confidence intervals on pass rates, and use Fisher's exact test to pinpoint which *step* in the pipeline is the weak link. No more guessing.

## What It Does

The framework wraps around any agent (LangGraph, CrewAI, AutoGen, OpenAI Agents SDK, or custom) and provides:

- **Multi-trial execution** with configurable parallelism
- **Wilson confidence intervals** on every metric
- **Step-level failure attribution** via Fisher exact test: if step 3 fails 40% of the time, you see it
- **Real cost tracking** across 45+ models with per-test breakdowns
- **Drift detection** for production: CUSUM, Page-Hinkley, and Kolmogorov-Smirnov detectors catch regressions before users do
- **Agent Reliability Score (ARS)**: a composite $[0, 100]$ metric combining success rate, latency, cost, and consistency

## Design Decisions

**Local-first, no SaaS.** agentrial runs entirely on your machine. No telemetry, no cloud dependency. Tests are defined in YAML or Python, results are stored locally, and everything integrates with CI/CD via GitHub Actions.

**Framework-agnostic.** Adapter-based architecture means adding support for a new framework is ~50 lines of code. The 6 built-in adapters cover the majority of the ecosystem.

**MCP Security Scanner.** As Model Context Protocol tools proliferate, security becomes critical. The built-in scanner analyzes MCP integrations for common vulnerabilities before they reach production.

## Impact

The project is published on PyPI as an open-source package with MIT license, 450 passing tests, and a VS Code extension for inline results. The goal is to make "we ran it once and it worked" an unacceptable standard for agent deployment.
