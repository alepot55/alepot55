import type { Education } from "@/lib/constants"

export const education: Education[] = [
  {
    id: "msc-computer-engineering",
    degree: "MSc in Computer Engineering",
    institution: "Politecnico di Milano",
    period: "2024 - 2026",
    summary: "AI Systems track. Thesis on deep learning for satellite imagery",
    description:
      "AI Systems track, on a merit-based scholarship. Thesis on deep learning for satellite imagery inside the EU Horizon Europe project Perivallon.",
  },
  {
    id: "bsc-computer-engineering",
    degree: "BSc in Computer Engineering",
    institution: "Sapienza University of Rome",
    period: "2021 - 2024",
    summary: "Honors Program. Thesis on real-time SLAM with Gaussian Splatting",
    description:
      "Honors Program, top 1 percent of the cohort. Experimental thesis on real-time SLAM with 3D Gaussian Splatting.",
    value: "110 / 110",
    unit: "cum laude",
  },
]
