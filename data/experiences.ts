import type { Experience } from "@/lib/constants"

export const experiences: Experience[] = [
  {
    id: "bcg-x",
    title: "Forward Deployed AI Engineer",
    company: "BCG X",
    period: "Apr 2026 - Present",
        summary:
      "Four GenAI systems for enterprise clients, one productized",
        description:
      "I advise enterprise clients in luxury retail and industry on where generative AI creates value, then build the system that delivers it. Four strands so far: Dark Factory, an internal agent factory; Content Studio, which I productized out of one engagement into a platform; content generation for fashion and luxury; and fraud prediction, five models compared on one problem.",
    highlights: [
      {
        value: "Content Studio",
        label: "one engagement, then a platform",
        note: "adopted across clients, Burberry and Prada among them",
      },
      {
        value: "Dark Factory",
        label: "an agent factory",
        note: "a described agent becomes a deployed one",
      },
      { value: "5", label: "models for fraud prediction", note: "built and compared on one problem" },
    ],
    links: [{ label: "BCG X", href: "https://www.bcg.com/x" }],
  },
  {
    id: "independent-work",
    title: "Software Engineer",
    company: "Self-Employed",
    period: "Feb 2022 - Present",
        summary:
      "800+ hours taught, and 2 systems for an energy client",
        description:
      "Software engineering on my own terms, taught and built. Most of it is teaching: machine learning, Python and algorithms to university students, and technical lead on their theses, over 800 hours across four years. The rest is client work: pvsite and Energy Forecast IT, both running on his machines.",
    highlights: [
      { value: "800+", label: "hours taught", note: "since 2022, plus thesis supervision" },
      { value: "677,534", label: "parcels screened", note: "one province, cadastre to ranked shortlist" },
      { value: "7", label: "bidding zones forecast", note: "rMAE 0.34 to 0.39 on real history" },
    ],
  },
  {
    id: "book-author",
    title: "Technical Book Author",
    company: "NLD Concorsi, Neldiritto Editore",
    period: "2025 - 2026",
        summary:
      "A 432-page Computer Science manual, published 2026",
    highlights: [
      { value: "432", label: "pages", note: "theory plus commented quizzes" },
      { value: "2026", label: "edition", note: "NLD Concorsi, Neldiritto Editore" },
    ],
        description:
      "I wrote a Computer Science manual for Italian public-sector competitive exams: computer architecture, operating systems, algorithms, networking and databases, with commented practice quizzes. 432 pages, published by Neldiritto Editore in 2026.",
    links: [
      {
        label: "The book",
        href: "https://shop.enneditore.it/products/informatica-per-i-concorsi-pubblici-2026-manuale-di-teoria-e-quiz-commentati",
      },
    ],
  },
]
