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
    <li
      className={`group relative border-t border-rail py-3.5 transition-colors duration-150 ${ROW_GRID} ${
        hasContent ? "hover:bg-ink/[0.03]" : ""
      }`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
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
        <p className="font-mono text-meta text-ref">
          {education.institution} · {education.period}
        </p>
      </div>

      <ValueCell
        value={education.value}
        unit={education.unit}
        artifact={education.artifact}
        className={VALUE_SLOT}
      />

      <p className="max-w-measure text-body text-ref">{education.summary}</p>
    </li>
  )
}
