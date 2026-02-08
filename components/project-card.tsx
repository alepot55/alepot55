"use client"

import Link from "next/link"
import { ArrowUpRight, Github, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import type { Project } from "@/data/projects"
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/constants"

interface ProjectCardProps {
  project: Project
  hasContent?: boolean
  index?: number
}

export function ProjectCard({ project, hasContent = false, index = 0 }: ProjectCardProps) {
  const baseClass = "group relative flex flex-col h-full p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-200"
  const interactiveClass = hasContent
    ? `${baseClass} hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md hover:-translate-y-0.5`
    : baseClass

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div className={interactiveClass}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[project.category]}`}>
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{project.period}</span>
          </div>
          {hasContent && (
            <ArrowUpRight size={16} className="text-gray-300 dark:text-gray-700 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
          )}
        </div>

        {/* Title — stretched link covers the entire card when hasContent */}
        <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors ${hasContent ? "group-hover:text-gray-600 dark:group-hover:text-gray-300" : ""}`}>
          {hasContent ? (
            <Link
              href={`/projects/${project.id}`}
              className="after:absolute after:inset-0 after:z-0"
              aria-label={`View details for ${project.title}`}
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
            {project.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label}>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{metric.value}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1.5">{metric.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-3 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[11px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[11px] text-gray-400 dark:text-gray-500 self-center">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
          {/* External links sit above the stretched link */}
          {(project.github || project.liveUrl) && (
            <div className="relative z-10 flex gap-1.5 shrink-0">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label={`GitHub repository for ${project.title}`}
                >
                  <Github size={14} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label={`Live demo for ${project.title}`}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
