"use client"

import { ExternalLink } from "lucide-react"
import type { Project } from "@/data/projects"

export function ConceptHubDemo({ project }: { project: Project }) {
  return (
    <div>
      <p className="font-mono text-meta text-ref">Live deployment</p>

      <a
        href="https://concepthub-chi.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 font-mono text-index text-ink underline decoration-rail underline-offset-4 transition-colors duration-150 hover:decoration-accent"
      >
        Try ConceptHub live
        <ExternalLink size={13} aria-hidden="true" className="text-ref" />
      </a>

      <p className="mt-2 max-w-measure text-body text-ref">
        AI-powered summaries and mind maps, deployed on Vercel.
      </p>
    </div>
  )
}
