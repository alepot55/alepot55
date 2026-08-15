import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { SectionHeader } from "@/components/section-header"
import { Row } from "@/components/row"
import { SkillsList } from "@/components/skills-list"
import { projects } from "@/data/projects"
import { experiences } from "@/data/experiences"
import { education } from "@/data/education"
import { achievements } from "@/data/achievements"
import { skills } from "@/data/skills"
import { hasContentFile } from "@/lib/content-utils"
import { CATEGORY_LABELS } from "@/lib/constants"

const SECTION = "scroll-mt-[4.5rem] pb-section-sm sm:pb-section-md lg:pb-section"

type ContentType = "projects" | "experiences" | "education"

function detail(type: ContentType, id: string, base: string) {
  return hasContentFile(type, id) ? `${base}/${id}` : undefined
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main" tabIndex={-1} className="mx-auto max-w-content px-5 sm:px-8">
        <HeroSection />

        <section className={SECTION} id="experience" aria-labelledby="experience-heading">
          <SectionHeader id="experience-heading">Experience</SectionHeader>
          <ul role="list">
            {experiences.map((e) => (
              <Row
                key={e.id}
                title={e.title}
                meta={`${e.company} · ${e.period}`}
                summary={e.summary}
                result={e.result}
                links={e.links}
                href={detail("experiences", e.id, "/experience")}
              />
            ))}
          </ul>
        </section>

        <section className={SECTION} id="education" aria-labelledby="education-heading">
          <SectionHeader id="education-heading">Education</SectionHeader>
          <ul role="list">
            {education.map((e) => (
              <Row
                key={e.id}
                title={e.degree}
                meta={`${e.institution} · ${e.period}`}
                summary={e.summary}
                result={e.result}
                links={e.links}
                href={detail("education", e.id, "/education")}
              />
            ))}
          </ul>
        </section>

        <section className={SECTION} id="projects" aria-labelledby="projects-heading">
          <SectionHeader id="projects-heading" note={String(projects.length)}>
            Projects
          </SectionHeader>
          <ul role="list">
            {projects.map((p) => (
              <Row
                key={p.id}
                title={p.title}
                meta={`${CATEGORY_LABELS[p.category]} · ${p.period}`}
                summary={p.summary}
                result={p.result}
                links={p.links}
                href={detail("projects", p.id, "/projects")}
              />
            ))}
          </ul>
        </section>

        <section className={SECTION} id="skills" aria-labelledby="skills-heading">
          <SectionHeader id="skills-heading">Skills</SectionHeader>
          <SkillsList skills={skills} />
        </section>

        <section className={SECTION} id="achievements" aria-labelledby="achievements-heading">
          <SectionHeader id="achievements-heading">Achievements</SectionHeader>
          <ul role="list">
            {achievements.map((a) => (
              <Row
                key={a.id}
                title={a.title}
                meta={`${a.organization} · ${a.date}`}
                summary={a.summary}
                result={a.result}
                links={a.links}
              />
            ))}
          </ul>
        </section>

        <footer className="flex flex-col gap-4 border-t border-rail py-8 font-mono text-meta sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-ref">Alessandro Potenza · Milano, Italy</p>
          <div className="flex gap-6">
            <a
              href="mailto:ap.alessandro.potenza@gmail.com"
              className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
            >
              Email
            </a>
            <a
              href="https://github.com/alepot55"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/alepot55"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </main>
    </>
  )
}
