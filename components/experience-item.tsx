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
    <li className={`group relative border-t border-rail py-5 ${ROW_GRID}`}>
      <p className="font-mono text-meta text-ref">
        {experience.company} · {experience.period}
      </p>

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

      <ValueCell
        value={experience.value}
        unit={experience.unit}
        artifact={experience.artifact}
        className={VALUE_SLOT}
      />

      <p className="max-w-measure text-body text-ink">{experience.description}</p>
    </li>
  )
}
