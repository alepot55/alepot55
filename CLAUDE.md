# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build (static export to `out/`)
- `npm run start` — Serve production build

No test framework is configured. ESLint is not configured either: `npm run lint` drops into the Next.js
setup prompt. Use `npx tsc --noEmit` plus `npm run build` as the gate.

## Tech Stack

- **Next.js 14** (App Router, static export for GitHub Pages)
- **React 18** with TypeScript 5
- **Tailwind CSS** with `@tailwindcss/typography` and `tailwindcss-animate` plugins
- **framer-motion** — one meaningful animation only, see Design System below
- **recharts** for the per-project chart components
- **react-markdown** with remark-gfm, remark-breaks, rehype-raw for content rendering
- **remark-math** + **rehype-katex** + **katex** for LaTeX in markdown
- **lucide-react** for the few remaining icons
- **Chivo Mono** self-hosted from `app/fonts/` via `next/font/local`, CSS variable `--font-mono`.
  Deliberately not `next/font/google`: that made the production build depend on reaching
  fonts.googleapis.com, which failed intermittently.
- **Geist Sans** via `next/font/local` from `node_modules/geist`, weights 400/500/600, `--font-sans`
- **@alepot55/chessboardjs** — chess library for the interactive demo (types in `types/chessboardjs.d.ts`)
- Custom `ThemeProvider` (context + localStorage) for dark/light mode, **not** `next-themes` (despite it
  being in package.json). It also wraps everything in `MotionConfig reducedMotion="user"`.

## Design system

The full contract lives in `.design-system.md` at the repo root. **Read it before touching any
component.** The short version:

- **Six colour tokens only**: `bg`, `surface`, `ink`, `ref`, `rail`, `limit`. No Tailwind palette
  colours, no hex literals, and no `dark:` variants for colour: the tokens flip themselves.
- `--limit` marks constraints, never success. `--rail` never carries information (contrast ~1.2:1).
- **Two typefaces, one rule**: `font-mono` for anything that is a label, identifier, number, unit,
  heading or code; the default sans for sentences only. Every visible digit is in mono.
- Spaced uppercase is reserved for section labels. Nowhere else.
- **No cards**: no bordered boxes around content, no shadows, no gradients. Radius is 4px everywhere.
- **Hairlines do two jobs only**: separate the rows of a register, and mark where a part of a page
  begins. Everything else is separated by space.
- **Two structural levels**: `SectionHeader` announces a section or a page part, hairlines separate
  the rows below it. Detail pages name every part (`Measurements`, `Write-up`, and the per-project
  demo label in `CUSTOM_SECTION_LABELS`).
- **One animation**: the measurement segment being drawn. No entry animations, no stagger.

### The value column

Every block that carries a value uses `ROW_GRID` from `lib/constants.ts`, with the value in the right
column via `ValueCell` and the `VALUE_SLOT` placement class. All values on the page therefore share
one right edge. House rule: the value cell never repeats a string already printed on the left of the
same row, and an empty cell is a legitimate state.

### Measurements

`lib/measure.ts` defines `Measurement`, the scale helper and the screen-reader description.
`components/measure.tsx` draws the axis. Rules that are enforced by the code and must stay that way:

- An axis is only drawn when a `baseline` or a `limit` exists. Without a reference an axis measures
  nothing, so the row shows the bare value instead.
- The filled segment is a length encoding, so it only appears on a linear scale. Log scale gets
  markers and no fill.
- `provenance` is copied from the write-up, never inferred. If the hardware is not stated in the
  content, the provenance carries the method and does not invent a GPU.
- Approximate or ranged source values keep their form via `display` ("~134", "82-83").
- Each measurement is drawn once per page: the hero spends the flagship one, and that project's row
  receives `axisDrawn`.

## Architecture

Fully static export (`output: "export"` in next.config.mjs):
- `basePath` and `assetPrefix` are `/alepot55` only on GitHub Pages: production builds that set
  `VERCEL` (preview deployments) and local dev serve from the root
- `trailingSlash: true`, `images.unoptimized: true`
- Deployed via GitHub Actions (`.github/workflows/nextjs.yml`) to GitHub Pages

### Content model

