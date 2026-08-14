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
        return (
          <li key={category} className={`border-t border-rail py-5 ${ROW_GRID}`}>
            <h3 className="font-mono text-lead font-semibold tracking-snug text-ink">
              {category}
            </h3>

            <ValueCell
              value={used > 0 ? String(used) : undefined}
              unit={used === 1 ? "project here" : "projects here"}
              className={VALUE_SLOT}
            />

            <div className="flex flex-wrap gap-x-1.5 gap-y-1.5">
              {items.map((item) => {
                const count = skillUsage(item)
                return (
                  <span
                    key={item}
                    className={`rounded-sm bg-ink/[0.05] px-1.5 py-0.5 font-mono text-meta ${
                      count >= 2 ? "text-ink" : "text-ref"
                    }`}
                  >
                    {item}
                    {count >= 2 && (
                      <span
                        className="relative -top-1 ml-0.5 text-micro tracking-normal text-ref tnum"
                        aria-label={`used in ${count} projects on this page`}
                      >
                        {count}
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
