import Link from "next/link"
import type { ItemLink } from "@/lib/constants"

interface RowProps {
  title: string
  /** the period, in its own column so the page can be read chronologically */
  period: string
  /** organisation or category: where this belongs */
  meta?: string
  summary: string
  links?: ItemLink[]
  /** internal detail page, when one exists */
  href?: string
}

/**
 * Every entry on the site is this shape: when, what, one line of what it is,
 * and what you can open. The period sits in a fixed left column so a reader
 * can scan the dates down the page without reading anything else.
 */
export function Row({ title, period, meta, summary, links, href }: RowProps) {
  return (
    <li className="group relative grid grid-cols-1 gap-x-8 gap-y-1 border-t border-rail py-4 transition-colors duration-150 hover:bg-ink/[0.02] sm:grid-cols-[9rem_1fr] sm:py-5">
      <p className="font-mono text-meta text-ref tnum sm:pt-1">{period}</p>

      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-mono text-lead font-semibold tracking-snug text-ink">
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

        <p className="mt-1.5 max-w-measure text-body text-ref">{summary}</p>

        {links && links.length > 0 && (
          <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1.5">
            <ItemLinks links={links} />
          </div>
        )}
      </div>
    </li>
  )
}

interface ItemLinksProps {
  links: ItemLink[]
  size?: "meta" | "body"
}

export function ItemLinks({ links, size = "meta" }: ItemLinksProps) {
  return (
    <span
      className={`relative z-10 flex flex-wrap gap-x-4 gap-y-1 font-mono ${
        size === "body" ? "text-nav" : "text-meta"
      }`}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
        >
          {link.label}
        </a>
      ))}
    </span>
  )
}
