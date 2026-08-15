import Link from "next/link"
import type { ItemLink } from "@/lib/constants"

interface RowProps {
  title: string
  /** organisation, category, period: whatever situates the entry */
  meta: string
  summary: string
  /** the measured outcome, written out */
  result?: string
  links?: ItemLink[]
  /** internal detail page, when one exists */
  href?: string
}

/**
 * Every entry on the site is this: a title, where and when, one line of what it
 * is, and what you can open. Projects, roles, degrees and awards all use it, so
 * the page has one shape to learn.
 */
export function Row({ title, meta, summary, result, links, href }: RowProps) {
  return (
    <li className="group relative border-t border-rail py-4 transition-colors duration-150 hover:bg-ink/[0.02] sm:py-5">
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
        <p className="font-mono text-meta text-ref">{meta}</p>
      </div>

      <p className="mt-1.5 max-w-measure text-body text-ref">{summary}</p>

      {(result || links?.length) && (
        <div
          className={`mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1.5 ${
            result ? "justify-between" : ""
          }`}
        >
          {result && <p className="font-mono text-meta text-ink tnum">{result}</p>}
          {links && links.length > 0 && <ItemLinks links={links} />}
        </div>
      )}
    </li>
  )
}

export function ItemLinks({ links, size = "meta" }: { links: ItemLink[]; size?: "meta" | "body" }) {
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
