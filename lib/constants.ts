/** something you can open: source, package, demo, paper, book */
export interface ItemLink {
  label: string
  href: string
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
  /** the measured outcome, written out. No chart, no bar. */
  result?: string
  links?: ItemLink[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  period: string
  summary: string
  description: string
  result?: string
  links?: ItemLink[]
}

export interface Achievement {
  id: string
  title: string
  organization: string
  date: string
  summary: string
  description: string
  result?: string
  links?: ItemLink[]
}
