import Link from "next/link"
import { MarkdownRenderer } from "./markdown-renderer"
import { SectionHeader } from "./section-header"
import { ItemLinks } from "./row"
import type { ReactNode } from "react"
import type { Highlight, ItemLink } from "@/lib/constants"
import { Highlights } from "./highlights"

const LINK =
  "text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"

interface MarkdownPageProps {
  title: string
  subtitle?: string
  content: string
  backHref: string
  backLabel: string
  highlights?: Highlight[]
  links?: ItemLink[]
  /** the visual part of this entry, when it has one */
  showcase?: ReactNode
  showcaseLabel?: string
}

export function MarkdownPage({
  title,
  subtitle,
  content,
  backHref,
  backLabel,
  highlights,
  links,
  showcase,
  showcaseLabel,
}: MarkdownPageProps) {
  return (
    <>
      <header className="sticky top-0 z-50 h-header border-b border-rail bg-bg/[0.92] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-content items-center justify-between px-5 sm:px-8">
          <Link href={backHref} className="font-mono text-nav text-ref transition-colors hover:text-ink">
            {backLabel}
          </Link>
          {links && links.length > 0 && <ItemLinks links={links} size="body" />}
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-content px-5 sm:px-8">
        <section className="pb-section-sm pt-12 sm:pt-14">
          {subtitle && <p className="font-mono text-meta text-ref">{subtitle}</p>}

          <h1 className="mt-2 font-mono text-[clamp(1.5rem,3.6vw,2.25rem)] font-semibold leading-[1.1] tracking-snug text-ink">
            {title}
          </h1>

        </section>

        {highlights && highlights.length > 0 && (
          <section className="border-t border-rail pb-section-sm pt-8">
            <SectionHeader>Highlights</SectionHeader>
            <Highlights items={highlights} />
          </section>
        )}

        {showcase && (
          <section className="border-t border-rail pb-section-sm pt-8">
            <SectionHeader>{showcaseLabel ?? "The artifact"}</SectionHeader>
            {showcase}
          </section>
        )}

        <section className="border-t border-rail pb-section-sm pt-8 sm:pb-section-md">
          <SectionHeader>Write-up</SectionHeader>
          <article className="max-w-prose">
            <MarkdownRenderer content={content} />
          </article>
        </section>

        <footer className="flex flex-wrap items-baseline justify-between gap-4 border-t border-rail py-8 font-mono text-meta">
          <Link href={backHref} className={LINK}>
            {backLabel}
          </Link>
          {links && links.length > 0 && <ItemLinks links={links} />}
        </footer>
      </main>
    </>
  )
}
