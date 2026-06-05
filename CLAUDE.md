# CLAUDE.md — kylerlong.dev

Persistent context for Claude Code. Keep this at the repo root.

## What this is
Personal site + journal for Kyler Long (software developer & home-health physical therapist, Orlando FL). Editorial, personal, atmospheric — NOT a typical dev portfolio.

## Stack (do not deviate without asking)
- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS — theming via CSS-variable tokens that flip on `[data-theme="dark|light"]` (see `app/globals.css`). Prefer token classes (`bg-surface`, `text-muted`) over `dark:` variants.
- `next-themes` for theme (attribute = `data-theme`, with no-flash inline script)
- MDX for blog posts (`remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`/Shiki)
- Fonts: `geist` (sans + mono) via the geist package; `Newsreader` via `next/font/google`
- Deploy: Vercel

## The design is the source of truth
`/design-reference/` holds HTML/JSX/CSS prototypes. They are **high-fidelity references**, not code to copy. Recreate them faithfully in our stack. When a value is ambiguous, OPEN THE PROTOTYPE and read the exact CSS in `styles.css` — don't guess. Full architecture & build plan: `/design-reference/SPEC.md`.

## Conventions
- Server Components by default. Mark interactive/canvas pieces `'use client'`: Nav, theme toggle, atmosphere (InteractiveField/MarginFireflies/SunRays/Clouds/Stars), progress bar, TOC scroll-spy, newsletter form.
- All decorative motion must no-op under `prefers-reduced-motion: reduce` and on touch/narrow viewports.
- Atmosphere is themed: dark = constellation + margin fireflies; light = sun rays + drifting clouds. Never both.
- Keep accessibility: nav is keyboard-usable; decorative layers are `aria-hidden`, `pointer-events:none`, behind content.

## Design tokens (canonical — mirror in globals.css)
Dark: bg #0B1628 · surface #111E33 · text #E2E8F0 · muted #94A3B8 · faint #64748B · accent #38BDF8 · border #1E293B
Light: bg #FFFFFF · surface #F8FAFC · text #0F172A · muted #475569 · accent #0284C7 · border #E2E8F0
Type: Geist (sans, body 17/1.7, features ss01/cv11), Geist Mono (labels/code), Newsreader (serif, sparing).

## Project data shapes
- Project `{ title, status: 'building'|'paused'|'evergreen', desc, stack: string[], links: { type: 'case-study'|'live', href }[] }`
  - 0 links → "In development" (no link). 1+ → independent text-only link chips ("Case study" internal / "Visit" external), diagonal arrow that rotates flat on hover. Status dot: building=sky (pulsing), paused=amber, evergreen=green.
- Post frontmatter: `{ title, slug, date, excerpt, tags, category }`.

## Routes
`/` home · `/journal` index · `/journal/[slug]` post · `/work` · `/about` · `/contact`

## Don't
- Don't port the Tweaks panel, Motion Lab, Variants, Contact Options, or design canvas (prototype scaffolding).
- Don't introduce a `/now` page (it's a home section).
- Don't set theme in a React effect (causes FOUC) — use next-themes / inline script.
- Don't make whole cards/rows clickable when there are multiple links — only the link text is the target.

## Placeholders to fill (ask Kyler)
RSS feed, X handle (currently `#`), confirm email `kyler@kylerlong.dev`, real project/case-study/live URLs, About portrait photo + Orlando map.

## Workflow
Build in phases (SPEC.md §9): scaffold → shell → static pages → journal+MDX → home → atmosphere → polish/ship. Verify each phase against `/design-reference/` before moving on.
