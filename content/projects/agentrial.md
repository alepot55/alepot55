## In short

- Agents get shipped after one successful run, yet the same agent with the same prompt and the same model can pass on Monday and fail on Wednesday: research reports up to 72 percent variance across runs, even at `temperature=0`.
- agentrial treats agent evaluation as a statistical problem: run the agent N times, put Wilson confidence intervals on every metric, and use Fisher exact test to attribute a failure to a specific step of the pipeline.
- It wraps any agent stack through adapters, tracks real cost across 45 or more models, and runs drift detectors against production traffic.
- Published on PyPI as an open-source MIT package, with 450 passing tests and a VS Code extension for inline results.

## Why one run is not evidence

A single successful run tells you nothing about production reliability. Pass or fail hides both the variance and the location of the failure.

What agent evaluation needs instead:

- Multiple trials, not one
- Proper statistical tests on the results
- A record of *where* a failure happened, not just *that* one happened

I built agentrial because I was tired of anecdotes and wanted confidence intervals.

## What the framework provides

The framework wraps around any agent (LangGraph, CrewAI, AutoGen, OpenAI Agents SDK, or custom) and provides:

- **Multi-trial execution** with configurable parallelism
- **Wilson confidence intervals** on every metric
- **Step-level failure attribution** via Fisher exact test: if step 3 fails 40 percent of the time, you see it
- **Real cost tracking** across 45 or more models, with per-test breakdowns
- **Drift detection** for production: CUSUM, Page-Hinkley and Kolmogorov-Smirnov detectors catch regressions before users do
- **Agent Reliability Score (ARS)**, a composite metric from 0 to 100 combining success rate, latency, cost and consistency

The methodology is borrowed from clinical trials: repeat the run, bound the pass rate, then isolate the weak link instead of guessing at it.

## Design decisions

- **Local-first, no SaaS.** Everything runs on your machine, with no telemetry and no cloud dependency. Tests are defined in YAML or Python, results are stored locally, and the runner integrates with CI/CD through GitHub Actions.
- **Framework-agnostic.** The adapter-based architecture keeps support for a new framework at roughly 50 lines of code, and the 6 built-in adapters already cover the majority of the ecosystem.
- **MCP security scanner.** As Model Context Protocol tools proliferate, the built-in scanner analyzes MCP integrations for common vulnerabilities before they reach production.

## Status

The package is published on PyPI under an MIT license, with 450 passing tests and a VS Code extension that shows results inline.

The goal is to make "we ran it once and it worked" an unacceptable standard for agent deployment.
