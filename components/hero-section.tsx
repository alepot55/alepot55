const CONTACT = [
  { label: "Email", href: "mailto:ap.alessandro.potenza@gmail.com" },
  { label: "GitHub", href: "https://github.com/alepot55" },
  { label: "LinkedIn", href: "https://linkedin.com/in/alepot55" },
]

/**
 * What a reader can check without taking my word for it, named by its host.
 * The credibility belongs to LLVM and to IEEE, so their names are the label.
 */
const EVIDENCE = [
  {
    label: "llvm/llvm-project",
    note: "3 patches merged",
    href: "https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3Aalepot55+is%3Amerged",
  },
  {
    label: "triton-lang/triton",
    note: "2 patches merged",
    href: "https://github.com/triton-lang/triton/pulls?q=is%3Apr+author%3Aalepot55+is%3Amerged",
  },
  {
    label: "IEEE HPEC 2026",
    note: "paper accepted, oral",
    href: "https://ieee-hpec.org/",
  },
  {
    label: "pypi.org/project/agentrial",
    note: "published package, 450 tests",
    href: "https://pypi.org/project/agentrial/",
  },
]

export function HeroSection() {
  return (
    <section className="pb-section-sm pt-24 sm:pb-section-md sm:pt-28">
      <h1 className="font-mono text-[clamp(1.75rem,5.2vw,3rem)] font-semibold leading-[1.05] tracking-crush text-ink">
        Alessandro Potenza
      </h1>

      <p className="mt-5 max-w-lead text-lead text-ink">
        I write software across the range: compiler passes and GPU kernels at one end, production
        systems and agent platforms at the other. MSc at Politecnico di Milano, now Forward
        Deployed AI Engineer at BCG&nbsp;X.
      </p>

      <p className="mt-3 font-mono text-meta text-ref">Milan, Italy</p>

      <ul role="list" className="mt-8 border-t border-rail">
        {EVIDENCE.map((e) => (
          <li
            key={e.href}
            className="group relative flex flex-wrap items-baseline gap-x-4 gap-y-0.5 border-b border-rail py-2.5"
          >
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-body text-ink after:absolute after:inset-0 hover:underline hover:decoration-accent hover:underline-offset-4"
            >
              {e.label}
            </a>
            <span className="font-mono text-meta text-ref tnum">{e.note}</span>
          </li>
        ))}
      </ul>

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
