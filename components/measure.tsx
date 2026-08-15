"use client"

import { motion } from "framer-motion"
import { type Measurement, makeScale, describe } from "@/lib/measure"

interface MeasureProps {
  measurement: Measurement
  /** hero draws on mount, rows draw when scrolled into view */
  trigger?: "mount" | "view"
  /** the hero shows the axis alone: the source belongs on the detail page */
  showProvenance?: boolean
}

/**
 * One measurement, drawn against its own references.
 *
 * The filled segment is a length encoding, so it is only used on a linear
 * scale. On a log scale the value is marked with a cursor and nothing is
 * filled: a bar whose length is not proportional to its value lies.
 */
export function Measure({
  measurement,
  trigger = "view",
  showProvenance = true,
}: MeasureProps) {
  const { value, unit, baseline, limit, provenance } = measurement
  const scale = makeScale(measurement)

  const valuePos = scale.pos(value)
  const basePos = baseline ? scale.pos(baseline.value) : 0
  const limitPos = limit ? scale.pos(limit.value) : null
  const overLimit = limit ? value > limit.value : false

  const fillFrom = scale.log ? null : Math.min(basePos, valuePos)
  const fillTo = scale.log ? null : Math.max(basePos, valuePos)

  const draw =
    trigger === "mount"
      ? { animate: { scaleX: 1 } }
      : { whileInView: { scaleX: 1 }, viewport: { once: true, margin: "-80px" } }

  return (
    <div className="mt-5">
      <div
        role="img"
        aria-label={describe(measurement)}
        className="relative select-none"
      >
        {/* markers sit above the rail */}
        <div className="relative h-4" aria-hidden="true">
          {baseline && (
            <span
              className="absolute bottom-0 w-px h-2.5 bg-ref"
              style={{ left: `${basePos}%` }}
            />
          )}
          {limitPos !== null && (
            <span
              className="absolute bottom-0 w-0.5 h-3 tick-limit"
              style={{ left: `${limitPos}%` }}
            />
          )}
          {fillFrom !== null && fillTo !== null && (
            <motion.span
              className="absolute bottom-0 h-0.5 bg-ink origin-left"
              style={{ left: `${fillFrom}%`, width: `${fillTo - fillFrom}%` }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.52, ease: [0.22, 0.61, 0.36, 1] }}
              {...draw}
            />
          )}
          <span
            className={`absolute bottom-0 w-0.5 h-4 ${overLimit ? "bg-limit" : "bg-ink"}`}
            style={{ left: `${valuePos}%` }}
          />
        </div>

        <div className="h-px w-full rail-live" aria-hidden="true" />

        {/* tick labels */}
        <div className="relative h-4 mt-1.5 font-mono text-micro text-ref" aria-hidden="true">
          {baseline && (
            <TickLabel pos={basePos} marker={baseline} />
          )}
          {limit && limitPos !== null && (
            <TickLabel pos={limitPos} marker={limit} className="text-limit" />
          )}
          {scale.log && (
            <span className="absolute right-0 top-0 text-ref">log</span>
          )}
        </div>
      </div>

      {/* provenance stays outside role=img so it is read, not summarised */}
      {showProvenance && (
        <p className="mt-2 font-mono text-meta text-ref">
          {measurement.display ?? value}
          {unit ? ` ${unit}` : ""} · {provenance}
        </p>
      )}
    </div>
  )
}

function TickLabel({
  pos,
  marker,
  className = "",
}: {
  pos: number
  marker: { value: number; label: string; shortLabel?: string }
  className?: string
}) {
  const edgeLeft = pos < 12
  const edgeRight = pos > 88
  const style = edgeLeft
    ? { left: 0 }
    : edgeRight
      ? { right: 0 }
      : { left: `${pos}%`, transform: "translateX(-50%)" }

  return (
    <span className={`absolute top-0 whitespace-nowrap ${className}`} style={style}>
      <span className="sm:hidden">{marker.shortLabel ?? marker.value}</span>
      <span className="hidden sm:inline">{marker.label}</span>
    </span>
  )
}
