## Motivation

When organizations modernize legacy codebases, for example migrating from COBOL to Python, they need more than tests. They need **proof** that the new code behaves identically to the old one.

The conventional approach is to write a comprehensive test suite and run both versions against it. But tests can only cover known scenarios. What they miss is **penny drift**: subtle rounding differences that are invisible on individual transactions but accumulate to significant financial discrepancies at scale. A difference of $0.01 per transaction across millions of transactions is a problem no test suite would catch, because no individual test fails.

## The Approach

Verify-CBL combines formal methods with LLM capabilities in a neuro-symbolic architecture:

**Z3 SMT Solver** translates both the legacy and modern code into Satisfiability Modulo Theories formulas. Z3 then checks if there exists *any* input, across the entire input space, where the two programs produce different outputs. If no such input exists, the equivalence is **mathematically proven**, not merely tested.

**LLM-Powered Translation** handles the messy reality of legacy code. COBOL has idiosyncratic constructs, implicit decimal handling, and platform-specific behavior. An LLM performs the initial structural translation, and the formal verifier validates the result. This gives us the flexibility of AI with the rigor of theorem proving.

**Monte Carlo Fallback** provides statistical guarantees when symbolic verification hits complexity limits (deeply nested loops, recursive structures). The engine samples inputs uniformly and computes confidence bounds on equivalence.

## Results

Across 42 benchmark cases, including several with known penny drift that traditional test suites had missed, Verify-CBL achieved **100% verification accuracy** with the hybrid Z3/Monte Carlo approach.

The most satisfying cases were the ones where the test suite said "all green" but Verify-CBL found rounding discrepancies. These are exactly the bugs that escape to production and cause reconciliation nightmares months later.

## What I Learned

The hardest part wasn't the theorem proving: Z3 is remarkably capable. The hard part was the translation layer. COBOL's implicit decimal arithmetic, `COMP-3` packed decimal, and `REDEFINES` clauses create edge cases that neither an LLM alone nor a rule-based translator alone can handle reliably. The hybrid approach (LLM for structural understanding, formal methods for correctness) turned out to be far more robust than either component individually.
