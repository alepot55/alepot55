interface SectionHeaderProps {
  id?: string
  children: React.ReactNode
  /** the count or qualifier that belongs to this section, right aligned */
  note?: string
  /** page sections open a chapter; parts of a page sit closer to their content */
  level?: "section" | "part"
}

/**
 * The only thing that says where you are. Sections are announced by size and
 * air, rows below them are separated by hairlines: two levels, no more.
 */
export function SectionHeader({ id, children, note, level = "section" }: SectionHeaderProps) {
  const isSection = level === "section"

  return (
    <div
      className={`flex items-baseline justify-between gap-4 ${isSection ? "mb-5" : "mb-4"}`}
    >
      <h2 id={id} className="font-mono text-row-title font-semibold tracking-snug text-ink">
        {children}
      </h2>
      {note && (
        <span className="shrink-0 font-mono text-meta text-ref tnum">{note}</span>
      )}
    </div>
  )
}
