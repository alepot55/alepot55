/**
 * Skills are listed, never rated. A self-assigned percentage is not a
 * measurement, and this page does not print numbers it cannot back.
 * What is shown next to each entry is a count of the projects on this page
 * that list it, computed at build time by lib/skill-usage.ts.
 */
export const skills: Record<string, string[]> = {
  Programming: ["Python", "C++", "C", "Java", "SQL", "JavaScript", "TypeScript"],
  "AI/ML": [
    "PyTorch",
    "TensorFlow",
    "Scikit-learn",
    "LLM APIs",
    "NLP",
    "Computer Vision",
    "SLAM",
  ],
  Systems: ["CUDA", "OpenAI Triton", "Linux", "Docker", "Kubernetes", "Git", "GCP", "AWS"],
  "Formal methods": ["Z3 SMT Solver", "Formal Verification", "Neuro-Symbolic AI"],
  Data: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "VectorDB", "Spark"],
  Web: ["React", "Node.js", "REST APIs", "FastAPI"],
}
