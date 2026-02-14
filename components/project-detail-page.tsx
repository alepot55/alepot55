"use client"

import Link from "next/link"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { MarkdownRenderer } from "./markdown-renderer"
import { ProjectChart } from "./project-chart"
import { FadeIn } from "./motion-wrapper"
import type { Project } from "@/data/projects"
import { CATEGORY_LABELS_FULL } from "@/lib/constants"
import { ChessboardDemo } from "./custom-sections/chessboard-demo"
import { SplatSLAMShowcase } from "./custom-sections/splat-slam-showcase"
import { VerificationPipeline } from "./custom-sections/verification-pipeline"
import { FlashReasoningCharts } from "./custom-sections/flash-reasoning-charts"
import { FlashSAECharts } from "./custom-sections/flash-sae-charts"
import { TerminalShowcase } from "./custom-sections/terminal-showcase"
import { ConfusionMatrixViz } from "./custom-sections/confusion-matrix-viz"
import { ConceptHubDemo } from "./custom-sections/concepthub-demo"
import { GPUCharts } from "./custom-sections/gpu-charts"
import { AtlasMMCharts } from "./custom-sections/atlas-mm-charts"
import type { ComponentType } from "react"

const CUSTOM_SECTIONS: Record<string, ComponentType<{ project: Project }>> = {
  "chessboard-js": ChessboardDemo,
  "slam-gaussian-splatting": SplatSLAMShowcase,
  "verify-cbl": VerificationPipeline,
  "agentrial": TerminalShowcase,
  "music-genre-classification": ConfusionMatrixViz,
  "concepthub-ai": ConceptHubDemo,
}

const CUSTOM_CHARTS: Record<string, ComponentType<{ project: Project }>> = {
  "flash-reasoning": FlashReasoningCharts,
  "flash-sae": FlashSAECharts,
  "gpu-performance-analysis": GPUCharts,
  "atlas-mm": AtlasMMCharts,
}

interface ProjectDetailPageProps {
  project: Project
  content: string
}

export function ProjectDetailPage({ project, content }: ProjectDetailPageProps) {
  const CustomSection = CUSTOM_SECTIONS[project.id]
  const CustomCharts = CUSTOM_CHARTS[project.id]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Portfolio</span>
          </Link>
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Live</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Github size={15} />
                <span className="hidden sm:inline">Source</span>
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="pt-10 sm:pt-16 pb-8 sm:pb-12">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {CATEGORY_LABELS_FULL[project.category] || project.category}
              </span>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{project.period}</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 sm:mb-5">
              {project.title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mb-6">
              {project.description}
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 rounded-full font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Custom Section */}
        {CustomSection && (
          <section className="pb-8 sm:pb-12">
            <CustomSection project={project} />
          </section>
        )}

        {/* Charts Section */}
        {(CustomCharts || (project.chartData && project.chartLabel)) && (
          <section className="pb-8 sm:pb-12">
            {CustomCharts ? (
              <CustomCharts project={project} />
            ) : (
              project.chartData && project.chartLabel && (
                <ProjectChart data={project.chartData} label={project.chartLabel} />
              )
            )}
          </section>
        )}

        {/* Deep Dive Content */}
        {content && (
          <section className="pb-16 sm:pb-24">
            <FadeIn delay={0.3}>
              <article className="max-w-3xl">
                <MarkdownRenderer content={content} />
              </article>
            </FadeIn>
          </section>
        )}

        {/* Navigation Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft size={14} />
              All Projects
            </Link>
            <div className="flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <Github size={14} />
                  View Source
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <ExternalLink size={14} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
