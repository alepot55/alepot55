# Alessandro Potenza

I build production software and own it after it ships, from the client's problem down to the
compiler when that is where it sits.

Visiting Forward Deployed AI Engineer at BCG X. MSc Computer Engineering, Politecnico di Milano.
Milan, Italy.

[alepot55.github.io/alepot55](https://alepot55.github.io/alepot55) ·
[LinkedIn](https://linkedin.com/in/alepot55) ·
ap.alessandro.potenza@gmail.com

## Upstream

- **[llvm/llvm-project](https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3Aalepot55)**:
  3 patches merged in MLIR. A `mem2reg` crash on a zero-extent alloca, the `scf` unroller reading
  loop bounds it had not established were constant, and the `vector.multi_reduction` verifier
  accepting dimensions that then wrote past the end of a buffer.
- **[triton-lang/triton](https://github.com/triton-lang/triton/pulls?q=is%3Apr+author%3Aalepot55)**:
  2 patches merged, one in the Membar analysis that removes 30 redundant barriers from an H100
  build. It buys no measurable speedup and the pull request says so.
- **[Reported and fixed by maintainers](https://github.com/triton-lang/triton/issues?q=is%3Aissue+author%3Aalepot55)**:
  3 further Triton bugs, each filed with a reproducer. The credit there is for the report.

## Published

- **IEEE HPEC 2026**, *The Two Faces of Abstraction Regret: Control-Flow and Memory-Layout Limits
  of GPU DSLs on Irregular Automata*. Sole author, accepted for an oral talk.
- **[Informatica per i concorsi pubblici 2026](https://shop.enneditore.it/products/informatica-per-i-concorsi-pubblici-2026-manuale-di-teoria-e-quiz-commentati)**,
  a 432-page Computer Science manual for Italian public-sector exams. Neldiritto Editore.

## Projects

- **[triton-perlane-retire](https://github.com/alepot55/triton-perlane-retire)**: a TritonGPU to
  LLVM pass giving each lane its own loop exit, which the tile IR cannot express. 2.3 to 6.7x on
  control-bound kernels and about 1.0x on gather-bound ones, exactly where the diagnosis predicts
  no gain. Ships out of tree, as the maintainers asked
  ([RFC](https://github.com/triton-lang/triton/issues/10773)).
- **[flash-reasoning](https://github.com/alepot55/flash-reasoning)**: attention kernels that reuse
  the KV prefix reasoning branches share. 2.54x, at 1,194 GB/s effective against the card's
  900 GB/s HBM peak, because the shared blocks stay in L2.
- **[flash-sae](https://github.com/alepot55/flash-sae)**: Triton kernels for sparse autoencoders.
  Fusing the gather removes the dense latent matrix PyTorch materialises for features that are
  99 percent inactive. 13.6x on the decoder forward, 1.78x end to end.
- **[atlas-mm](https://github.com/alepot55/atlas-mm)**: a limit order book simulator with a
  formally verified market maker. 134,000 orders per second, and 4 book invariants proved in Z3
  for every input.
- **[verify-cbl](https://github.com/alepot55/verify-cbl)**: an LLM translates legacy financial
  code, then Z3 proves the translation behaves identically for every input. It agreed with the
  ground truth on 42 of 42 cases.
- **[agentrial](https://github.com/alepot55/agentrial)**: run an agent a hundred times and get
  Wilson confidence intervals instead of anecdotes.
  [On PyPI](https://pypi.org/project/agentrial/), 450 tests.

Also [SplatSLAM](https://github.com/alepot55/SplatSLAM),
[MGC-GTZAN](https://github.com/alepot55/MGC-GTZAN),
[Chessboard.js](https://github.com/alepot55/Chessboard.js).

---

Last updated August 2026.
