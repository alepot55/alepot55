import type { Highlight, ItemLink } from "@/lib/constants"

export interface Project {
  id: string
  title: string
  /** one line, for the list. What it is, not why it matters. */
  summary: string
  /** the full paragraph, for the detail page */
  description: string
  /** the two or three facts the detail page leads with */
  highlights?: Highlight[]
  technologies: string[]
  period: string
  category: "ai-ml" | "systems" | "data" | "web" | "research"
  /** what a reader can open: source, package, demo, paper */
  links?: ItemLink[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: "gpufsm",
    title: "gpufsm",
        summary:
      "A Triton pass that recovers 2.3-6.7x on automata kernels",
        description:
      "I traced the 10.2x gap between Triton and hand-written CUDA on finite automata to one thing the tile IR cannot express, then built the compiler pass that recovers 2.3 to 6.7x of it. The measurement paper is accepted at IEEE HPEC 2026.",
    highlights: [
      {
        value: "2.3-6.7x",
        label: "on control-bound kernels",
        note: "RTX 4070, oracle-gated in both modes",
      },
      {
        value: "15.3x",
        label: "more cycles stalled than CUDA",
        note: "at matched occupancy, issuing fewer instructions",
      },
      {
        value: "1.00x",
        label: "on the pointer-chase control",
        note: "maximal memory irregularity, no scalar control, no gain: the prediction held",
      },
    ],
    technologies: ["OpenAI Triton", "CUDA", "C++", "MLIR", "LLVM", "Python", "Nsight Compute"],
    period: "2025 - 2026",
    category: "research",
    featured: true,
    links: [
      { label: "Source", href: "https://github.com/alepot55/gpufsm" },
      { label: "triton#10773, declined", href: "https://github.com/triton-lang/triton/issues/10773" },
      { label: "Compiler pass", href: "https://github.com/alepot55/triton-perlane-retire" },
    ],
  },
  {
    id: "flash-reasoning",
    title: "Flash-Reasoning",
        summary:
      "2.54x on reasoning attention by sharing the KV prefix",
        description:
      "Triton attention kernels for reasoning LLMs that reuse the KV prefix branches share. 2.54x over standard attention and 1,194 GB/s effective, above the card's 900 GB/s HBM peak, because the shared blocks stay in L2.",
    technologies: ["OpenAI Triton", "CUDA", "PyTorch", "Python", "LLM Inference"],
    period: "2026",
    category: "systems",
    featured: true,
    links: [{ label: "Source", href: "https://github.com/alepot55/flash-reasoning" }],
  },
  {
    id: "flash-sae",
    title: "Flash-SAE",
        summary:
      "13.6x on the SAE decoder forward, 1.78x end to end",
        description:
      "Triton kernels for sparse autoencoders. PyTorch materialises the dense latent matrix even though 99 percent of features are inactive; fusing the gather removes it. 13.6x faster decoder forward and 97 percent less memory, drop-in with autograd.",
    technologies: ["OpenAI Triton", "CUDA", "PyTorch", "Python", "Mechanistic Interpretability"],
    period: "2026",
    category: "systems",
    featured: true,
    links: [{ label: "Source", href: "https://github.com/alepot55/flash-sae" }],
  },
  {
    id: "perivallon-thesis",
    title: "Reading landfills off a satellite",
        summary:
      "Doubling landfill localisation at 120 cm without retraining",
        description:
      "My master's thesis at Politecnico di Milano, inside PERIVALLON. Reading the same frozen classifier at a larger input doubles where it can point on satellite imagery: recall at 10 percent of area goes from 0.282 to 0.560 at 120 cm.",
    highlights: [
      { value: "2x", label: "recall at 120 cm", note: "same frozen weights, larger input" },
      { value: "70", label: "logged experiments", note: "prediction registered before measurement" },
      { value: "0.41", label: "held-out error of the readout law", note: "in doublings, no generalisation gap" },
    ],
    technologies: [
      "Python",
      "PyTorch",
      "Swin Transformer",
      "Remote Sensing",
      "Weakly Supervised Learning",
      "Experimental Design",
    ],
    period: "2026",
    category: "research",
    featured: true,
  },
  {
    id: "energy-forecast",
    title: "Energy Forecast IT",
        summary:
      "rMAE 0.34 to 0.39 across all 7 Italian power zones",
        description:
      "Day-ahead electricity price forecasting for a client, one model per Italian bidding zone. On real ENTSO-E history from 2022 to April 2026 the models land at rMAE 0.34 to 0.39, a third of the weekly naive's error.",
    technologies: [
      "Python",
      "LightGBM",
      "TimescaleDB",
      "FastAPI",
      "Celery",
      "Streamlit",
      "Docker",
      "Time-Series Forecasting",
    ],
    period: "2026",
    category: "ai-ml",
    featured: true,
  },
  {
    id: "pvsite",
    title: "pvsite",
        summary:
      "677,534 parcels read, 611 big enough to build on",
        description:
      "I read the whole cadastre of an Italian province for a client, 677,534 parcels on Viterbo, and returned the ones where a photovoltaic plant is legally buildable. 611 are on their own large enough for his smallest plant. None has been built on yet.",
    highlights: [
      {
        value: "677,534",
        label: "parcels read on Viterbo",
        note: "the whole cadastre of one province, one run",
      },
      {
        value: "628,168",
        label: "out before any scoring runs",
        note: "statutory eligibility alone, 92.7 percent of the input",
      },
      {
        value: "611",
        label: "large enough on their own",
        note: "2.25 usable hectares, the client's smallest plant at 1.5 MWp",
      },
    ],
    technologies: [
      "Python",
      "GeoPandas",
      "Shapely",
      "DuckDB",
      "FastAPI",
      "TypeScript",
      "MapLibre GL",
      "Docker",
    ],
    period: "2026",
    category: "data",
    featured: true,
  },
  {
    id: "atlas-mm",
    title: "atlas-mm",
        summary:
      "134K orders per second, 4 book invariants proved in Z3",
        description:
      "A limit order book simulator with a formally verified market maker. From-scratch L2 matching at 134,000 orders per second, the Avellaneda-Stoikov model against a PPO agent, and four book invariants proved in Z3 for every input.",
    technologies: [
      "Python",
      "Z3 SMT Solver",
      "Formal Verification",
      "Gymnasium",
      "Stable-Baselines3",
      "GARCH",
      "Quantitative Finance",
    ],
    period: "2026",
    category: "ai-ml",
    featured: true,
    links: [{ label: "Source", href: "https://github.com/alepot55/atlas-mm" }],
  },
  {
    id: "verify-cbl",
    title: "Verify-CBL",
        summary:
      "Z3 proved 42 of 42 LLM translations of legacy code",
        description:
      "An LLM translates legacy financial code, then Z3 proves the translation behaves identically for every input. It agreed with the ground truth on all 42 benchmark cases, including ones with penny drift no test suite would catch.",
    technologies: [
      "Python",
      "Z3 SMT Solver",
      "LLM Integration",
      "Formal Verification",
      "Neuro-Symbolic AI",
    ],
    period: "2026",
    category: "ai-ml",
    featured: true,
    links: [{ label: "Source", href: "https://github.com/alepot55/verify-cbl" }],
  },
  {
    id: "agentrial",
    title: "agentrial",
        summary:
      "Wilson intervals for agents, on PyPI, 450 tests",
        description:
      "The pytest for AI agents. Run an agent a hundred times and get Wilson confidence intervals instead of anecdotes, with step-level failure attribution by Fisher exact test. Published on PyPI, 450 tests, 45 models tracked.",
    technologies: [
      "Python",
      "Statistics",
      "LLM APIs",
      "FastAPI",
      "VS Code Extension",
      "CI/CD",
      "PyPI",
    ],
    period: "2026",
    category: "ai-ml",
    links: [
      { label: "Source", href: "https://github.com/alepot55/agentrial" },
      { label: "PyPI", href: "https://pypi.org/project/agentrial/" },
    ],
  },
  {
    id: "slam-gaussian-splatting",
    title: "SplatSLAM",
        summary:
      "Dense SLAM from RGB video using 3D Gaussian Splatting",
        description:
      "Real-time 3D mapping from monocular RGB video using 3D Gaussian Splatting, built as a Nerfstudio extension. My bachelor's thesis at Sapienza. Dense photo-realistic reconstruction without a depth sensor.",
    technologies: [
      "Python",
      "PyTorch",
      "Computer Vision",
      "SLAM",
      "3D Reconstruction",
      "CUDA",
      "Nerfstudio",
    ],
    period: "2024",
    category: "research",
    links: [{ label: "Source", href: "https://github.com/alepot55/SplatSLAM" }],
  },
  {
    id: "concepthub-ai",
    title: "ConceptHub",
        summary:
      "Book summaries and concept maps, 3 record types, 2024",
        description:
      "A platform that turns plain text into book summaries and concept maps, built end to end.",
    technologies: [
      "React",
      "TypeScript",
      "PostgreSQL",
      "Python",
      "FastAPI",
      "GCP",
      "Docker",
      "LLM APIs",
    ],
    period: "2024",
    category: "web",
    links: [{ label: "Live demo", href: "https://concepthub-chi.vercel.app/" }],
  },
  {
    id: "music-genre-classification",
    title: "Music Genre Classification",
        summary:
      "82 to 83 percent on GTZAN, with a leak-free split",
        description:
      "Music genre classification on GTZAN with the track-level split the published numbers usually skip. The leakage-free score is lower than the literature's and it is the one reported here.",
    technologies: [
      "Python",
      "PyTorch",
      "Scikit-learn",
      "Computer Vision",
      "Jupyter",
      "Mel-Spectrograms",
    ],
    period: "2024",
    category: "ai-ml",
    links: [{ label: "Source", href: "https://github.com/alepot55/MGC-GTZAN" }],
  },
  {
    id: "chessboard-js",
    title: "Chessboard.js",
        summary:
      "A dependency-free chess board, published on npm",
        description:
      "A chess board component for the web with no dependencies: FEN positions, move handling, programmatic control. Published on npm.",
    technologies: ["JavaScript", "TypeScript", "npm", "Node.js"],
    period: "2023",
    category: "web",
    links: [
      { label: "Source", href: "https://github.com/alepot55/Chessboard.js" },
      { label: "npm", href: "https://www.npmjs.com/package/@alepot55/chessboardjs" },
      { label: "Docs", href: "https://sites.google.com/view/chessboard-js/home" },
    ],
  },
  {
    id: "upstream-compilers",
    title: "Upstream compiler patches",
        summary:
      "5 patches merged in OpenAI Triton and LLVM's MLIR",
        description:
      "Bugs I hit while building on Triton and MLIR, sent upstream instead of worked around. Five patches merged, three more bugs fixed by maintainers from my reproducers, ten changes still open.",
    highlights: [
      { value: "5", label: "patches merged", note: "2 in Triton, 3 in LLVM's MLIR" },
      { value: "3", label: "bugs fixed by maintainers", note: "reported with a reproducer" },
      { value: "10", label: "still open", note: "under review upstream" },
    ],
    technologies: ["C++", "MLIR", "LLVM", "OpenAI Triton", "CUDA", "Compilers"],
    period: "2026",
    category: "systems",
    featured: true,
    links: [
      { label: "Triton PRs", href: "https://github.com/triton-lang/triton/pulls?q=is%3Apr+author%3Aalepot55" },
      { label: "LLVM PRs", href: "https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3Aalepot55" },
    ],
  },
]
