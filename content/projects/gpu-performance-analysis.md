## Motivation

OpenAI's Triton promises to democratize GPU programming: write Python instead of CUDA C++, and the compiler handles the low-level optimization. For standard workloads like matrix multiplication, this largely works. But what happens when you throw something *irregular* at it?

Finite State Machines (FSMs) are the perfect stress test. Unlike matrix operations, FSMs have unpredictable memory access patterns, data-dependent control flow, and minimal arithmetic intensity. They represent a class of workloads where GPU programming is genuinely hard, exactly where the abstraction gap between Triton and CUDA matters most.

## The Research

I implemented the same computational workloads in both Triton (Python) and CUDA (C++) across three domains:

1. **Finite State Automata**: complex state machines with irregular memory access patterns
2. **Matrix Operations**: standard GPU fare (MatMul, VecAdd) as baseline
3. **MLP Networks**: structured neural network computations

Everything ran in a Dockerized environment (CUDA 12.6.2, PyTorch 2.5.1, Triton 2.3.1) with 70 automated tests ensuring correctness across all implementations. Benchmarks were run with multiple iterations and confidence intervals.

## Key Findings

**For structured workloads**, Triton is competitive. Matrix operations run within 10-20% of CUDA performance, and vector addition achieves near-parity (<5% gap). The compiler's automatic optimization handles these patterns well.

**For irregular workloads**, the gap is dramatic. Hand-optimized CUDA achieves **$220\times$ speedup** over Triton on the ngAP (next-generation Aho-Corasick) pattern matching engine. CUDA also uses 20-30% less GPU memory across all workloads.

**The development trade-off is real**: Triton implementations require 40-60% fewer lines of code and dramatically reduce onboarding time for Python developers. The question isn't "which is better", it's "what do you need?"

## Practical Implications

The results suggest a hybrid strategy:

- **Prototype in Triton**: faster iteration, easier debugging, good enough for research
- **Optimize in CUDA**: when production performance matters, especially for irregular workloads
- **Regular workloads (matmul, attention)**: Triton is often sufficient; the compiler has matured significantly

This is consistent with what I observed in my other projects (Flash-Reasoning, Flash-SAE): Triton excels where the compiler's assumptions hold, and CUDA remains necessary when you need to exploit hardware behavior that the compiler can't reason about.
