const CONTACT = [
  { label: "Email", href: "mailto:ap.alessandro.potenza@gmail.com" },
  { label: "GitHub", href: "https://github.com/alepot55" },
  { label: "LinkedIn", href: "https://linkedin.com/in/alepot55" },
]

export function HeroSection() {
  return (
    <section className="pb-section-sm pt-24 sm:pb-section-md sm:pt-28">
      <h1 className="font-mono text-[clamp(1.75rem,5.2vw,3rem)] font-semibold leading-[1.05] tracking-crush text-ink">
        Alessandro Potenza
      </h1>

      <p className="mt-5 max-w-lead text-lead text-ink">
        GPU kernels, compiler work, and formally verified systems. MSc Computer Engineering
        at Politecnico di Milano.
      </p>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-body">
        {CONTACT.map((c) => (
          <a
            key={c.href}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-ref underline decoration-rail underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
          >
            {c.label}
          </a>
        ))}
      </div>
    </section>
  )
}
