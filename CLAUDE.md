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
- **recharts** for the per-project chart components
- **react-markdown** with remark-gfm, remark-breaks, rehype-raw for content rendering
- **remark-math** + **rehype-katex** + **katex** for LaTeX in markdown
- **lucide-react** for the few remaining icons
- **Chivo Mono** self-hosted from `app/fonts/` via `next/font/local`, CSS variable `--font-mono`.
  Deliberately not `next/font/google`: that made the production build depend on reaching
  fonts.googleapis.com, which failed intermittently.
- **Geist Sans** via `next/font/local` from `node_modules/geist`, weights 400/500/600, `--font-sans`
- **@alepot55/chessboardjs** — chess library for the interactive demo (types in `types/chessboardjs.d.ts`)
- No theme provider and no dark mode: the site is light only.

## Design system

The full contract lives in `.design-system.md` at the repo root. **Read it before touching any
component.** The short version:

- **Five colour tokens, light only**: `bg`, `surface`, `ink`, `ref`, `rail`, `accent`. No Tailwind
  palette colours, no hex literals, and no dark mode: there is no theme provider and no toggle.
- `--accent` marks the focus ring, link hover, and failure states. Nothing else.
- **Two typefaces**: `font-mono` (Chivo Mono) for labels, identifiers, numbers, headings and code;
  the default sans (Geist) for sentences.
- **One row, repeated.** `components/row.tsx` renders every entry on the site: title plus meta on
  one line, one line of summary, then the written result and the links. Projects, roles, degrees
  and awards all use it.
- Rows are separated by hairlines, sections by `SectionHeader`. Those are the only two levels.
- **No cards, no bars, no charts in the lists.** A result is a sentence with the number in it.
  Charts live on the detail pages.
- **Artifacts come first.** Every entry carries `links: {label, href}[]`, rendered on the row and
  twice on the detail page. If it exists in public, it gets a link.
- Nothing animates on entry.

### Assets under a base path

The site is served from `/alepot55` on GitHub Pages and from the root everywhere else. Anything the
client fetches itself (the chess piece SVGs) must read `process.env.NEXT_PUBLIC_BASE_PATH`, which
`next.config.mjs` sets to the prefix the build actually used. Never hardcode `/alepot55`.

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

### Data model

Every list entry, whatever the section, carries the same fields:

- `summary: string` — the one line shown in the list
- `description: string` — the paragraph, for the detail page and the page metadata
- `result?: string` — the measured outcome written out as a sentence
- `links?: ItemLink[]` — what a reader can open

Projects add `category` (`"ai-ml" | "systems" | "data" | "web" | "research"`) and `technologies`.
`featured` is vestigial and does not change rendering.

Skills carry no proficiency rating. `lib/skill-usage.ts` counts, at build time, how many projects
list each skill, and the entries are ordered by that count so the evidenced ones lead.

### Custom sections

`ProjectDetailPage` maintains `CUSTOM_SECTIONS` and `CUSTOM_CHARTS`, mapping project ids to the ten
components in `components/custom-sections/`: `atlas-mm-charts`, `chessboard-demo`, `concepthub-demo`,
`confusion-matrix-viz`, `flash-reasoning-charts`, `flash-sae-charts`, `gpu-charts`,
`splat-slam-showcase`, `terminal-showcase`, `verification-pipeline`.

To add one, create the component and register it in the right map.

### Shared types and constants

`lib/constants.ts` exports `ItemLink`, `CATEGORY_LABELS`, `CATEGORY_LABELS_FULL`, and the
`Experience`, `Education`, `Achievement` interfaces, which the data files apply.

`lib/utils.ts` exports `cn(...inputs)` (clsx + tailwind-merge).

### Routing

- `app/page.tsx` — the whole portfolio in one order: hero, experience, education, projects, skills,
  achievements, footer. Experience and education come before projects so a recruiter reaches them
  without scrolling past eleven entries.
- `app/projects/[id]/page.tsx`, `app/experience/[id]/page.tsx`, `app/education/[id]/page.tsx`

All dynamic routes use `generateStaticParams()`.

### Component patterns

- **Server Components everywhere** except `SiteHeader`, which needs scroll state, and the custom
  sections that are interactive.
- `Row` and `ItemLinks` live in `components/row.tsx`. `SectionHeader` announces a section or a part
  of a detail page.
- `MarkdownRenderer` styles every element explicitly and does not use the `prose` classes.
- The skip link in `app/layout.tsx` targets `#main`; every `<main>` needs `id="main"` and
  `tabIndex={-1}`.

### Theming

There is none. One light theme, defined once in `app/globals.css`.

## Writing style

- **Never use em dashes (—)** anywhere in content or UI copy. Use colons, commas, parentheses, or
  restructure. No emoji. No glyphs outside Latin-1.
- **LaTeX only for real formulas**, in display blocks (`$$...$$`): fractions, sums, notation that
  prose cannot carry. Inline `$...$` is banned. KaTeX ships a third typeface, so using it for a
  multiplier makes the page change voice mid-sentence for nothing.
  - multipliers are text: `13.6x`, never `$13.6\times$`
  - percentages are words: `97 percent`
  - identifiers and variables are inline code: `k`, `d_model`, `O(batch * k * d_model)`
  - a display formula is followed by a list glossing its symbols, not a paragraph full of `$...$`
- **Write-ups carry no summary block.** The page already prints the opening sentence and the three
  highlights above the write-up; a `## In short` block is the fourth copy of the same facts and is
  banned. Deleting it removed 2,111 words, 23 percent of the corpus.
- **Every `##` heading is a claim containing a number**, so the headings alone read as the summary:
  "## The gap is 10.2x median and 32.8x worst, across 13 benchmarks", never "## Problem and prior work".
- **Budgets, enforced by `scripts/lint-copy.py`:** list-row summary at most 13 words and 70 characters
  and it must contain a digit; a write-up at most 500 words; a section at most 90 words and 3 sentences.
- **No closing reflection.** If a lesson is real it goes in the section holding its evidence.
- **Three or more parallel facts sharing a schema become a table**, not a list of sentences.
- **First person for provenance only**: what I built, when, with whom, what a reviewer rejected.
- **Banned constructions**, all checked by the linter: promotional adjectives; a quantity word with no
  quantity; an editorial tail (", rather than X", "and that is the point"); "not X but Y"; a sentence
  whose subject is the previous sentence; a hidden verb; a sentence that stays true under another
  project's title; an epigram. The site is allowed one epigram in total.
- Numbers in content must match the numbers in `data/projects.ts`. If a write-up hedges a figure, the
  data hedges it too. A number that came from a synthetic or development set says so in the sentence
  that states it, never in a footnote.

## Adding content

- **New project**: add an entry to `data/projects.ts`, optionally create `content/projects/[id].md`.
  The summary must contain a digit. There is no `result` field: the number lives in the summary.
- **New experience/education/achievement**: update the corresponding `/data` file, optionally add
  markdown in `/content`.
- Detail pages only become navigable when a matching markdown file exists.
