## A 0.01 dollar gap per transaction leaves every assertion green

A suite covers the scenarios someone thought to write, and it checks a transaction at a time, so a rounding difference that small trips nothing. Across millions of transactions the same gap becomes the reconciliation discrepancy that surfaces months later. I built the pipeline in 2026 for COBOL modernisation.

## Z3 has to find one input where the two programs disagree

The pipeline encodes the legacy program and the translated one as Satisfiability Modulo Theories formulas, then asks the solver for such an input anywhere in the space. An unsatisfiable answer is the equivalence proof.

## The second engine samples where the symbolic proof stops scaling

Symbolic verification hits complexity limits on deeply nested loops and recursive structures. There a Monte Carlo sampler draws inputs uniformly and returns confidence bounds on equivalence, a statistical guarantee rather than a proof.

## 3 COBOL constructs are where the translation still breaks

The solver side holds. The failures cluster in the translation layer, where neither an LLM alone nor a rule-based translator alone handles COBOL reliably:

- implicit decimal arithmetic
- `COMP-3` packed decimal
- `REDEFINES` clauses
