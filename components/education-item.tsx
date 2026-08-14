import Link from "next/link"
import { ValueCell } from "./value-cell"
import { ROW_GRID_NARROW } from "@/lib/constants"
import type { Education } from "@/lib/constants"

interface EducationItemProps {
  education: Education
  hasContent?: boolean
}

export function EducationItem({ education, hasContent = false }: EducationItemProps) {
  return (
    <li className={`group relative ${ROW_GRID_NARROW} py-4`}>
      <p className="font-mono text-meta text-ref">
        {education.institution} · {education.period}
      </p>

      <h3 className="font-mono text-index font-semibold text-ink">
        {hasContent ? (
          <Link
            href={`/education/${education.id}`}
            className="after:absolute after:inset-0 hover:underline hover:decoration-limit hover:underline-offset-4"
          >
            {education.degree}
          </Link>
        ) : (
          education.degree
        )}
      </h3>

      <ValueCell
        value={education.value}
        unit={education.unit}
        artifact={education.artifact}
        className="sm:col-start-2 sm:row-start-1 sm:row-span-4"
      />

      <p className="max-w-measure text-body text-ink">{education.description}</p>
    </li>
  )
}
