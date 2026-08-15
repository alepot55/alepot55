import Link from "next/link"
import { ValueCell } from "./value-cell"
import { ROW_GRID, VALUE_SLOT } from "@/lib/constants"
import type { Experience } from "@/lib/constants"

interface ExperienceItemProps {
  experience: Experience
  hasContent?: boolean
}

export function ExperienceItem({ experience, hasContent = false }: ExperienceItemProps) {
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
              href={`/experience/${experience.id}`}
              className="after:absolute after:inset-0 hover:underline hover:decoration-limit hover:underline-offset-4"
            >
              {experience.title}
            </Link>
          ) : (
            experience.title
          )}
        </h3>
        <p className="font-mono text-meta text-ref">
          {experience.company} · {experience.period}
        </p>
      </div>

      <ValueCell
        value={experience.value}
        unit={experience.unit}
        artifact={experience.artifact}
        className={VALUE_SLOT}
      />

      <p className="max-w-measure text-body text-ref">{experience.summary}</p>
    </li>
  )
}
