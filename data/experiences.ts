import type { Experience } from "@/lib/constants"

export const experiences: Experience[] = [
  {
    id: "bcg-x",
    title: "Visiting AI Engineer",
    company: "BCG X",
    period: "Apr 2026 - Present",
    summary: "GenAI strategy for enterprise clients, then the systems that ship it",
    description:
      "Advise enterprise clients in luxury retail and industrial sectors on GenAI strategy, then design and deploy the solutions end to end: multi-agent automation on Google Cloud and Vertex AI, and LLM-based content generation.",
    result: "Content Studio productized into a platform used across clients, Burberry and Prada among them",
    links: [{ label: "BCG X", href: "https://www.bcg.com/x" }],
  },
  {
    id: "freelance-energy-geospatial",
    title: "Freelance Software Engineer",
    company: "Independent, for a renewable energy developer",
    period: "2026 - Present",
    summary: "Two systems for siting and trading renewable energy in Italy",
    description:
      "Two production systems built for an independent renewable energy developer. pvsite reads an entire Italian province out of the cadastre and returns the parcels where a ground-mounted photovoltaic plant can legally be built, each with the reason. Energy Forecast IT forecasts day-ahead electricity prices for all seven Italian bidding zones, behind scheduled ingestion, an API and a dashboard. Both run and produce real output for the client, on his own machines rather than on a public site.",
    result: "677,534 parcels screened in one province; price forecasts in all 7 zones",
    highlights: [
      { value: "2", label: "systems delivered", note: "geospatial siting and price forecasting" },
      { value: "677,534", label: "parcels screened", note: "one province, end to end" },
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
  {
    id: "academic-mentor-tutor",
    title: "Academic Mentor and Technical Lead",
    company: "Self-Employed",
    period: "Feb 2022 - Present",
    summary: "Machine learning and algorithms, plus technical lead on theses",
    description:
      "Mentorship in machine learning, Python and algorithms, plus technical lead on university thesis projects: architecture design, debugging and review.",
    result: "Over 800 hours taught",
  },
]
