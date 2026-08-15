"use client"

import Link from "next/link"
import { MarkdownRenderer } from "./markdown-renderer"
import { SectionHeader } from "./section-header"
import { ItemLinks } from "./row"
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
import { EnergyForecastSystem } from "./custom-sections/energy-forecast-system"
import type { ComponentType } from "react"

const CUSTOM_SECTIONS: Record<string, ComponentType<{ project: Project }>> = {
  "chessboard-js": ChessboardDemo,
  "slam-gaussian-splatting": SplatSLAMShowcase,
  "verify-cbl": VerificationPipeline,
  agentrial: TerminalShowcase,
  "music-genre-classification": ConfusionMatrixViz,
  "concepthub-ai": ConceptHubDemo,
  "energy-forecast": EnergyForecastSystem,
}

/** every part of the page says what it is */
const CUSTOM_SECTION_LABELS: Record<string, string> = {
  "chessboard-js": "Try it",
  "slam-gaussian-splatting": "Reconstruction",
  "verify-cbl": "How it verifies",
  agentrial: "In the terminal",
  "music-genre-classification": "Confusion matrix",
  "concepthub-ai": "The platform",
  "energy-forecast": "The system",
}

const CUSTOM_CHARTS: Record<string, ComponentType<{ project: Project }>> = {
  "flash-reasoning": FlashReasoningCharts,
  "flash-sae": FlashSAECharts,
  gpufsm: GPUCharts,
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
    <>
      <header className="sticky top-0 z-50 h-header border-b border-rail bg-bg/[0.92] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-content items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-mono text-nav text-ref transition-colors hover:text-ink">
            Portfolio
          </Link>
          {project.links && project.links.length > 0 && (
            <ItemLinks links={project.links} size="body" />
          )}
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-content px-5 sm:px-8">
        <section className="pb-section-sm pt-12 sm:pt-14">
          <p className="font-mono text-meta text-ref">
            {CATEGORY_LABELS_FULL[project.category] || project.category} · {project.period}
          </p>

          <h1 className="mt-2 font-mono text-[clamp(1.5rem,3.6vw,2.25rem)] font-semibold leading-[1.1] tracking-snug text-ink">
            {project.title}
          </h1>

          <p className="mt-5 max-w-measure text-lead text-ink">{project.description}</p>

          {project.result && (
            <p className="mt-4 max-w-measure font-mono text-body text-ink tnum">
              {project.result}
            </p>
          )}

          <p className="mt-5 max-w-measure font-mono text-meta text-ref">
            {project.technologies.join(" · ")}
          </p>
        </section>

        {CustomSection && (
          <section className="border-t border-rail pb-section-sm pt-8">
            <SectionHeader>{CUSTOM_SECTION_LABELS[project.id] ?? "Demo"}</SectionHeader>
            <CustomSection project={project} />
          </section>
        )}

        {CustomCharts && (
          <section className="border-t border-rail pb-section-sm pt-8">
            <SectionHeader>Measurements</SectionHeader>
            <CustomCharts project={project} />
          </section>
        )}

        {content && (
          <section className="border-t border-rail pb-section-sm pt-8 sm:pb-section-md">
            <SectionHeader>Write-up</SectionHeader>
            <article className="max-w-prose">
              <MarkdownRenderer content={content} />
            </article>
          </section>
        )}

        <footer className="flex flex-wrap items-baseline justify-between gap-4 border-t border-rail py-8 font-mono text-meta">
          <Link
            href="/"
            className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
          >
            All projects
          </Link>
          {project.links && project.links.length > 0 && <ItemLinks links={project.links} />}
        </footer>
      </main>
    </>
  )
}
