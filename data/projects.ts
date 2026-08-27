import type { Highlight, ItemLink } from "@/lib/constants"

export interface Project {
  id: string
  title: string
  /** one line, for the list. What it is, not why it matters. */
  summary: string
  /** the full paragraph, for the detail page */
  description: string
  /** the measured outcome, written out. No chart, no bar. */
  result?: string
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
    summary: "Why Triton trails CUDA on automata, and a compiler pass that closes it",
    description:
      "Anatomy and cure of the abstraction regret between Triton and hand-written CUDA on irregular automata. The 10x gap is decomposed into a launch-configuration artifact, a lane-packing component and an irreducible residual, the residual is traced to intra-warp latency hiding the tile IR cannot express, and the cure is built below that IR as a TritonGPU to LLVM per-lane retirement pass.",
    result: "2.3 to 6.7 times faster on control-bound kernels. Paper accepted at IEEE HPEC 2026",
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
        value: "HPEC 2026",
        label: "accepted, oral",
        note: "IEEE High Performance Extreme Computing",
      },
    ],
    technologies: ["OpenAI Triton", "CUDA", "C++", "MLIR", "LLVM", "Python", "Nsight Compute"],
    period: "2025 - 2026",
    category: "research",
    featured: true,
    links: [
      { label: "Source", href: "https://github.com/alepot55/gpufsm" },
      { label: "Upstream RFC", href: "https://github.com/triton-lang/triton/issues/10773" },
      { label: "Compiler pass", href: "https://github.com/alepot55/triton-perlane-retire" },
    ],
  },
  {
    id: "flash-reasoning",
    title: "Flash-Reasoning",
    summary: "Tree-aware KV-cache attention that reads faster than HBM allows",
    description:
      "Tree-aware KV-cache attention for reasoning LLMs. Fused GQA Triton kernels exploit physical prefix sharing between branches, so shared blocks stay resident in L2 and the kernel reads faster than HBM allows.",
    result: "1,194 GB/s effective, above the 900 GB/s HBM peak",
    technologies: ["OpenAI Triton", "CUDA", "PyTorch", "Python", "LLM Inference"],
    period: "2026",
    category: "systems",
    featured: true,
    links: [{ label: "Source", href: "https://github.com/alepot55/flash-reasoning" }],
  },
  {
    id: "flash-sae",
    title: "Flash-SAE",
    summary: "Triton kernels that drop the dense latent matrix PyTorch materialises",
    description:
      "Triton kernels for sparse autoencoders. Fusing the sparse gather removes the dense latent matrix that PyTorch materialises even though over 99 percent of features are inactive. Drop-in replacement with full autograd support.",
    result: "13.6 times faster decoder forward, 97 percent less memory",
    technologies: ["OpenAI Triton", "CUDA", "PyTorch", "Python", "Mechanistic Interpretability"],
    period: "2026",
    category: "systems",
    featured: true,
    links: [{ label: "Source", href: "https://github.com/alepot55/flash-sae" }],
  },
  {
    id: "perivallon-thesis",
    title: "Reading landfills off a satellite",
    summary: "The same frozen model, read at a larger input, localises twice as well",
    description:
      "Master's thesis at Politecnico di Milano inside PERIVALLON (Horizon Europe), on how weakly supervised localisation of illegal landfills degrades as satellite ground resolution drops. Seventy logged experiments, each with its prediction registered before the measurement, produce two results: a readout law that says how large the output cell should be for a given object size and ground resolution, and a retraining-free lever that roughly doubles operational recall at 120 cm.",
    result: "Recall at 10 percent of area from 0.282 to 0.560 at 120 cm, no retraining",
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
    summary: "Day-ahead electricity prices for all seven Italian bidding zones",
    description:
      "End-to-end electricity price forecasting for the Italian day-ahead market (GME/IPEX), covering all seven bidding zones since demand stopped settling at the uniform national price in 2025. A LightGBM model with dedicated feature engineering against a LEAR baseline, wrapped in an async stack of FastAPI, TimescaleDB and Celery, with risk management, walk-forward backtesting, and a dashboard that issues buy and sell signals.",
    result: "rMAE 0.34 to 0.39 in all seven zones, on real ENTSO-E history",
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
    summary: "An entire province of cadastre in, a few thousand ranked sites out",
    description:
      "Geospatial engine that finds land where a ground-mounted photovoltaic plant can legally be built. It takes an entire Italian province from the cadastre, one to two million parcels, and returns a few thousand ranked with the reason for each. A constraint that could not be verified never yields an admissible parcel: it returns undetermined.",
    result: "677,534 parcels in, 45,728 ranked out, on the province of Viterbo",
    highlights: [
      { value: "677,534", label: "parcels examined", note: "the whole cadastre of one province" },
      { value: "45,728", label: "came through", note: "17,838 hectares, each with its reason" },
      { value: "13", label: "constraint layers checked", note: "an unverifiable one yields undetermined, never eligible" },
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
    summary: "Order book, market maker, and Z3 proofs of the invariants",
    description:
      "GPU-accelerated limit order book simulator with formally verified market making. From-scratch L2 matching engine, the Avellaneda-Stoikov analytical model against a PPO agent, and Z3 proofs that the book invariants hold for every input.",
    result: "134K orders per second, 4 invariants proved in Z3",
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
    summary: "An LLM translates the legacy code, Z3 proves the translation",
    description:
      "Neuro-symbolic verification engine. An LLM translates legacy code, then Z3 proves the translation behaves identically for every input, catching the penny drift that accumulates below the resolution of any test suite.",
    result: "100 percent verification accuracy over 42 cases",
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
    summary: "Run an agent a hundred times, get confidence intervals",
    description:
      "The pytest for AI agents. Run an agent a hundred times and get Wilson confidence intervals instead of anecdotes, with step-level failure attribution via Fisher exact test and real cost tracking.",
    result: "Published on PyPI, 450 tests, 45+ models tracked",
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
    summary: "Dense photo-realistic SLAM from plain RGB video",
    description:
      "Real-time 3D mapping and SLAM from monocular RGB video using 3D Gaussian Splatting. Photo-realistic dense reconstruction without depth sensors, built as a Nerfstudio extension.",
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
    summary: "Book summaries and concept maps generated from plain text",
    description:
      "Full-stack learning platform on the Gemini API. Generates book summaries and conceptual mind maps from text, with authentication and persistent storage.",
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
    summary: "GTZAN without the leakage that inflates the published numbers",
    description:
      "End-to-end reproducible pipeline on GTZAN with a U-Net inspired model. Splitting at track level before slicing removes the leakage that lets published pipelines report over 90 percent.",
    result: "82 to 83 percent accuracy, leak-free splits",
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
    summary: "Dependency-free chess board for the web",
    description:
      "Dependency-free JavaScript library for interactive chess boards. Programmatic API, drag and drop, animations, and legal move enforcement, published on npm.",
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
    summary: "Patches landed in OpenAI Triton and in LLVM's MLIR",
    description:
      "Bug reports and patches sent to the compilers I work on top of, rather than worked around locally. Five are merged: one in Triton's Membar analysis, three in MLIR (mem2reg, the scf unroller and the vector dialect verifier), and one documentation fix. Three further Triton bugs were reported with a reproducer and fixed by the maintainers themselves.",
    result: "5 patches merged in Triton and MLIR, 3 more bugs fixed from my reproducers",
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
