# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build (static export to `out/`)
- `npm run lint` — Run ESLint
- `npm run start` — Serve production build

No test framework is configured.

## Tech Stack

- **Next.js 14** (App Router, static export for GitHub Pages)
- **React 18** with TypeScript 5
- **Tailwind CSS** with `@tailwindcss/typography` and `tailwindcss-animate` plugins
- **framer-motion** for animations (fade-in, stagger effects)
- **recharts** for data visualization (bar charts with baselines/reference lines on project detail pages)
- **react-markdown** with remark-gfm, remark-breaks, rehype-raw for content rendering
- **remark-math** + **rehype-katex** + **katex** for LaTeX/math rendering in markdown
- **lucide-react** for icons
- **Geist** font (loaded locally via `next/font/local` with weights 400–700, CSS variable `--font-sans`)
- **@alepot55/chessboardjs** — custom chess library for interactive demos (types in `types/chessboardjs.d.ts`)
- Custom `ThemeProvider` (context + localStorage) for dark/light mode — **not** `next-themes` (despite it being in package.json)

## Architecture

This is a personal portfolio site deployed as a fully static export (`output: "export"` in next.config.mjs). Key deployment config:
- `basePath` and `assetPrefix` are set to `/alepot55` **only in production** (empty in dev)
- `trailingSlash: true` — all URLs end with `/`
- `images.unoptimized: true` — required for static export
- Deployed via GitHub Actions (`.github/workflows/nextjs.yml`) to GitHub Pages

### Content Model

Data lives in two layers:
1. **Structured data** in `/data/*.ts` — TypeScript arrays/objects defining projects, experiences, education, achievements, and skills
2. **Optional markdown** in `/content/[type]/[id].md` — Rich descriptions that augment the structured data

The `hasContentFile()` utility (in `lib/content-utils.ts`) checks at build time whether a markdown file exists for a given item. Components like `ProjectCard` conditionally render links to detail pages only when markdown content is available.

**Important naming quirk:** The content directory for experiences is `content/experiences/` (plural), while the route is `app/experience/[id]/` (singular). Same pattern: `data/experiences.ts` uses plural.

### Project Data Model

Projects (`data/projects.ts`) have a rich interface with optional fields that enable different detail page sections:
- `category`: `"ai-ml" | "systems" | "web" | "research"` — drives filtering and badge colors
- `metrics?: ProjectMetric[]` — renders metric cards on detail page
- `features?: ProjectFeature[]` — renders feature grid on detail page
- `chartData?: ChartDataPoint[]` — renders bar chart visualization on detail page
- `chartLabel?: string` — label for the chart axis
- `liveUrl?: string` — adds live demo link

### Custom Sections (Project-Specific Demos)

`ProjectDetailPage` maintains two registries — `CUSTOM_SECTIONS` and `CUSTOM_CHARTS` — that map project IDs to bespoke interactive components. These live in `components/custom-sections/` (9 components):

- `chessboard-demo.tsx` — Interactive chess board (uses `@alepot55/chessboardjs`, piece SVGs in `public/pieces/`)
- `concepthub-demo.tsx` — ConceptHub AI preview
- `confusion-matrix-viz.tsx` — ML confusion matrix for music-genre-classification
- `flash-reasoning-charts.tsx` — Charts for Flash-Reasoning project
- `flash-sae-charts.tsx` — Charts for Flash-SAE project
- `gpu-charts.tsx` — GPU benchmark visualizations with HBM limit lines
- `splat-slam-showcase.tsx` — Video embeds from GitHub for SplatSLAM
- `terminal-showcase.tsx` — Multi-tab terminal UI for agentrial (animated progress bars, syntax highlighting)
- `verification-pipeline.tsx` — Pipeline visualization for Verify-CBL

To add a custom section for a project, create a component in `components/custom-sections/` and register it in `ProjectDetailPage`'s `CUSTOM_SECTIONS` or `CUSTOM_CHARTS` map.

### Shared Types and Constants

`lib/constants.ts` exports:
- `CATEGORY_COLORS`, `CATEGORY_LABELS`, `CATEGORY_LABELS_FULL` — styling/labels for project categories
- `SKILL_CATEGORY_COLORS` — styling for skill chart bars
- `Experience`, `Education`, `Achievement` interfaces — shared type definitions

`lib/utils.ts` exports:
- `cn(...inputs)` — utility combining `clsx` + `tailwind-merge` for class composition

### Routing & Pages

- `app/page.tsx` — Main portfolio page with all sections (grid layouts)
- `app/projects/[id]/page.tsx` — Project detail pages (uses `ProjectDetailPage` component with hero, metrics, features, custom sections, chart, markdown)
- `app/experience/[id]/page.tsx` — Experience detail pages
- `app/education/[id]/page.tsx` — Education detail pages

All dynamic routes use `generateStaticParams()` for static generation.

### Component Patterns

- **Server Components** for pages (`app/*/page.tsx`) and `app/layout.tsx`; **all components in `components/`** are Client Components (`"use client"`)
- `MarkdownRenderer` handles custom rendering: code copy buttons, styled tables/blockquotes, responsive headings, external link handling, LaTeX math blocks
- `MarkdownPage` is the shared wrapper for experience/education detail pages (header, back button, GitHub link)
- `ProjectDetailPage` is the richer wrapper for project detail pages (hero section, metrics, features grid, custom sections/charts registry, markdown)
- `MotionWrapper` exports `FadeIn`, `StaggerContainer`, `StaggerItem` for framer-motion animations
- `SkillsChart` renders animated horizontal bar charts for skills
- `ProjectChart` renders recharts bar charts with optional baseline/reference lines and custom tooltips
- `cn()` from `lib/utils.ts` for class composition (clsx + tailwind-merge)

### Theming

Class-based dark mode via CSS variables (HSL values) defined in `app/globals.css`. Custom `ThemeProvider` (in `components/theme-provider.tsx`) uses React context + localStorage (`"theme"` key) and applies a class to `<html>`. An inline `<script>` in the layout prevents FOUC by reading localStorage before paint. Wraps the app in `app/layout.tsx`.

## Writing Style

- **Never use em dashes (—) in content markdown files.** They make the text look AI-generated. Use colons, commas, periods, parentheses, or restructure the sentence instead. This applies to all files under `content/`.
- Use LaTeX (`$...$`) for mathematical notation in content: variables, Big-O, multipliers (`$13.6\times$`), formulas. Don't overdo it on plain numbers/percentages.

## Adding Content

- **New project**: Add entry to `data/projects.ts`, optionally create `content/projects/[id].md`. Use `featured: true` to show in the featured section. Optionally add a custom demo component in `components/custom-sections/` and register it in `ProjectDetailPage`.
- **New experience/education/achievement**: Same pattern — update the corresponding `/data` file, optionally add markdown in `/content`
- Detail pages only become navigable when a matching markdown file exists in `/content`
