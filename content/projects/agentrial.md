## Research reports up to 72 percent variance between runs at `temperature=0`

The same agent, with the same prompt and the same model, can pass on Monday and fail on Wednesday. One green run bounds nothing, and it does not name the step that broke. I built agentrial in 2026 to run the agent N times and put an interval around the pass rate.

## Wilson bounds the rate, Fisher names the step, three detectors watch drift

| Statistic | What it decides |
| --- | --- |
| Wilson interval | the pass rate over N trials, with an upper and a lower bound |
| Fisher exact test | whether one step of the pipeline fails more often than the others |
| CUSUM, Page-Hinkley, Kolmogorov-Smirnov | whether production traffic has drifted away from what was tested |
| Agent Reliability Score | success rate, latency, cost and consistency, folded into 0 to 100 |

The method is borrowed from clinical trials: repeat the run, bound the pass rate, then isolate the step that carries the failure.

## Six built-in adapters, and about 50 lines to add a seventh

The adapters cover LangGraph, CrewAI, AutoGen, the OpenAI Agents SDK and custom stacks, so the agent under test is not rewritten to be measured. Trials run in parallel at a configurable width, and the real cost of each one lands in a per-test breakdown. A built-in scanner checks the agent's MCP tools for common vulnerabilities before they reach production.

## Two test formats, and nothing leaves the machine

Tests are defined in YAML or in Python, and results, traces and cost tables stay on local disk: no SaaS, no telemetry, no cloud dependency. The runner reports into GitHub Actions for CI, and the VS Code extension shows results inline in the editor, under an MIT licence.
