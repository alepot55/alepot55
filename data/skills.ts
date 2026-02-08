export interface SkillCategory {
  items: string[]
  level: number // 0-100 proficiency
}

export const skills: Record<string, SkillCategory> = {
  Programming: { items: ["Python", "C++", "Java", "SQL", "JavaScript", "TypeScript", "C"], level: 95 },
  "AI/ML": { items: ["PyTorch", "TensorFlow", "Scikit-learn", "LLMs (Gemini API)", "NLP", "Computer Vision", "SLAM"], level: 90 },
  Systems: { items: ["Docker", "Kubernetes", "Linux", "Git", "GCP", "AWS", "CUDA", "Triton"], level: 85 },
  Databases: { items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "VectorDB", "Spark"], level: 75 },
  Web: { items: ["React", "TypeScript", "Node.js", "REST APIs"], level: 70 },
  Tools: { items: ["VS Code", "Jupyter", "Vim"], level: 80 },
};