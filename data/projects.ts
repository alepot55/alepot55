import type { Measurement } from "@/lib/measure"

export interface Project {
  id: string
  title: string
  /** one line, for the register. What it is, not why it matters. */
  summary: string
  /** the full paragraph, for the detail page */
  description: string
  technologies: string[]
  period: string
  github?: string
  featured?: boolean
  category: "ai-ml" | "systems" | "data" | "web" | "research"
  /** the headline number, with its references and its source */
  measurement?: Measurement
  /** what exists instead, when nothing was benchmarked */
  artifact?: string
  liveUrl?: string
}

export const projects: Project[] = [
  {
    id: "gpufsm",
    title: "gpufsm",
    summary:
      "Why Triton trails CUDA on automata, and a compiler pass that closes it",
    description:
      "Anatomy and cure of the abstraction regret between Triton and hand-written CUDA on irregular automata. The 10x gap is decomposed into a launch-configuration artifact, a lane-packing component and an irreducible residual, the residual is traced to intra-warp latency hiding the tile IR cannot express, and the cure is built below that IR as a TritonGPU to LLVM per-lane retirement pass.",
    technologies: [
      "OpenAI Triton",
      "CUDA",
      "C++",
      "MLIR",
      "LLVM",
      "Python",
      "Nsight Compute",
    ],
    period: "2025 - 2026",
    github: "https://github.com/alepot55/gpufsm",
    featured: true,
    category: "research",
    measurement: {
      value: 6.7,
      display: "2.3-6.7",
      unit: "× over stock Triton",
      label: "speedup on control-bound lock-step kernels",
      baseline: { value: 1, label: "stock Triton 1x", shortLabel: "1x" },
      provenance:
        "RTX 4070, rebuilt from a pinned recipe. 1.6-3.8x reproduced on A100, and no gain on gather-bound SpMV and MoE, near 1.0x",
    },
  },
  {
    id: "flash-reasoning",
    title: "Flash-Reasoning",
    summary:
      "Tree-aware KV-cache attention that reads faster than HBM allows",
    description:
      "Tree-aware KV-cache attention for reasoning LLMs. Fused GQA Triton kernels exploit physical prefix sharing between branches, so shared blocks stay resident in L2 and the kernel reads faster than HBM allows.",
    technologies: ["OpenAI Triton", "CUDA", "PyTorch", "Python", "LLM Inference"],
    period: "2026",
    github: "https://github.com/alepot55/flash-reasoning",
    featured: true,
    category: "systems",
    measurement: {
      value: 1194,
      unit: "GB/s effective",
      label: "effective bandwidth",
      baseline: { value: 470, label: "standard attention 470", shortLabel: "470" },
      limit: { value: 900, label: "HBM peak 900", shortLabel: "900" },
      provenance: "fused GQA over a tree-structured KV cache, prefix blocks resident in L2",
    },
  },
  {
    id: "flash-sae",
    title: "Flash-SAE",
    summary:
      "Triton kernels that drop the dense latent matrix PyTorch materialises",
    description:
      "Triton kernels for sparse autoencoders. Fusing the sparse gather removes the dense latent matrix that PyTorch materialises even though over 99 percent of features are inactive. Drop-in replacement with full autograd support.",
    technologies: [
      "OpenAI Triton",
      "CUDA",
      "PyTorch",
      "Python",
      "Mechanistic Interpretability",
    ],
    period: "2026",
    github: "https://github.com/alepot55/flash-sae",
    featured: true,
    category: "systems",
    measurement: {
      value: 13.6,
      unit: "× decoder forward",
      label: "decoder speedup",
      baseline: { value: 1, label: "PyTorch parity 1x", shortLabel: "1x" },
      provenance:
        "RTX 4070, bfloat16, batch 1024, d_model 4096, n_features 65,536, k 64",
    },
  },
  {
    id: "pvsite",
    title: "pvsite",
    summary:
      "Two million cadastral parcels in, a few thousand ranked sites out",
    description:
      "Geospatial engine that finds land where a ground-mounted photovoltaic plant can legally be built. It takes an entire Italian province from the cadastre, one to two million parcels, and returns a few thousand ranked with the reason for each. A constraint that could not be verified never yields an admissible parcel: it returns undetermined.",
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
    featured: true,
    category: "data",
    measurement: {
      value: 80,
      display: "~80",
      unit: "% ruled out",
      label: "statutory eligibility filter",
      provenance:
        "stage one, an OR over the statutory categories, before any scoring. 7 weighted criteria follow, each carrying the share of weight backed by data that was actually available",
    },
  },
  {
    id: "atlas-mm",
    title: "atlas-mm",
    summary:
      "Order book, market maker, and Z3 proofs of the invariants",
    description:
      "GPU-accelerated limit order book simulator with formally verified market making. From-scratch L2 matching engine, the Avellaneda-Stoikov analytical model against a PPO agent, and Z3 proofs that the book invariants hold for every input.",
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
    github: "https://github.com/alepot55/atlas-mm",
    featured: true,
    category: "ai-ml",
    measurement: {
      value: 134,
      display: "~134",
      unit: "K orders/s",
      label: "order book throughput",
      provenance:
        "pure Python, single thread. Z3 proved 4 invariants, under 6 ms each",
    },
  },
  {
    id: "verify-cbl",
    title: "Verify-CBL",
    summary:
      "An LLM translates the legacy code, Z3 proves the translation",
    description:
      "Neuro-symbolic verification engine. An LLM translates legacy code, then Z3 proves the translation behaves identically for every input, catching the penny drift that accumulates below the resolution of any test suite.",
    technologies: [
      "Python",
      "Z3 SMT Solver",
      "LLM Integration",
      "Formal Verification",
      "Neuro-Symbolic AI",
    ],
    period: "2026",
    github: "https://github.com/alepot55/verify-cbl",
    featured: true,
    category: "ai-ml",
    measurement: {
      value: 100,
      unit: "% of cases verified",
      label: "verification accuracy",
      provenance: "42 benchmark cases, hybrid Z3 and Monte Carlo",
    },
  },
  {
    id: "agentrial",
    title: "agentrial",
    summary:
      "Run an agent a hundred times, get confidence intervals",
    description:
      "The pytest for AI agents. Run an agent a hundred times and get Wilson confidence intervals instead of anecdotes, with step-level failure attribution via Fisher exact test and real cost tracking.",
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
    github: "https://github.com/alepot55/agentrial",
    featured: true,
    category: "ai-ml",
    measurement: {
      value: 450,
      unit: "tests passing",
      label: "test suite",
      provenance: "published on PyPI, MIT licence, cost tracking across 45+ models",
    },
  },
  {
    id: "slam-gaussian-splatting",
    title: "SplatSLAM",
    summary:
      "Dense photo-realistic SLAM from plain RGB video",
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
    github: "https://github.com/alepot55/SplatSLAM",
    category: "research",
    artifact: "Nerfstudio ext",
  },
  {
    id: "music-genre-classification",
    title: "Music Genre Classification",
    summary:
      "GTZAN without the leakage that inflates the published numbers",
    description:
      "End-to-end reproducible pipeline on GTZAN with a U-Net inspired model. Splitting at track level before slicing removes the leakage that lets published pipelines report over 90 percent.",
    technologies: [
      "Python",
      "PyTorch",
      "Scikit-learn",
      "Computer Vision",
      "Jupyter",
      "Mel-Spectrograms",
    ],
    period: "2024",
    github: "https://github.com/alepot55/MGC-GTZAN",
    category: "ai-ml",
    measurement: {
      value: 83,
      display: "82-83",
      unit: "% test accuracy",
      label: "leak-free test accuracy",
      provenance: "GTZAN, track-level 60/20/20 split, 5-fold CV mean near 90 percent",
    },
  },
  {
    id: "concepthub-ai",
    title: "ConceptHub",
    summary:
      "Book summaries and concept maps generated from plain text",
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
    liveUrl: "https://concepthub-chi.vercel.app/",
    category: "web",
    artifact: "live demo",
  },
  {
    id: "chessboard-js",
    title: "Chessboard.js",
    summary:
      "Dependency-free chess board for the web",
    description:
      "Dependency-free JavaScript library for interactive chess boards. Programmatic API, drag and drop, animations, and legal move enforcement, published on npm.",
    technologies: ["JavaScript", "TypeScript", "npm", "Node.js"],
    period: "2023",
    github: "https://github.com/alepot55/Chessboard.js",
    liveUrl: "https://sites.google.com/view/chessboard-js/home",
    category: "web",
    artifact: "npm package",
  },
]
