import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { projects } from "@/data/projects"
import { ProjectDetailPage } from "@/components/project-detail-page"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = projects.find((p) => p.id === params.id)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
  }
}

async function getProjectContent(id: string) {
  const project = projects.find((p) => p.id === id)
  if (!project) return null

  try {
    const fs = await import("fs")
    const path = await import("path")
    const filePath = path.join(process.cwd(), "content/projects", `${id}.md`)
    const content = fs.readFileSync(filePath, "utf8")
    return { project, content }
  } catch {
    return { project, content: "" }
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const result = await getProjectContent(params.id)

  if (!result) {
    notFound()
  }

  return <ProjectDetailPage project={result.project} content={result.content} />
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }))
}
