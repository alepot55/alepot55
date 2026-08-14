import Link from "next/link"
import { ValueCell } from "./value-cell"
import { CATEGORY_LABELS, ROW_GRID, VALUE_SLOT } from "@/lib/constants"
import type { Project } from "@/data/projects"

interface ProjectRowProps {
  project: Project
  hasContent?: boolean
}

/**
 * An index entry, not a summary of the project. One line of identity, one line
 * of what it is, one value. The paragraph, the technologies and the measurement
 * axis all live on the detail page, where there is room to read them.
 */
export function ProjectRow({ project, hasContent = false }: ProjectRowProps) {
  const { measurement, artifact } = project

  return (
    <li
      className={`group relative border-t border-rail py-3.5 transition-colors duration-150 ${ROW_GRID} hover:bg-ink/[0.03]`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-mono text-lead font-semibold tracking-snug text-ink">
          {hasContent ? (
            <Link
              href={`/projects/${project.id}`}
              className="after:absolute after:inset-0 hover:underline hover:decoration-limit hover:underline-offset-4"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className="font-mono text-meta text-ref">
          {CATEGORY_LABELS[project.category]} · {project.period}
        </p>
      </div>

      <ValueCell
        value={measurement ? formatValue(measurement) : undefined}
        unit={measurement?.unit}
        artifact={artifact}
        className={VALUE_SLOT}
      />

      <p className="max-w-measure text-body text-ref">{project.summary}</p>
    </li>
  )
}

/** keeps thousands readable without pretending to more precision */
function formatValue(m: { value: number; display?: string }): string {
  if (m.display) return m.display
  return m.value >= 1000 ? m.value.toLocaleString("en-US") : String(m.value)
}
