import type { Achievement } from "@/lib/constants"

export const achievements: Achievement[] = [
  {
    id: "airlab-competition",
    title: "AI Challenge, third place",
    organization: "Politecnico di Milano, AIRLab",
    date: "2025",
    description:
      "Custom Vision Transformer ensemble for medical image classification, in the Artificial Neural Networks Challenge.",
    value: "3 / 193",
    unit: "teams",
  },
  {
    id: "merit-scholarship",
    title: "Merit-Based Scholarship",
    organization: "Politecnico di Milano",
    date: "Dec 2025",
    description:
      "Awarded on grade point average and credits earned during the MSc in Computer Science and Engineering.",
  },
  {
    id: "huawei-global-finalist",
    title: "Tech4Good Global Finalist",
    organization: "Huawei Technologies",
    date: "2024",
    description:
      "Selected for the Seeds For The Future program. Led a team designing a computer vision prototype, won the national competition and advanced to the global finals in China.",
  },
]
