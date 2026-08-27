import Link from "next/link"

interface CompactRowProps {
  title: string
  meta?: string
  summary: string
  href?: string
}

/**
 * The tail of a long list. Same hairline and the same voice as `Row`, with the
 * period, the result and the links dropped: enough to recognise the thing and
 * open it, not enough to make a reader scroll past it.
 */
export function CompactRow({ title, meta, summary, href }: CompactRowProps) {
  return (
    <li className="group relative border-t border-rail py-3 transition-colors duration-150 hover:bg-ink/[0.02]">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h3 className="font-mono text-body font-medium tracking-snug text-ink">
          {href ? (
            <Link
              href={href}
              className="after:absolute after:inset-0 hover:underline hover:decoration-accent hover:underline-offset-4"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {meta && <p className="font-mono text-meta text-ref">{meta}</p>}
      </div>
      <p className="mt-0.5 max-w-measure text-meta text-ref">{summary}</p>
    </li>
  )
}
