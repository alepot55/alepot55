import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ProjectsRegister } from "@/components/projects-register"
import { SkillsMatrix } from "@/components/skills-matrix"
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
import { hasAxis } from "@/lib/measure"

function SectionLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-7 font-mono text-micro uppercase tracking-micro text-ref">
      {children}
    </h2>
  )
}

/**
 * The page opens on the one measurement that crosses a physical ceiling. If no
 * such measurement exists, it opens on the first featured one that has an axis.
 */
function pickFlagship() {
  return (
    projects.find((p) => p.measurement?.limit && p.measurement.value > p.measurement.limit.value) ??
    projects.find((p) => p.featured && p.measurement && hasAxis(p.measurement))
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

  const flagship = pickFlagship()
  const measured = projects.filter((p) => p.measurement).length

  return (
    <>
      <SiteHeader />

      <main id="main" tabIndex={-1} className="mx-auto max-w-content px-5 sm:px-8">
        <HeroSection flagship={flagship} />

        <section
          className="scroll-mt-[4.5rem] pb-section-sm sm:pb-section-md lg:pb-section"
          id="projects"
          aria-labelledby="projects-heading"
        >
          <SectionLabel id="projects-heading">
            Projects · {projects.length} listed · {measured} measured
          </SectionLabel>
          <ProjectsRegister
            projects={projects}
            contentMap={projectContentMap}
            heroProjectId={flagship?.id}
          />
        </section>

        <section
          className="scroll-mt-[4.5rem] pb-section-sm sm:pb-section-md lg:pb-section"
          id="skills"
          aria-labelledby="skills-heading"
        >
          <SectionLabel id="skills-heading">Skills · listed, not rated</SectionLabel>
          <SkillsMatrix skills={skills} />
        </section>

        <div
          className="grid scroll-mt-[4.5rem] grid-cols-1 gap-x-16 gap-y-12 pb-section-sm sm:pb-section-md lg:grid-cols-2 lg:pb-section"
          id="experience"
        >
          <section aria-labelledby="experience-heading">
            <SectionLabel id="experience-heading">Experience · {experiences.length}</SectionLabel>
            <ul role="list">
              {experiences.map((experience) => (
                <ExperienceItem
                  key={experience.id}
                  experience={experience}
                  hasContent={experienceContentMap[experience.id] || false}
                />
              ))}
            </ul>
          </section>

          <section aria-labelledby="education-heading">
            <SectionLabel id="education-heading">Education · {education.length}</SectionLabel>
            <ul role="list">
              {education.map((edu) => (
                <EducationItem
                  key={edu.id}
                  education={edu}
                  hasContent={educationContentMap[edu.id] || false}
                />
              ))}
            </ul>
          </section>
        </div>

        <section
          className="scroll-mt-[4.5rem] pb-section-sm sm:pb-section-md lg:pb-section"
          id="achievements"
          aria-labelledby="achievements-heading"
        >
          <SectionLabel id="achievements-heading">
            Achievements · {achievements.length}
          </SectionLabel>
          <ul role="list">
            {achievements.map((achievement) => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))}
          </ul>
        </section>

        <footer className="flex flex-col gap-4 pb-14 pt-10 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-mono text-meta text-ref">Alessandro Potenza · Milano, Italy</p>
          <div className="flex gap-6 font-mono text-meta">
            <a
              href="mailto:ap.alessandro.potenza@gmail.com"
              className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-limit"
            >
              Email
            </a>
            <a
              href="https://github.com/alepot55"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-limit"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/alepot55"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-limit"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </main>

      <ScrollToTop />
    </>
  )
}
