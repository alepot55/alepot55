## In short

- Visiting AI Engineer at BCG X, the build-and-design arm of Boston Consulting Group, in Milan since April 2026.
- I advise enterprise clients in luxury retail and industry on where generative AI actually creates value, then design and deploy the system that delivers it, rather than a proof of concept that never ships.
- Four strands so far: **Dark Factory**, an internal agent factory; **Content Studio**, productized out of one engagement into a platform; **content generation for fashion and luxury**; and **fraud prediction**, five models built and compared on one problem.
- The engineering is multi-agent automation on Google Cloud and Vertex AI, plus LLM-based generation.

## Dark Factory

An agent factory: the machinery that takes an agent from described to deployed, so that building the tenth agent costs a fraction of what the first one did.

The insight it is built on is that most of the work in an agentic system is not the agent. It is everything around it: the tool surface, the guardrails, the evaluation harness, the deployment path, the observability that tells you which step failed and why. Those parts are almost identical between agents, and rebuilding them per engagement is where the time goes.

So they get factored out once and the agent-specific part shrinks to what genuinely differs: the task, the tools it may touch, the checks that say it did the job. What comes out the other side is a deployed agent with its evaluation attached, not a notebook someone still has to productionize.

## Content Studio

It started as one client engagement and I turned it into a reusable platform.

Productizing a one-off build is a different discipline from delivering a single project. It forces clean abstractions, sane defaults, and an interface a new team can adopt without me in the room. It is now used across multiple customers, Burberry and Prada among them.

## Content generation for fashion and luxury

LLM-based generation for a sector with unusually strict constraints: brand voice is not a preference there, it is an asset with legal and commercial weight, and the tolerance for output that is merely close is low. The work is as much about the evaluation and the guardrails as about the generation.

## Fraud prediction

Five models built and compared on the same problem, rather than one model tuned until it looked good. Comparing several approaches on one problem is what makes the choice defensible: it shows what the winner is winning against, and it exposes the cases where the ranking flips.

## Bridging strategy and engineering

A large part of the value is translation. Executive stakeholders think in business outcomes, engineering teams think in systems and constraints, and keeping the two aligned is what turns an AI ambition into something that ships.

I also run an internal Tech Hour that upskills senior engineers on agentic AI: how agents are built, where they break, and how to evaluate them honestly.
