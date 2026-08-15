"use client"

import React, { useState } from "react"
import type { Project } from "@/data/projects"

const GENRES = [
  "Blues",
  "Classical",
  "Country",
  "Disco",
  "HipHop",
  "Jazz",
  "Metal",
  "Pop",
  "Reggae",
  "Rock",
] as const

/* Measured results, unchanged. Every row sums to 100. */
const CONFUSION_MATRIX: number[][] = [
  [82, 2, 4, 1, 0, 5, 0, 2, 3, 1], // Blues
  [1, 95, 0, 0, 0, 2, 1, 1, 0, 0], // Classical
  [3, 0, 78, 2, 1, 1, 0, 5, 4, 6], // Country
  [1, 0, 2, 80, 5, 0, 2, 4, 3, 3], // Disco
  [0, 0, 1, 4, 85, 1, 3, 2, 2, 2], // HipHop
  [4, 3, 1, 0, 0, 88, 0, 1, 2, 1], // Jazz
  [0, 1, 0, 2, 2, 0, 90, 1, 1, 3], // Metal
  [1, 1, 4, 5, 2, 1, 1, 78, 3, 4], // Pop
  [2, 0, 3, 3, 2, 2, 1, 3, 80, 4], // Reggae
  [2, 0, 5, 4, 3, 1, 4, 4, 3, 74], // Rock
]

/* One hue, five densities of --ink, five equal fifths of the 0 to 100 domain.
   The step is a quantisation of the value, so a denser cell is always a
   larger value. From step 0.70 up the fill is too dark for --ink text, so
   the digits flip to --bg. */
const STEPS = [
  { below: 20, fill: "bg-ink/[0.08]", label: "0-19", onDark: false },
  { below: 40, fill: "bg-ink/[0.22]", label: "20-39", onDark: false },
  { below: 60, fill: "bg-ink/[0.44]", label: "40-59", onDark: false },
  { below: 80, fill: "bg-ink/[0.70]", label: "60-79", onDark: true },
  { below: Number.POSITIVE_INFINITY, fill: "bg-ink", label: "80-100", onDark: true },
]

function stepFor(value: number) {
  return STEPS.find((step) => value < step.below) ?? STEPS[STEPS.length - 1]
}

export function ConfusionMatrixViz({ project }: { project: Project }) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)

  void project

  const readout = hovered
    ? `${GENRES[hovered.row]} -> ${GENRES[hovered.col]}   ${
        CONFUSION_MATRIX[hovered.row][hovered.col]
      }%  ${hovered.row === hovered.col ? "correct" : "misclassified"}`
    : "Rows: actual genre, columns: predicted genre"

  return (
    <div className="rounded border border-rail bg-surface p-4 sm:p-5">
      <h3 className="font-mono text-index font-medium text-ink">
        Classification confusion matrix
      </h3>

      <div className="mt-5 overflow-x-auto">
        <div
          className="grid min-w-[440px] gap-px"
          style={{
            gridTemplateColumns: "72px repeat(10, minmax(28px, 1fr))",
            gridTemplateRows: "56px repeat(10, auto)",
          }}
        >
          {/* corner */}
          <div />

          {/* predicted genre, rotated so ten labels fit the width */}
          {GENRES.map((genre, colIdx) => (
            <div
              key={`col-${genre}`}
              className="relative flex h-16 items-end justify-center pb-1"
            >
              <span
                className={`whitespace-nowrap font-mono text-meta transition-colors duration-150 ${
                  hovered?.col === colIdx ? "text-ink" : "text-ref"
                }`}
                style={{
                  display: "inline-block",
                  transform: "rotate(-45deg)",
                  transformOrigin: "center bottom",
                }}
              >
                {genre}
              </span>
            </div>
          ))}

          {CONFUSION_MATRIX.map((row, rowIdx) => (
            <React.Fragment key={`row-${GENRES[rowIdx]}`}>
              <div className="flex items-center justify-end pr-2">
                <span
                  className={`truncate font-mono text-meta transition-colors duration-150 ${
                    hovered?.row === rowIdx ? "text-ink" : "text-ref"
                  }`}
                >
                  {GENRES[rowIdx]}
                </span>
              </div>

              {row.map((value, colIdx) => {
                const step = stepFor(value)
                const isHovered = hovered?.row === rowIdx && hovered?.col === colIdx

                return (
                  <div
                    key={`cell-${rowIdx}-${colIdx}`}
                    className={`relative flex aspect-square items-center justify-center rounded-sm ${step.fill}`}
                    onMouseEnter={() => setHovered({ row: rowIdx, col: colIdx })}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {isHovered && (
                      <span
                        className="absolute inset-0 rounded-sm ring-1 ring-inset ring-accent"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`relative font-mono text-meta leading-none tnum ${
                        step.onDark ? "text-bg" : "text-ink"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* single readout line: no floating overlay, no layout shift */}
      <p className="mt-4 min-h-[1.1rem] whitespace-pre-wrap font-mono text-meta text-ref">
        {readout}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {STEPS.map((step) => (
          <span key={step.label} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-sm ${step.fill}`} aria-hidden="true" />
            <span className="font-mono text-meta text-ref tnum">{step.label}</span>
          </span>
        ))}
        <span className="font-mono text-meta text-ref">percent of row</span>
      </div>
    </div>
  )
}
