import Link from "next/link"
import { ValueCell } from "./value-cell"
import { ROW_GRID, VALUE_SLOT } from "@/lib/constants"
import type { Education } from "@/lib/constants"

interface EducationItemProps {
  education: Education
  hasContent?: boolean
}

export function EducationItem({ education, hasContent = false }: EducationItemProps) {
  return (
    <li className={`group relative border-t border-rail py-5 ${ROW_GRID}`}>
      <p className="font-mono text-meta text-ref">
        {education.institution} · {education.period}
      </p>

      <h3 className="font-mono text-lead font-semibold tracking-snug text-ink">
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
        className={VALUE_SLOT}
      />

      <p className="max-w-measure text-body text-ink">{education.description}</p>
    </li>
  )
}
