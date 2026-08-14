"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { MarkdownRenderer } from "./markdown-renderer"
import { SectionHeader } from "./section-header"
import { Measure } from "./measure"
import { ValueCell } from "./value-cell"
import { hasAxis } from "@/lib/measure"
import type { Project } from "@/data/projects"
import { CATEGORY_LABELS_FULL, ROW_GRID, VALUE_SLOT } from "@/lib/constants"
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
  agentrial: TerminalShowcase,
  "music-genre-classification": ConfusionMatrixViz,
  "concepthub-ai": ConceptHubDemo,
}

/** every part of the page says what it is */
const CUSTOM_SECTION_LABELS: Record<string, string> = {
  "chessboard-js": "Interactive board",
  "slam-gaussian-splatting": "Reconstruction",
  "verify-cbl": "Verification pipeline",
  agentrial: "Command line",
  "music-genre-classification": "Confusion matrix",
  "concepthub-ai": "The platform",
}

const CUSTOM_CHARTS: Record<string, ComponentType<{ project: Project }>> = {
  "flash-reasoning": FlashReasoningCharts,
  "flash-sae": FlashSAECharts,
  gpufsm: GPUCharts,
  "atlas-mm": AtlasMMCharts,
}

const LINK =
  "text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-limit"

interface ProjectDetailPageProps {
  project: Project
  content: string
}

export function ProjectDetailPage({ project, content }: ProjectDetailPageProps) {
  const CustomSection = CUSTOM_SECTIONS[project.id]
  const CustomCharts = CUSTOM_CHARTS[project.id]
  const m = project.measurement

  return (
    <>
      <header className="sticky top-0 z-50 h-header border-b border-rail bg-surface/[0.88] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-content items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-mono text-nav text-ref transition-colors hover:text-ink">
            Portfolio
          </Link>
          <div className="flex items-center gap-5 font-mono text-nav">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className={LINK}>
                source
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
                live
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-content px-5 sm:px-8">
        <section className={`${ROW_GRID} pb-section-sm pt-12 sm:pt-14`}>
          <p className="font-mono text-meta text-ref">
            {CATEGORY_LABELS_FULL[project.category] || project.category} · {project.period}
          </p>

          <h1 className="mt-2 font-mono text-[clamp(1.5rem,3.6vw,2.25rem)] font-semibold leading-[1.1] tracking-snug text-ink">
            {project.title}
          </h1>

          <ValueCell
            value={m ? (m.display ?? String(m.value)) : undefined}
            unit={m?.unit}
            artifact={project.artifact}
            size="m"
            className={`${VALUE_SLOT} mt-3 sm:mt-0`}
          />

          <p className="mt-5 max-w-measure text-lead text-ink">{project.description}</p>

          <div className="mt-5 flex flex-wrap gap-x-1.5 gap-y-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-sm bg-ink/[0.05] px-1.5 py-0.5 font-mono text-meta text-ref"
              >
                {tech}
              </span>
            ))}
          </div>

          {m && hasAxis(m) && <Measure measurement={m} trigger="mount" />}
        </section>

        {CustomSection && (
          <section className="border-t border-rail pb-section-sm pt-8">
            <SectionHeader level="part">
              {CUSTOM_SECTION_LABELS[project.id] ?? "Demo"}
            </SectionHeader>
            <CustomSection project={project} />
          </section>
        )}

        {CustomCharts && (
          <section className="border-t border-rail pb-section-sm pt-8">
            <SectionHeader level="part">Measurements</SectionHeader>
            <CustomCharts project={project} />
          </section>
        )}

        {content && (
          <section className="border-t border-rail pb-section-sm pt-8 sm:pb-section-md">
            <SectionHeader level="part">Write-up</SectionHeader>
            <article className="max-w-prose">
              <MarkdownRenderer content={content} />
            </article>
          </section>
        )}

        <footer className="flex items-center justify-between gap-4 border-t border-rail py-8 font-mono text-meta">
          <Link href="/" className={LINK}>
            All projects
          </Link>
          <div className="flex gap-5">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className={LINK}>
                View source
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
                Live demo
              </a>
            )}
          </div>
        </footer>
      </main>
    </>
  )
}