1. **Structured data** in `/data/*.ts` — projects, experiences, education, achievements, skills
2. **Optional markdown** in `/content/[type]/[id].md`

`hasContentFile()` (in `lib/content-utils.ts`) checks at build time whether a markdown file exists.
Rows only link to a detail page when it does.

**Naming quirk:** the content directory for experiences is `content/experiences/` (plural) while the
route is `app/experience/[id]/` (singular). `data/experiences.ts` is plural too.

### Project data model

- `category`: `"ai-ml" | "systems" | "data" | "web" | "research"` — drives the register filter
- `featured?: boolean` — eligible to open the page as the hero measurement; does not change the row
- `measurement?: Measurement` — the headline number with its references and source
- `artifact?: string` — what exists instead, when nothing was benchmarked ("npm package", "live demo")
- `github?`, `liveUrl?`

Skills carry no proficiency rating. `lib/skill-usage.ts` counts, at build time, how many projects list
each skill; the count is shown only from 2 upwards, so a reader can verify it by scanning the chips.

### Custom sections

`ProjectDetailPage` maintains `CUSTOM_SECTIONS` and `CUSTOM_CHARTS`, mapping project ids to the ten
components in `components/custom-sections/`: `atlas-mm-charts`, `chessboard-demo`, `concepthub-demo`,
`confusion-matrix-viz`, `flash-reasoning-charts`, `flash-sae-charts`, `gpu-charts`,
`splat-slam-showcase`, `terminal-showcase`, `verification-pipeline`.

To add one, create the component and register it in the right map.

### Shared types and constants

`lib/constants.ts` exports `ROW_GRID`, `VALUE_SLOT`, `ROW_GRID_NARROW`, `CATEGORY_LABELS`,
`CATEGORY_LABELS_FULL`, and the `Experience`, `Education`, `Achievement` interfaces, which the data
files apply. Those three carry optional `value` / `unit` / `artifact` for the value column.

`lib/utils.ts` exports `cn(...inputs)` (clsx + tailwind-merge).

### Routing

- `app/page.tsx` — the whole portfolio: hero, one project register, skills, experience, education,
  achievements, footer
- `app/projects/[id]/page.tsx`, `app/experience/[id]/page.tsx`, `app/education/[id]/page.tsx`

All dynamic routes use `generateStaticParams()`.

### Component patterns

- **Server Components** for pages and `app/layout.tsx`. Components are Client Components only when
  they need state or motion: `value-cell`, `skills-matrix`, `experience-item`, `education-item` and
  `achievement-item` are server components.
- `ProjectsRegister` holds the filter and renders one uniform list. Every project row has the same
  shape; the only variation is whether its measurement had a reference to draw an axis against.
  There is no separate "featured" section, so no project appears twice.
- `MarkdownRenderer` styles every element explicitly and no longer uses the `prose` classes.
- `MotionWrapper` exports only `FadeIn`, which is opacity-only and takes no `delay` or `direction`.
- The skip link in `app/layout.tsx` targets `#main`; every `<main>` needs `id="main"` and `tabIndex={-1}`.

### Theming

Class-based dark mode via HSL CSS variables in `app/globals.css`. `ThemeProvider` uses React context
plus localStorage (`"theme"`), applying a class to `<html>`. An inline script in the layout reads
localStorage before paint to avoid a flash.

## Writing style

- **Never use em dashes (—)** anywhere in content or UI copy. Use colons, commas, parentheses, or
  restructure. No emoji. No glyphs outside Latin-1.
- Use LaTeX (`$...$`) for mathematical notation in content: variables, Big-O, multipliers
  (`$13.6\times$`), formulas. Do not overdo it on plain numbers and percentages.
- Numbers in content must match the numbers in `data/projects.ts`. If a write-up hedges a figure, the
  data hedges it too.

## Adding content

- **New project**: add an entry to `data/projects.ts`, optionally create `content/projects/[id].md`.
  `featured: true` expands the row. Give it a `measurement` if one exists, an `artifact` if not.
- **New experience/education/achievement**: update the corresponding `/data` file, optionally add
  markdown in `/content`.
- Detail pages only become navigable when a matching markdown file exists.
