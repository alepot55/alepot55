import { projects } from "@/data/projects"

/**
 * How many projects on this page list a given skill.
 *
 * Matching is exact on a normalised string plus one small alias table, kept
 * deliberately short: the count is only worth printing if a reader can verify
 * it by scanning the technology chips below.
 */
const ALIASES: Record<string, string[]> = {
  "openai triton": ["triton"],
  "llm apis": ["llm integration", "gemini api", "llms gemini api"],
  "z3 smt solver": ["z3"],
  "computer vision": ["3d reconstruction"],
}

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9+#]/g, "")
}

function keysFor(skill: string): Set<string> {
  const base = skill.toLowerCase()
  const forms = [base, ...(ALIASES[base] ?? [])]
  return new Set(forms.map(normalise))
}

export function skillUsage(skill: string): number {
  const keys = keysFor(skill)
  return projects.filter((p) => p.technologies.some((t) => keys.has(normalise(t)))).length
}

/** projects listing at least one skill from the category */
export function categoryUsage(items: string[]): number {
  const keys = new Set<string>()
  for (const item of items) {
    for (const k of keysFor(item)) keys.add(k)
  }
  return projects.filter((p) => p.technologies.some((t) => keys.has(normalise(t)))).length
}
