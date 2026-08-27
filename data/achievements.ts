import type { Achievement } from "@/lib/constants"

export const achievements: Achievement[] = [
  {
    id: "hpec-2026",
    title: "Paper accepted, IEEE HPEC 2026",
    organization: "IEEE High Performance Extreme Computing Conference",
    date: "Aug 2026",
    summary: "Sole author. Accepted for an oral talk and for IEEE Xplore",
    description:
      "The Two Faces of Abstraction Regret: Control-Flow and Memory-Layout Limits of GPU DSLs on Irregular Automata. Sole-authored, accepted for an oral presentation in the General Purpose GPU Computing session and for publication in IEEE Xplore.",
    result: "Accepted for oral presentation, September 2026",
  },
  {
    id: "airlab-competition",
    title: "AI Challenge, third place",
    organization: "Politecnico di Milano, AIRLab",
    date: "2025",
    summary: "Vision Transformer ensemble for medical image classification",
    description:
      "Custom Vision Transformer ensemble for medical image classification, in the Artificial Neural Networks Challenge.",
    result: "Third of 193 teams",
  },
  {
    id: "merit-scholarship",
    title: "Merit-Based Scholarship",
    organization: "Politecnico di Milano",
    date: "Dec 2025",
    summary: "Awarded on grade average and credits earned during the MSc",
    description:
      "Awarded on grade point average and credits earned during the MSc in Computer Science and Engineering.",
  },
  {
    id: "huawei-global-finalist",
    title: "Tech4Good Global Finalist",
    organization: "Huawei Technologies",
    date: "2024",
    summary: "National winner, then the global finals in China",
    description:
      "Selected for the Seeds For The Future program. Led a team designing a computer vision prototype, won the national competition and advanced to the global finals in China.",
  },
]
