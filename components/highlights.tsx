import type { Highlight } from "@/lib/constants"

/**
 * The two or three facts a reader should leave with, at the top of a detail
 * page. Same shape as the key-findings block under the charts, promoted to a
 * shared component so every page emphasises its result the same way: the
 * number large and in mono, the label under it, the qualifier under that.
 *
 * No box, no card, no colour. The hairline above the strip is the only rule.
 */
export function Highlights({ items }: { items: Highlight[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label}>
          <dd className="font-mono text-value-m font-semibold leading-tight tracking-snug text-ink tnum">
            {item.value}
          </dd>
          <dt className="mt-1.5 font-mono text-meta text-ref">{item.label}</dt>
          {item.note && <p className="font-mono text-meta text-ref tnum">{item.note}</p>}
        </div>
      ))}
    </dl>
  )
}
