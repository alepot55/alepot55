export interface MeasureMarker {
  /** the reference value, in the same unit as the measurement */
  value: number
  /** what the reference is, spelled out */
  label: string
  /** short form used below 640px, where the full label would collide */
  shortLabel?: string
}

export interface Measurement {
  value: number
  /**
   * How the value is printed when the source is approximate or a range.
   * A number reported as "~134K" or "82-83" stays approximate here.
   */
  display?: string
  /** written as it should read: "GB/s", not "GB/S" */
  unit: string
  /** what was measured, in a couple of words */
  label: string
  /** what the value is measured against */
  baseline?: MeasureMarker
  /** a physical or theoretical ceiling */
  limit?: MeasureMarker
  /** hardware, dataset, method. Copied from the write-up, never inferred. */
  provenance: string
}

/**
 * An axis without a reference measures nothing, so it is only drawn when a
 * baseline or a limit exists. Everything else shows the bare value.
 */
export function hasAxis(m: Measurement): boolean {
  return Boolean(m.baseline || m.limit)
}

export interface Scale {
  log: boolean
  /** 0..100, clamped */
  pos: (v: number) => number
}

/**
 * Log when the spread across the plotted points is an order of magnitude or
 * more. A speedup of 13.6 against a baseline of 1 is unreadable linearly.
 */
export function makeScale(m: Measurement): Scale {
  const points = [m.value, m.baseline?.value, m.limit?.value].filter(
    (v): v is number => typeof v === "number" && v > 0
  )
  const hi = Math.max(...points)
  const lo = Math.min(...points)
  const log = points.length > 1 && hi / lo >= 8

  if (!log) {
    const max = hi * 1.08
    return {
      log: false,
      pos: (v) => clamp((v / max) * 100),
    }
  }

  const min = lo / 1.25
  const top = hi * 1.25
  const span = Math.log(top) - Math.log(min)
  return {
    log: true,
    pos: (v) => {
      if (v <= 0) return 0
      return clamp(((Math.log(v) - Math.log(min)) / span) * 100)
    },
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n))
}

/** "1194 gigabytes per second, against a baseline of 470, ..." */
export function describe(m: Measurement): string {
  const parts = [`${m.value} ${m.unit} ${m.label}`]
  if (m.baseline) parts.push(`against ${m.baseline.label} at ${m.baseline.value}`)
  if (m.limit) {
    parts.push(`with ${m.limit.label} at ${m.limit.value}`)
    if (m.value > m.limit.value) parts.push("the measured value exceeds that limit")
  }
  return parts.join(", ") + "."
}
