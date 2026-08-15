/**
 * The mother grid. Every block that carries a value uses it, so all values on
 * the page share one right edge.
 */
export const ROW_GRID =
  "grid grid-cols-1 gap-y-3 sm:grid-cols-[1fr_var(--value-col-sm)] sm:gap-x-6 sm:gap-y-0 lg:grid-cols-[1fr_var(--value-col)] lg:gap-x-8"

/** placement of the value cell inside ROW_GRID */
export const VALUE_SLOT = "sm:col-start-2 sm:row-start-1 sm:row-span-6"

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
  /** one line, for the register */
  summary: string
  /** the full paragraph, for the detail page and page metadata */
  description: string
  value?: string
  unit?: string
  artifact?: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  period: string
  summary: string
  description: string
  value?: string
  unit?: string
  artifact?: string
}

export interface Achievement {
  id: string
  title: string
  organization: string
  date: string
  summary: string
  description: string
  value?: string
  unit?: string
  artifact?: string
}
