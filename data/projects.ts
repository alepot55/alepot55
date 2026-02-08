export interface ProjectMetric {
  label: string
  value: string
  description?: string
}

export interface ProjectFeature {
  title: string
  description: string
}

export interface ChartDataPoint {
  name: string
  value: number
  baseline?: number
  unit?: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  period: string
  github?: string
  featured?: boolean
  category: "ai-ml" | "systems" | "web" | "research"
  metrics?: ProjectMetric[]
  features?: ProjectFeature[]
  chartData?: ChartDataPoint[]
  chartLabel?: string
  liveUrl?: string
}

export const projects: Project[] = [
  {
    id: "agentrial",
    title: "agentrial",
    description:
      "The pytest for AI agents. Run your agent 100 times, get confidence intervals instead of anecdotes. Published open-source framework with Wilson confidence intervals, step-level failure attribution via Fisher exact test, and real cost tracking across 45+ models.",
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
  },
  {
    id: "flash-reasoning",
    title: "Flash-Reasoning",
    description:
      "Tree-Aware KV-Cache Attention for Reasoning LLMs. Custom Fused GQA Triton kernels exploit physical prefix sharing to exceed HBM bandwidth limits, enabling efficient inference for System 2 Reasoning models like DeepSeek-R1.",
    technologies: [
      "OpenAI Triton",
      "CUDA",
      "PyTorch",
      "Python",
      "LLM Inference",
    ],
    period: "2026",
    github: "https://github.com/alepot55/flash-reasoning",
    featured: true,
    category: "systems",
    chartData: [
      { name: "Standard Attn", value: 470, unit: "GB/s" },
      { name: "Flash-Reasoning", value: 1194, unit: "GB/s" },
      { name: "HBM Limit", value: 900, unit: "GB/s" },
    ],
    chartLabel: "Effective Bandwidth (GB/s)",
  },
  {
    id: "flash-sae",
    title: "Flash-SAE",
    description:
      "High-Performance Triton Kernels for Sparse Autoencoders. 13.6x speedup and 97% memory reduction via sparse kernel fusion. Drop-in PyTorch replacement with full autograd support for Mechanistic Interpretability research.",
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
    chartData: [
      { name: "Encoder", value: 1.06, baseline: 1.0 },
      { name: "Decoder", value: 13.6, baseline: 1.0 },
      { name: "Full Forward", value: 1.78, baseline: 1.0 },
    ],
    chartLabel: "Speedup vs PyTorch (×)",
  },
  {
    id: "verify-cbl",
    title: "Verify-CBL",
    description:
      "Neuro-Symbolic Formal Verification Engine combining Z3 SMT solver with LLM-powered code translation. Mathematically proves behavioral equivalence between legacy and modernized code, detecting 'penny drift' that testing misses.",
    technologies: [
      "Python",
      "Z3 SMT Solver",
      "LLM Integration",
      "Formal Methods",
      "Neuro-Symbolic AI",
    ],
    period: "2026",
    github: "https://github.com/alepot55/verify-cbl",
    category: "ai-ml",
    featured: true,
  },
  {
    id: "gpu-performance-analysis",
    title: "GPU Performance Analysis: Triton vs. CUDA",
    description:
      "Research paper quantifying the performance gap between high-level GPU programming models (Triton) and hand-optimized CUDA kernels, with a focus on irregular workloads like finite state machines.",
    technologies: ["Python", "C++", "CUDA", "Triton", "PyTorch"],
    period: "2025",
    category: "research",
  },
  {
    id: "slam-gaussian-splatting",
    title: "SplatSLAM",
    description:
      "Real-time 3D mapping and SLAM from monocular RGB video using 3D Gaussian Splatting. Photo-realistic dense reconstruction without depth sensors, built as a Nerfstudio extension.",
    technologies: [
      "Python",
      "PyTorch",
      "Computer Vision",
      "3D Reconstruction",
      "CUDA",
      "Nerfstudio",
    ],
    period: "2024",
    github: "https://github.com/alepot55/SplatSLAM",
    category: "research",
  },
  {
    id: "concepthub-ai",
    title: "ConceptHub",
    description:
      "AI-Powered full-stack learning platform integrating Google's Gemini API. Automates generation of book summaries and conceptual mind maps from text, with user authentication and persistent storage.",
    technologies: [
      "React",
      "TypeScript",
      "PostgreSQL",
      "Python",
      "GCP",
      "Docker",
      "Gemini API",
    ],
    period: "2024",
    liveUrl: "https://concepthub-chi.vercel.app/",
    category: "web",
  },
  {
    id: "music-genre-classification",
    title: "Music Genre Classification",
    description:
      "End-to-end reproducible pipeline achieving SOTA 83.5% accuracy on GTZAN with a U-Net inspired model. Leak-free methodology with track-level splits, cross-validation, and transfer learning.",
    technologies: ["Python", "PyTorch", "Scikit-learn", "Jupyter", "Mel-Spectrograms"],
    period: "2024",
    github: "https://github.com/alepot55/MGC-GTZAN",
    category: "ai-ml",
  },
  {
    id: "chessboard-js",
    title: "Chessboard.js",
    description:
      "Modern, dependency-free JavaScript library and NPM package for building interactive chess experiences. Rich API for programmatic control, drag-and-drop, animations, and legal move enforcement.",
    technologies: ["JavaScript", "TypeScript", "NPM", "Node.js"],
    period: "2023",
    github: "https://github.com/alepot55/Chessboard.js",
    liveUrl: "https://sites.google.com/view/chessboard-js/home",
    category: "web",
  },
];
