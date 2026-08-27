/** something you can open: source, package, demo, paper, book */
export interface ItemLink {
  label: string
  href: string
}

/** one fact to lead a detail page with: the number, what it is, the qualifier */
export interface Highlight {
  value: string
  label: string
  note?: string
}

export const CATEGORY_LABELS: Record<string, string> = {
  "ai-ml": "AI/ML",
  systems: "Systems",
  data: "Data",
  web: "Web",
  research: "Research",
}

export const CATEGORY_LABELS_FULL: Record<string, string> = {
  "ai-ml": "AI / Machine Learning",
  systems: "Systems / GPU",
  data: "Data / Geospatial",
  web: "Web Development",
  research: "Research",
}

export interface Experience {
  id: string
  title: string
  company: string
  period: string
  /** one line, for the list */
  summary: string
  /** the full paragraph, for the detail page and the page metadata */
  description: string
  /** the two or three facts the detail page leads with */
  highlights?: Highlight[]
  links?: ItemLink[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  period: string
  summary: string
  description: string
  /** the two or three facts the detail page leads with */
  highlights?: Highlight[]
  links?: ItemLink[]
}

export interface Achievement {
  id: string
  title: string
  organization: string
  date: string
  summary: string
  description: string
  /** the two or three facts the detail page leads with */
  highlights?: Highlight[]
  links?: ItemLink[]
}
