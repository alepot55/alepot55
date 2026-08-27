import type { Education } from "@/lib/constants"

export const education: Education[] = [
  {
    id: "msc-computer-engineering",
    degree: "MSc in Computer Engineering",
    institution: "Politecnico di Milano",
    period: "2024 - 2026",
    summary: "AI Systems track, 3rd of 193 in the AIRLab challenge",
    description:
      "AI Systems track, on a merit-based scholarship awarded in December 2025. My thesis sits inside PERIVALLON, a Horizon Europe project, and measures how weakly supervised localisation degrades with satellite ground resolution.",
    highlights: [
      { value: "3 / 193", label: "AIRLab challenge", note: "Vision Transformer ensemble, medical imaging" },
      { value: "Dec 2025", label: "merit scholarship", note: "on grade average and credits earned" },
      { value: "70", label: "thesis experiments logged", note: "prediction registered before each measurement" },
    ],
  },
  {
    id: "bsc-computer-engineering",
    degree: "BSc in Computer Engineering",
    institution: "Sapienza University of Rome",
    period: "2021 - 2024",
    summary: "110 / 110 cum laude, in the Honors Program",
    description:
      "Honors Program, which adds graduate-level coursework alongside the degree. My thesis built real-time SLAM with 3D Gaussian Splatting: dense reconstruction from monocular RGB video, no depth sensor.",
    highlights: [
      { value: "110 / 110", label: "cum laude", note: "Sapienza University of Rome, 2024" },
      { value: "Honors", label: "Program admission", note: "graduate-level coursework alongside the degree" },
    ],
  },
]
