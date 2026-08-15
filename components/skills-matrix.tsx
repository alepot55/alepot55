import { ValueCell } from "./value-cell"
import { ROW_GRID, VALUE_SLOT } from "@/lib/constants"
import { skillUsage, categoryUsage } from "@/lib/skill-usage"

interface SkillsMatrixProps {
  skills: Record<string, string[]>
}

export function SkillsMatrix({ skills }: SkillsMatrixProps) {
  return (
    <ul role="list">
      {Object.entries(skills).map(([category, items]) => {
        const used = categoryUsage(items)
        // the ones the projects on this page actually evidence come first
        const ordered = [...items].sort((a, b) => skillUsage(b) - skillUsage(a))

        return (
          <li key={category} className={`border-t border-rail py-3.5 ${ROW_GRID}`}>
            <h3 className="font-mono text-lead font-semibold tracking-snug text-ink">
              {category}
            </h3>

            <ValueCell
              value={used > 0 ? String(used) : undefined}
              unit={used === 1 ? "project here" : "projects here"}
              className={VALUE_SLOT}
            />

            <p className="max-w-measure font-mono text-meta text-ref">
              {ordered.join(" · ")}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
