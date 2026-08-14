import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { MarkdownRenderer } from "./markdown-renderer"
import { SectionHeader } from "./section-header"

const LINK =
  "text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-limit"

interface MarkdownPageProps {
  title: string
  subtitle?: string
  content: string
  backHref: string
  backLabel: string
  github?: string
  technologies?: string[]
}

export function MarkdownPage({ title, subtitle, content, backHref, backLabel, github, technologies }: MarkdownPageProps) {
  return (
    <>
      <header className="sticky top-0 z-50 h-header border-b border-rail bg-surface/[0.88] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-content items-center justify-between px-5 sm:px-8">
          <Link href={backHref} className="font-mono text-nav text-ref transition-colors hover:text-ink">
            {backLabel}
          </Link>
          <div className="flex items-center gap-5 font-mono text-nav">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className={LINK}>
                source
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-content px-5 sm:px-8">
        <section className="pb-10 pt-12 sm:pt-16">
          {subtitle && <p className="font-mono text-meta text-ref">{subtitle}</p>}

          <h1 className="mt-2 font-mono text-[clamp(1.5rem,3.6vw,2.25rem)] font-semibold leading-[1.1] tracking-snug text-ink">
            {title}
          </h1>

          {technologies && technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-1.5 gap-y-1.5">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-sm bg-ink/[0.05] px-1.5 py-0.5 font-mono text-meta text-ref"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-rail pb-section-sm pt-8 sm:pb-section-md">
          <SectionHeader level="part">Write-up</SectionHeader>
          <article className="max-w-prose">
            <MarkdownRenderer content={content} />
          </article>
        </section>

        <footer className="border-t border-rail py-8 font-mono text-meta">
          <Link href={backHref} className={LINK}>
            {backLabel}
          </Link>
        </footer>
      </main>
    </>
  )
}
