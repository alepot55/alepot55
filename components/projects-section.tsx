"use client"

import { useState } from "react"
import { ProjectCard } from "./project-card"
import { CATEGORY_LABELS } from "@/lib/constants"
import type { Project } from "@/data/projects"

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "ai-ml", label: CATEGORY_LABELS["ai-ml"] },
  { key: "systems", label: CATEGORY_LABELS["systems"] },
  { key: "web", label: CATEGORY_LABELS["web"] },
  { key: "research", label: CATEGORY_LABELS["research"] },
]

interface ProjectsSectionProps {
  projects: Project[]
  contentMap: Record<string, boolean>
}

export function ProjectsSection({ projects, contentMap }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState("all")

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section className="pb-16 sm:pb-24" aria-label="All projects">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-3">
        <span className="h-px w-6 bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
        All Projects
      </h2>

      <div
        className="flex flex-wrap gap-2 mb-8"
        role="group"
        aria-label="Filter projects by category"
      >
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.key}
            aria-pressed={activeFilter === option.key}
            onClick={() => setActiveFilter(option.key)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              activeFilter === option.key
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            hasContent={contentMap[project.id] || false}
            index={index}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 col-span-full py-8 text-center">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  )
}
