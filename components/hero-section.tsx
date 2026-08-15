"use client"

import Link from "next/link"
import { Measure } from "./measure"
import { ValueCell } from "./value-cell"
import { ROW_GRID, VALUE_SLOT } from "@/lib/constants"
import type { Project } from "@/data/projects"

interface HeroSectionProps {
  /** the one project whose measurement opens the page */
  flagship?: Project
}

export function HeroSection({ flagship }: HeroSectionProps) {
  const m = flagship?.measurement

  return (
    <section className="pb-section-sm pt-24 sm:pb-section-md sm:pt-28 lg:pb-section">
      <div className={ROW_GRID}>
        <h1 className="font-mono text-[clamp(1.75rem,5.2vw,3.25rem)] font-semibold leading-[1.02] tracking-crush text-ink">
          Alessandro Potenza
        </h1>

        <div className={`${VALUE_SLOT} mt-4 sm:mt-0`}>
          <p className="font-mono text-micro uppercase tracking-micro text-ref sm:text-right">
            Peak measured result
          </p>
          <ValueCell
            value={m ? (m.display ?? m.value.toLocaleString("en-US")) : undefined}
            unit={m?.unit}
            size="xl"
            className="mt-2"
          />
        </div>

        <p className="mt-4 max-w-lead text-lead text-ink sm:mt-5">
          GPU kernels, compiler work, and formally verified systems. MSc Computer
          Engineering at Politecnico di Milano.
        </p>

        {m && flagship && (
          <div className="mt-7">
            <Measure measurement={m} trigger="mount" showProvenance={false} />
            <p className="mt-2 font-mono text-meta text-ref">
              <Link
                href={`/projects/${flagship.id}`}
                className="text-ink underline decoration-rail underline-offset-4 transition-colors hover:decoration-limit"
              >
                {flagship.title}
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
