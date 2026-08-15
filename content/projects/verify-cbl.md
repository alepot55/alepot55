## In short

- **Problem:** modernising a legacy codebase, COBOL to Python for instance, needs proof that the new code behaves identically, and a test suite only covers the scenarios someone thought to write.
- **Failure mode:** penny drift, a rounding gap of 0.01 dollars per transaction that fails no individual test and accumulates into a real financial discrepancy across millions of transactions.
- **Mechanism:** an LLM performs the structural translation, Z3 proves the two programs agree on every input in the space, and a Monte Carlo sampler takes over where the symbolic proof does not scale.
- **Measured:** 100 percent verification accuracy across 42 benchmark cases, several of them with known penny drift that traditional test suites had missed.
- **State:** the solver side is solid. What still limits the system is the translation layer, not the theorem proving.

## Why a test suite is not enough

Tests can only cover known scenarios, and they are checked one transaction at a time. A gap of 0.01 dollars per transaction breaks no assertion, so the suite stays green and says nothing about it. Across millions of transactions that same gap becomes the reconciliation problem someone finds months later.

## The three components

**Z3 SMT solver.** It translates both the legacy and the modern program into Satisfiability Modulo Theories formulas. It then asks whether there exists any input, across the entire input space, where the two produce different outputs. If no such input exists, the equivalence is mathematically proven, not merely tested.

**LLM-powered translation.** COBOL has idiosyncratic constructs, implicit decimal handling, and platform-specific behaviour. The LLM performs the initial structural translation and the formal verifier validates the result, which gives the flexibility of AI with the rigor of theorem proving.

**Monte Carlo fallback.** Symbolic verification hits complexity limits on deeply nested loops and recursive structures. There the engine samples inputs uniformly and computes confidence bounds on equivalence, so the answer degrades to a statistical guarantee instead of no answer at all.

## Results

- 42 benchmark cases, including several with known penny drift that traditional test suites had missed.
- 100 percent verification accuracy with the hybrid Z3 and Monte Carlo approach.
- The most satisfying cases were the ones where the test suite reported all green and Verify-CBL found the rounding discrepancy anyway.

Those are exactly the bugs that escape to production and cause reconciliation nightmares months later.

## What I learned

The theorem proving was not the hard part: Z3 is remarkably capable. The hard part was the translation layer, where COBOL produces edge cases that neither an LLM alone nor a rule-based translator alone handles reliably:

- implicit decimal arithmetic
- `COMP-3` packed decimal
- `REDEFINES` clauses

The hybrid split, LLM for structural understanding and formal methods for correctness, turned out to be far more robust than either component individually.
