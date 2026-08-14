"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ProjectRow } from "./project-row"
import { CATEGORY_LABELS } from "@/lib/constants"
import type { Project } from "@/data/projects"

const FILTERS = [
  { key: "all", label: "all" },
  { key: "ai-ml", label: CATEGORY_LABELS["ai-ml"] },
  { key: "systems", label: CATEGORY_LABELS["systems"] },
  { key: "data", label: CATEGORY_LABELS["data"] },
  { key: "web", label: CATEGORY_LABELS["web"] },
  { key: "research", label: CATEGORY_LABELS["research"] },
]

interface ProjectsRegisterProps {
  projects: Project[]
  contentMap: Record<string, boolean>
  /** the project whose axis the hero already drew */
  heroProjectId?: string
}

export function ProjectsRegister({
  projects,
  contentMap,
  heroProjectId,
}: ProjectsRegisterProps) {
  const [active, setActive] = useState("all")
  const reduced = useReducedMotion()

  const visible = active === "all" ? projects : projects.filter((p) => p.category === active)
  const expanded = visible.filter((p) => p.featured)
  const rest = visible.filter((p) => !p.featured)

  return (
    <>
      <div
        className="mb-8 flex flex-wrap items-baseline gap-x-5 gap-y-2"
        role="group"
        aria-label="Filter projects by category"
      >
        {FILTERS.map((f) => {
          const isActive = active === f.key
          return (
            <button
              key={f.key}
              aria-pressed={isActive}
              onClick={() => setActive(f.key)}
              className={`relative py-1 font-mono text-nav transition-colors ${
                isActive ? "text-ink" : "text-ref hover:text-ink"
              }`}
            >
              {f.label}
              {isActive &&
                (reduced ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-limit" />
                ) : (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-limit"
                    transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                  />
                ))}
            </button>
          )
        })}
        <span className="ml-auto font-mono text-meta text-ref tnum">
          {visible.length} / {projects.length}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="py-8 font-mono text-meta text-ref">No projects in this category.</p>
      ) : (
        <ul role="list">
          {expanded.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              hasContent={contentMap[project.id] || false}
              expanded
              axisDrawn={project.id === heroProjectId}
            />
          ))}
          {rest.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              hasContent={contentMap[project.id] || false}
            />
          ))}
        </ul>
      )}
    </>
  )
}
