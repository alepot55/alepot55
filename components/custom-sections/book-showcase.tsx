import Image from "next/image"

const COVER = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/media/book-cover.jpg`

const FACTS = [
  { label: "Publisher", value: "NLD Concorsi, Neldiritto Editore" },
  { label: "Edition", value: "2026" },
  { label: "Pages", value: "432" },
  { label: "Format", value: "Theory plus commented quizzes" },
]

/** what the cover itself lists, so the page says what is inside the book */
const CONTENTS = [
  "Computing fundamentals and algorithms",
  "Hardware, software and operating systems",
  "Word, Excel, PowerPoint",
  "Networks, the internet and communication",
  "Information security and GDPR",
  "The Agile Manifesto",
]

export function BookShowcase() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8">
      <a
        href="https://shop.enneditore.it/products/informatica-per-i-concorsi-pubblici-2026-manuale-di-teoria-e-quiz-commentati"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full max-w-[15rem] overflow-hidden rounded border border-rail bg-surface transition-colors hover:border-ref"
      >
        <Image
          src={COVER}
          alt="Cover of Informatica per i concorsi pubblici 2026, manuale di teoria e quiz commentati"
          width={760}
          height={1072}
          className="h-auto w-full"
          priority
        />
      </a>

      <div>
        <h3 className="font-mono text-lead font-semibold tracking-snug text-ink">
          Informatica per i concorsi pubblici 2026
        </h3>
        <p className="mt-1 font-mono text-meta text-ref">
          Manuale di teoria e quiz commentati
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-[9rem_1fr]">
          {FACTS.map((fact) => (
            <div key={fact.label} className="contents">
              <dt className="font-mono text-meta text-ref">{fact.label}</dt>
              <dd className="font-mono text-meta text-ink tnum">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 font-mono text-meta text-ref">What it covers</p>
        <ul className="mt-2 space-y-0.5">
          {CONTENTS.map((item) => (
            <li key={item} className="text-body text-ink">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
