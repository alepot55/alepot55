import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MarkdownPage } from "@/components/markdown-page"
import { education } from "@/data/education"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const edu = education.find((e) => e.id === params.id)
  if (!edu) return {}
  return {
    title: `${edu.degree}, ${edu.institution}`,
    description: edu.description,
    openGraph: {
      title: `${edu.degree}, ${edu.institution}`,
      description: edu.description,
      type: "article",
    },
  }
}

async function getEducationContent(id: string) {
  const edu = education.find((e) => e.id === id)
  if (!edu) return null

  try {
    const fs = await import("fs")
    const path = await import("path")
    const filePath = path.join(process.cwd(), "content/education", `${id}.md`)
    const content = fs.readFileSync(filePath, "utf8")
    return { ...edu, content }
  } catch {
    return null
  }
}

export default async function EducationPage({ params }: { params: { id: string } }) {
  const edu = await getEducationContent(params.id)

  if (!edu) {
    notFound()
  }

  return (
    <MarkdownPage
      title={edu.degree}
      subtitle={`${edu.institution} · ${edu.period}`}
      content={edu.content}
      result={edu.result}
      highlights={edu.highlights}
      links={edu.links}
      backHref="/"
      backLabel="Portfolio"
    />
  )
}

export async function generateStaticParams() {
  return education.map((edu) => ({
    id: edu.id,
  }))
}
