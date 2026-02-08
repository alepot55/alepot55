import type { MetadataRoute } from "next"
import { projects } from "@/data/projects"
import { experiences } from "@/data/experiences"
import { education } from "@/data/education"

const siteUrl = "https://alepot55.github.io/alepot55"

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.id}/`,
    lastModified: new Date(),
  }))

  const experiencePages = experiences.map((exp) => ({
    url: `${siteUrl}/experience/${exp.id}/`,
    lastModified: new Date(),
  }))

  const educationPages = education.map((edu) => ({
    url: `${siteUrl}/education/${edu.id}/`,
    lastModified: new Date(),
  }))

  return [
    { url: `${siteUrl}/`, lastModified: new Date() },
    ...projectPages,
    ...experiencePages,
    ...educationPages,
  ]
}
