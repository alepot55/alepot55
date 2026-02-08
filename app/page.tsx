import { ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ProjectCard } from "@/components/project-card"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsChart } from "@/components/skills-chart"
import { ExperienceItem } from "@/components/experience-item"
import { EducationItem } from "@/components/education-item"
import { AchievementItem } from "@/components/achievement-item"
import { ScrollToTop } from "@/components/scroll-to-top"
import { projects } from "@/data/projects"
import { experiences } from "@/data/experiences"
import { education } from "@/data/education"
import { achievements } from "@/data/achievements"
import { skills } from "@/data/skills"
import { hasContentFile } from "@/lib/content-utils"

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-3"
    >
      <span className="h-px w-6 bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
      {children}
    </h2>
  )
}

export default function Home() {
  const projectContentMap: Record<string, boolean> = {}
  for (const project of projects) {
    projectContentMap[project.id] = hasContentFile("projects", project.id)
  }

  const experienceContentMap: Record<string, boolean> = {}
  for (const exp of experiences) {
    experienceContentMap[exp.id] = hasContentFile("experiences", exp.id)
  }

  const educationContentMap: Record<string, boolean> = {}
  for (const edu of education) {
    educationContentMap[edu.id] = hasContentFile("education", edu.id)
  }

  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <HeroSection />

        {/* Featured Projects */}
        <section className="pb-16 sm:pb-24" id="projects" aria-labelledby="featured-heading">
          <SectionHeading id="featured-heading">Featured Projects</SectionHeading>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                hasContent={projectContentMap[project.id] || false}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* All Projects (with filter) */}
        <ProjectsSection projects={projects} contentMap={projectContentMap} />

        {/* Skills */}
        <section className="pb-16 sm:pb-24" id="skills" aria-labelledby="skills-heading">
          <SectionHeading id="skills-heading">Skills</SectionHeading>
          <div className="max-w-3xl">
            <SkillsChart skills={skills} />
          </div>
        </section>

        {/* Experience + Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-16 sm:pb-24" id="experience">
          <section aria-labelledby="experience-heading">
            <SectionHeading id="experience-heading">Experience</SectionHeading>
            <div className="space-y-8">
              {experiences.map((experience, index) => (
                <ExperienceItem
                  key={experience.id}
                  experience={experience}
                  index={index}
                  hasContent={experienceContentMap[experience.id] || false}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="education-heading">
            <SectionHeading id="education-heading">Education</SectionHeading>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <EducationItem
                  key={edu.id}
                  education={edu}
                  index={index}
                  hasContent={educationContentMap[edu.id] || false}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Achievements */}
        <section className="pb-16 sm:pb-24" id="achievements" aria-labelledby="achievements-heading">
          <SectionHeading id="achievements-heading">Achievements</SectionHeading>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {achievements.map((achievement, index) => (
              <AchievementItem key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Alessandro Potenza
            </p>
            <div className="flex gap-6">
              <a
                href="mailto:ap.alessandro.potenza@gmail.com"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1.5"
              >
                Email <ArrowUpRight size={12} />
              </a>
              <a
                href="https://github.com/alepot55"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1.5"
              >
                GitHub <ArrowUpRight size={12} />
              </a>
              <a
                href="https://linkedin.com/in/alepot55"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1.5"
              >
                LinkedIn <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </footer>
      </main>

      <ScrollToTop />
    </div>
  )
}
