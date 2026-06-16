# CLAUDE.md — kylerlong.dev

Persistent context for Claude Code. Keep this at the repo root.

## What this is
Personal site + journal for Kyler Long (software developer & home-health physical therapist, Orlando FL). Editorial, personal, atmospheric — NOT a typical dev portfolio.

## Stack (do not deviate without asking)
- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS **v4** — CSS-first config (`@import "tailwindcss"` in `app/globals.css`, no `tailwind.config.js`). Theming via CSS-variable tokens that flip on `[data-theme="dark|light"]`. Prefer token classes (`bg-surface`, `text-muted`) over `dark:` variants. If a `dark:` variant is ever needed, retarget it with `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` — there is no v3 `darkMode` config key in v4.
- `next-themes` for theme (attribute = `data-theme`, with no-flash inline script)
- MDX for blog posts via **`next-mdx-remote/rsc` + `gray-matter`** (frontmatter + journal index). NOT `@next/mdx` — Turbopack is the default bundler in Next 16 and can't take function plugin options; next-mdx-remote compiles in Node so plugins pass as real functions. Plugins: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`/Shiki.
- Fonts: `geist` (sans + mono) via the geist package; `Newsreader` via `next/font/google`
- Deploy: Vercel

## Workflow
Build in phases per `BUILD_PLAN.md` (also SPEC.md §9): scaffold → shell → static pages → journal+MDX → home → atmosphere → polish/ship. One phase at a time; verify each against `/design-reference/` and stop for review before the next. Check the box + log decisions only after I confirm on the Vercel preview.

**How we work each task (no exceptions):**
1. **Research** — read the relevant code, `/design-reference/` prototypes (exact CSS in
   `styles.css` when ambiguous), `SPEC.md`, `BUILD_PLAN.md`, and docs before forming a view.
2. **Plan** — break the work into small, sequential, reviewable steps and lay them out.
3. **Approve before building** — present the plan and wait; no code until Kyler approves.
4. **Approve each change** — stop after each segment for review (+ Vercel-preview
   confirmation) before moving to the next.

## The design is the source of truth
`/design-reference/` holds HTML/JSX/CSS prototypes. They are **high-fidelity references**, not code to copy. Recreate them faithfully in our stack. When a value is ambiguous, OPEN THE PROTOTYPE and read the exact CSS in `styles.css` — don't guess. Full architecture & build plan: `/design-reference/SPEC.md`.

**Tailwind v3 → v4 translation:** the prototypes may use Tailwind **v3** conventions — always translate to **v4**. Match the *visual result*, not the literal class. Common gotchas: config → `@theme` in CSS (no `tailwind.config.js`); `darkMode` key → `@custom-variant`; renamed utilities (`shadow-sm`→`shadow-xs`, `shadow`→`shadow-sm`, `rounded`→`rounded-sm`, `rounded-sm`→`rounded-xs`, `outline-none`→`outline-hidden`, `flex-shrink/grow`→`shrink/grow`); opacity utilities (`bg-opacity-50`)→slash syntax (`bg-black/50`); `ring` default 3px→1px (use `ring-3` to keep 3px); default border/divide color is now `currentColor`.

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
X handle (currently `#`), **blog email** (`kyler@kylerlong.dev` is a placeholder — create the real inbox; used in `mailto:` on /contact + /about), real project/case-study/live URLs, About portrait photo.
*(Done in Phase 6: RSS feed → `/feed.xml`; Orlando map → real OpenStreetMap embed.)*
