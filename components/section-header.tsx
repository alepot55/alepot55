interface SectionHeaderProps {
  id?: string
  children: React.ReactNode
  /** a count or qualifier, right aligned */
  note?: string
}

export function SectionHeader({ id, children, note }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2
        id={id}
        className="font-mono text-row-title font-semibold tracking-snug text-ink"
      >
        {children}
      </h2>
      {note && <span className="shrink-0 font-mono text-meta text-ref tnum">{note}</span>}
    </div>
  )
}
