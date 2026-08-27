import type { Experience } from "@/lib/constants"

export const experiences: Experience[] = [
  {
    id: "bcg-x",
    title: "Visiting AI Engineer",
    company: "BCG X",
    period: "Apr 2026 - Present",
    summary: "GenAI strategy for enterprise clients, then the systems that ship it",
    description:
      "Advise enterprise clients in luxury retail and industry on where generative AI actually creates value, then build the system that delivers it. Four strands so far: Dark Factory, an internal agent factory that takes a described agent to a deployed one; Content Studio, productized out of a single engagement into a platform other teams adopt without me in the room; content generation for fashion and luxury; and fraud prediction, five models built and compared on the same problem.",
    result: "Content Studio productized into a platform used across clients, Burberry and Prada among them",
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
    summary: "Teaching software engineering, and building it for clients",
    description:
      "Software engineering on my own terms, taught and built. Most of it has gone into teaching: machine learning, Python and algorithms to university students, and technical lead on their thesis projects, over 800 hours across four years. The rest goes into building for clients: pvsite reads an entire Italian province out of the cadastre and returns the parcels where a photovoltaic plant can legally be built, and Energy Forecast IT forecasts day-ahead electricity prices for all seven Italian bidding zones.",
    result: "677,534 parcels screened in one province, forecasts in 7 zones, over 800 hours taught",
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
    summary: "A Computer Science manual for Italian public-sector exams",
    description:
      "Authored a published Computer Science manual for Italian public-sector competitive exams: computer architecture, operating systems, algorithms, networking and databases, distilled into rigorous but accessible chapters with commented practice quizzes.",
    result: "Published 2026, 432 pages",
    links: [
      {
        label: "The book",
        href: "https://shop.enneditore.it/products/informatica-per-i-concorsi-pubblici-2026-manuale-di-teoria-e-quiz-commentati",
      },
    ],
  },
]
