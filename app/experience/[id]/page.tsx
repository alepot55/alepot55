import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MarkdownPage } from "@/components/markdown-page"
import { BookShowcase } from "@/components/custom-sections/book-showcase"
import { experiences } from "@/data/experiences"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const exp = experiences.find((e) => e.id === params.id)
  if (!exp) return {}
  return {
    title: `${exp.title} at ${exp.company}`,
    description: exp.description,
    openGraph: {
      title: `${exp.title} at ${exp.company}`,
      description: exp.description,
      type: "article",
    },
  }
}

async function getExperienceContent(id: string) {
  const experience = experiences.find((e) => e.id === id)
  if (!experience) return null

  try {
    const fs = await import("fs")
    const path = await import("path")
    const filePath = path.join(process.cwd(), "content/experiences", `${id}.md`)
    const content = fs.readFileSync(filePath, "utf8")
    return { ...experience, content }
  } catch {
    return null
  }
}

export default async function ExperiencePage({ params }: { params: { id: string } }) {
  const experience = await getExperienceContent(params.id)

  if (!experience) {
    notFound()
  }

  return (
    <MarkdownPage
      title={experience.title}
      subtitle={`${experience.company} · ${experience.period}`}
      content={experience.content}
      highlights={experience.highlights}
      links={experience.links}
      showcase={experience.id === "book-author" ? <BookShowcase /> : undefined}
      showcaseLabel="The book"
      backHref="/"
      backLabel="Portfolio"
    />
  )
}

export async function generateStaticParams() {
  return experiences.map((experience) => ({
    id: experience.id,
  }))
}
