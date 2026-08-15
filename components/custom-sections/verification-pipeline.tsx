"use client"

import {
  FileCode,
  GitBranch,
  Network,
  Brain,
  Code2,
  Shield,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowDown,
} from "lucide-react"
import type { Project } from "@/data/projects"

/**
 * Every stage of the pipeline is part of the proven path, so it is drawn in
 * --ink. Connections are --ref. --accent is reserved for the failure branch:
 * a property the solver could not prove.
 */
const PIPELINE_STEPS = [
  { label: "COBOL Source", icon: FileCode },
  { label: "Parser", icon: GitBranch },
  { label: "IR Expression Tree", icon: Network },
  { label: "LLM Translation", icon: Brain },
  { label: "Java BigDecimal", icon: Code2 },
  { label: "Z3 Solver", icon: Shield },
] as const

export function VerificationPipeline({ project }: { project: Project }) {
  return (
    <div className="space-y-8">
      {/* Pipeline diagram: a diagram frame is a sanctioned surface */}
      <div className="rounded border border-rail bg-surface p-5 sm:p-6">
        <p className="font-mono text-meta text-ref">Verification pipeline</p>

        {/* Desktop layout: horizontal */}
        <div className="mt-5 hidden lg:block">
          <div className="flex items-stretch gap-1">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="contents">
                  <div className="flex h-20 flex-1 flex-col items-center justify-center gap-2 px-2">
                    <Icon className="h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
                    <span className="text-center font-mono text-meta leading-tight text-ink">
                      {step.label}
                    </span>
                  </div>

                  {i < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight
                      className="h-4 w-4 shrink-0 self-center text-ref"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex justify-center gap-10 font-mono text-meta">
            <span className="flex items-center gap-2 text-ink">
              <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Verified
            </span>
            <span className="flex items-center gap-2 text-accent">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Drift detected
              <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </span>
          </div>
        </div>

        {/* Mobile layout: vertical */}
        <div className="mt-5 lg:hidden">
          <div className="flex flex-col items-center">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="flex w-full max-w-[240px] flex-col items-center">
                  <div className="flex w-full items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
                    <span className="font-mono text-meta text-ink">{step.label}</span>
                  </div>

                  {i < PIPELINE_STEPS.length - 1 && (
                    <ArrowDown className="my-1 h-4 w-4 self-start text-ref" aria-hidden="true" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex flex-col items-center gap-2 font-mono text-meta">
            <span className="flex w-full max-w-[240px] items-center gap-2 text-ink">
              <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Verified
            </span>
            <span className="flex w-full max-w-[240px] items-center gap-2 text-accent">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Drift detected
              <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>

      {/* Demo */}
      <div>
        <p className="font-mono text-meta text-ref">Demo</p>
        <div className="mt-3 aspect-video overflow-hidden rounded border border-rail bg-surface">
          <iframe
            src="https://www.youtube.com/embed/2Tv3cGaI6PM"
            title={`${project.title} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}
