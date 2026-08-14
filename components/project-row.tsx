"use client"

import Link from "next/link"
import { Measure } from "./measure"
import { ValueCell } from "./value-cell"
import { hasAxis } from "@/lib/measure"
import { CATEGORY_LABELS, ROW_GRID, VALUE_SLOT } from "@/lib/constants"
import type { Project } from "@/data/projects"

interface ProjectRowProps {
  project: Project
  hasContent?: boolean
  /** expanded rows carry the description and, where one exists, the axis */
  expanded?: boolean
  /** each measurement is drawn once per page: the hero already spent this one */
  axisDrawn?: boolean
}

export function ProjectRow({
  project,
  hasContent = false,
  expanded = false,
  axisDrawn = false,
}: ProjectRowProps) {
  const { measurement, artifact } = project
  const showAxis = expanded && measurement && hasAxis(measurement) && !axisDrawn

  const title = hasContent ? (
    <Link
      href={`/projects/${project.id}`}
      className="after:absolute after:inset-0 hover:underline hover:decoration-limit hover:underline-offset-4"
    >
      {project.title}
    </Link>
  ) : (
    project.title
  )

  return (
    <li
      className={`group relative ${ROW_GRID} ${
        expanded ? "py-6" : "py-4 transition-colors duration-150 hover:bg-ink/[0.04]"
      }`}
    >
      <p className="font-mono text-meta text-ref">
        {CATEGORY_LABELS[project.category]} · {project.period}
      </p>

      <h3
        className={`font-mono font-semibold text-ink ${
          expanded ? "text-row-title" : "text-index"
        }`}
      >
        {title}
      </h3>

      <ValueCell
        value={measurement ? formatValue(measurement) : undefined}
        unit={measurement?.unit}
        artifact={artifact}
        size={expanded ? "m" : "s"}
        className={VALUE_SLOT}
      />

      <p className={`max-w-measure text-body ${expanded ? "text-ink" : "text-ref"}`}>
        {project.description}
      </p>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
        {project.technologies.slice(0, expanded ? 8 : 4).map((tech) => (
          <span
            key={tech}
            className="rounded-sm bg-ink/[0.05] px-1.5 py-0.5 font-mono text-meta text-ref"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > (expanded ? 8 : 4) && (
          <span className="font-mono text-meta text-ref">
            +{project.technologies.length - (expanded ? 8 : 4)}
          </span>
        )}

        {(project.github || project.liveUrl) && (
          <span className="relative z-10 ml-auto flex gap-3 font-mono text-meta">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-limit"
              >
                source
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-limit"
              >
                live
              </a>
            )}
          </span>
        )}
      </div>

      {showAxis && measurement && <Measure measurement={measurement} />}
    </li>
  )
}

/** keeps thousands readable without pretending to more precision */
function formatValue(m: { value: number; display?: string }): string {
  if (m.display) return m.display
  return m.value >= 1000 ? m.value.toLocaleString("en-US") : String(m.value)
}
