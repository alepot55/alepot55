interface ValueCellProps {
  value?: string
  unit?: string
  /** shown when there is no measurement: what exists instead */
  artifact?: string
  size?: "xl" | "m" | "s"
  className?: string
}

const SIZES = {
  xl: "text-value-m sm:text-value-xl",
  m: "text-value-s sm:text-value-m",
  s: "text-value-s",
} as const

/**
 * The right-hand column. It carries values and nothing else: no links, no
 * icons, no prose, no hover state, no animation. Empty is a legitimate state.
 *
 * House rule: the cell never repeats a string already printed on the left of
 * the same row.
 */
export function ValueCell({
  value,
  unit,
  artifact,
  size = "s",
  className = "",
}: ValueCellProps) {
  if (!value && !artifact) return <div aria-hidden="true" className={className} />

  return (
    <div className={`font-mono text-left sm:text-right ${className}`}>
      {value ? (
        <>
          <div className={`tnum font-medium text-ink ${SIZES[size]}`}>{value}</div>
          {unit && <div className="mt-1 text-unit text-ref">{unit}</div>}
        </>
      ) : (
        <div className="text-micro uppercase tracking-micro text-ref">{artifact}</div>
      )}
    </div>
  )
}
