import { skillUsage } from "@/lib/skill-usage"

interface SkillsListProps {
  skills: Record<string, string[]>
}

export function SkillsList({ skills }: SkillsListProps) {
  return (
    <ul role="list">
      {Object.entries(skills).map(([category, items]) => {
        // the ones the projects on this page evidence come first
        const ordered = [...items].sort((a, b) => skillUsage(b) - skillUsage(a))

        return (
          <li
            key={category}
            className="grid grid-cols-1 gap-y-1 border-t border-rail py-4 sm:grid-cols-[9rem_1fr] sm:gap-x-8 sm:gap-y-0"
          >
            <h3 className="font-mono text-meta text-ref">{category}</h3>
            <p className="font-mono text-body text-ink">{ordered.join(" · ")}</p>
          </li>
        )
      })}
    </ul>
  )
}
