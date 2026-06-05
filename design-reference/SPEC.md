# SPEC — kylerlong.dev

A personal site + journal for Kyler Long (software developer & home-health physical therapist, Orlando FL). This document is the implementation spec for rebuilding the design prototypes in a production Next.js codebase.

---

## 0. How to use this package

```
design_handoff_kylerlong_site/
├── SPEC.md                 ← you are here (architecture, tokens, build plan)
├── CLAUDE.md               ← copy to the ROOT of the new repo (persistent AI context)
└── design-reference/       ← the HTML/JSX/CSS PROTOTYPES (your source of truth)
```

**The files in `design-reference/` are design references, not production code.** They were built as HTML prototypes using React-via-Babel (no build step) to lock the look and behavior. **Do not ship them as-is.** Your job is to **recreate them faithfully** in Next.js + TypeScript + Tailwind, using the patterns below. They are **high-fidelity** — colors, spacing, type, and interactions are final. Match them pixel-for-pixel; when in doubt, open the prototype file and read the exact CSS.

Recommended workflow with Claude Code:
1. Copy `CLAUDE.md` to the repo root.
2. Drop `design-reference/` into the repo (e.g. `/design-reference`, gitignored or kept as docs).
3. Work through the **Build Plan (§9)** one phase at a time, reviewing each before moving on.

---

## 1. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | RSC by default; mark interactive pieces `'use client'`. |
| Language | **TypeScript** | strict mode. |
| Styling | **Tailwind CSS** | Tokens become CSS variables + Tailwind theme (see §3). |
| Content | **MDX** | Blog posts as `.mdx` with frontmatter. |
| Theme | **`next-themes`** | Replaces the prototype's hand-rolled theme persistence; kills the FOUC. Use `attribute="data-theme"`. |
| Fonts | **`geist` + `next/font`** | Geist + Geist Mono are first-party. Add Newsreader via `next/font/google`. |
| Hosting | **Vercel** | Zero-config. |

### Key libraries
- `next-themes` — theme with no flash, `data-theme` attribute strategy.
- `geist/font/sans`, `geist/font/mono` — fonts.
- `next/font/google` → `Newsreader` (serif, used on the Contact "open letter" feel & post body option).
- MDX pipeline: `@next/mdx` **or** `next-mdx-remote` (recommended for a content folder of posts), with:
  - `remark-gfm` (tables, strikethrough, footnotes)
  - `rehype-slug` + `rehype-autolink-headings` (anchor links for the TOC)
  - `rehype-pretty-code` (Shiki) for syntax-highlighted code blocks
- `lucide-react` (or keep the inline SVGs from the prototypes — they're clean).

---

## 2. Information architecture

| Route | Prototype file | App component | Notes |
|---|---|---|---|
| `/` | `Home.html` + `home-app.jsx` | `app/page.tsx` | Hero, recent writing, "Now", selected work, contact, newsletter. |
| `/journal` | `Journal.html` + `journal-app.jsx` | `app/journal/page.tsx` | Post index: list + sticky filter/popular rail. |
| `/journal/[slug]` | `Blog Post.html` + `app/(post)/page` (`app.jsx`, `post-content.jsx`) | `app/journal/[slug]/page.tsx` | MDX article: TOC, progress bar, code, callouts, footnotes. |
| `/work` | `Work.html` + `work-app.jsx` | `app/work/page.tsx` | Featured project hero + "Also built" list. |
| `/about` | `About.html` + `about-app.jsx` | `app/about/page.tsx` | Bento grid (layout A). |
| `/contact` | `Contact.html` + `contact-app.jsx` | `app/contact/page.tsx` | "Colophon ledger" + newsletter card. |

**Ignore these prototype-only files** (scratch/exploration, not part of the site): `Motion Lab.html`, `motion-lab.jsx`, `Variants.html`, `variants-app.jsx`, `Contact Options.html`, `contact-options.jsx`, `design-canvas.jsx`, `tweaks-panel.jsx`, `image-slot.js`. The **Tweaks panel** was a prototyping device for choosing options — the winning choices are baked into this spec; do not port the tweaks system.

---

## 3. Design tokens → Tailwind

Tokens live as CSS variables and flip on `[data-theme]`. Put these in `app/globals.css`, then reference them from the Tailwind theme so you can use `bg-surface`, `text-muted`, etc.

```css
/* globals.css */
:root {
  /* Dark (default) */
  --bg: #0B1628;
  --surface: #111E33;
  --surface-2: #16243C;
  --text: #E2E8F0;
  --text-2: #94A3B8;
  --text-3: #64748B;
  --accent: #38BDF8;
  --accent-soft: rgba(56,189,248,0.12);
  --accent-line: rgba(56,189,248,0.28);
  --border: #1E293B;
  --border-soft: #182238;
  --selection: rgba(56,189,248,0.25);
}
[data-theme="light"] {
  --bg: #FFFFFF;
  --surface: #F8FAFC;
  --surface-2: #F1F5F9;
  --text: #0F172A;
  --text-2: #475569;
  --text-3: #64748B;
  --accent: #0284C7;          /* accent darkens in light mode for contrast */
  --accent-soft: rgba(56,189,248,0.10);
  --accent-line: rgba(2,132,199,0.3);
  --border: #E2E8F0;
  --border-soft: #EEF2F7;
  --selection: rgba(56,189,248,0.3);
}
```

Tailwind theme mapping (v3 `tailwind.config.ts` `theme.extend.colors`, or v4 `@theme` block):

```ts
colors: {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  'surface-2': 'var(--surface-2)',
  fg: 'var(--text)',
  muted: 'var(--text-2)',
  faint: 'var(--text-3)',
  accent: 'var(--accent)',
  border: 'var(--border)',
  'border-soft': 'var(--border-soft)',
},
```

> **Tailwind dark mode strategy:** the prototype uses `data-theme="dark|light"`, not Tailwind's `class`/media default. Configure `darkMode: ['selector', '[data-theme="dark"]']` (v3.4+) — but since most theming is via the CSS-variable tokens above, you'll rarely need `dark:` variants at all. Prefer the token approach.

### Type
- **Sans:** Geist — body 17px / line-height 1.7; font-feature-settings `"ss01","cv11"`; antialiased.
- **Mono:** Geist Mono — labels, eyebrows, the contact ledger, code.
- **Serif:** Newsreader — used sparingly (editorial flourishes).
- Eyebrows/labels: mono, ~12px, `text-transform: uppercase`, `letter-spacing: 0.13–0.14em`, color `--text-3`.

### Other tokens
- Radius: cards `12px`, large feature cards `18px`, pills `999px`, buttons `6–8px`.
- Body max-widths: home `920px`, journal/work/about/contact shell `1080px`, post shell `1180px` (article column `680px` + rails).
- Shadows: soft, low-alpha — e.g. cards `0 12px 28px rgba(0,0,0,0.22)` (dark); elevated newsletter uses a moonlight glow in dark, a soft drop in light.

---

## 4. Shared layout & components

These live in the prototype's `components.jsx` and `atmosphere.jsx`. Recreate as real components.

### `<Nav>` (sticky top bar) — `'use client'`
- Logo `kylerlong.dev` (the `.` is accent-colored), nav links (journal / work / about / contact), theme toggle, hamburger.
- **Desktop:** inline links. **≤640px:** links collapse into an animated dropdown.
- **Animated hamburger → X:** three `<span>` bars; on open the top/bottom bars rotate ±45° to center, middle bar fades. ~0.32s `cubic-bezier(0.5,0.05,0.2,1)`.
- **Slide-down menu:** `max-height` 0→~340px + opacity + `translateY(-8px)→0`, ~0.36s `cubic-bezier(0.4,0,0.2,1)`; links **stagger in** (`transition-delay` 0.06s→0.21s). Respects `prefers-reduced-motion`.
- **Animated theme toggle:** sun ⇄ moon crossfade — outgoing icon rotates/scales out, incoming rotates/scales in (~0.5s). Sun shown in dark mode, moon in light. With `next-themes` the active theme drives which icon is full-opacity. (See `components.jsx` for exact transforms.)
- Active link = accent color.

### `<Footer>`
- `© <year> Kyler Long · Orlando, FL` + links: `rss` (placeholder), `github` → `https://github.com/KylerLong-dev`, `x` (placeholder `#` until a handle exists).
- Sits in a tinted band above a **reeds** silhouette separator.

### `<Separator variant="reeds">` + `reeds-mask.png`
- A reeds-and-cattails horizon silhouette used at the footer top (and the header band uses a curved/elliptical divider, `<CurveDivider>`). The reeds are drawn with `reeds-mask.png` (included in this bundle). In light mode the reeds may carry a subtle cloud-shadow tint; in dark mode they're a solid silhouette.

### Page header band (`.j-header` / `.page-band`)
- Interior pages share a header band: mono eyebrow with a dot, big title, sub. Dark mode shows **stars + a shooting star**; light mode shows **drifting clouds**. Ends in a **curved (elliptical) divider** into the content.

### Newsletter card (`<NewsletterCard>`)
- Standard card used above the footer on several pages and in section 05 on home. Icon + title "Subscribe to the journal" + sub + email input + Subscribe button → success state. Elevated variant: toned-down shadow in light, **moonlight glow** in dark.

---

## 5. The atmospheric / interactive layer (`atmosphere.jsx`, `interactive-field.jsx`)

All decorative, all **`'use client'`**, all behind content (`z-index:0`, `pointer-events:none`) and gated on `prefers-reduced-motion` / touch.

### `<Stars>` + `<ShootingStar>` (dark mode)
- Twinkling starfield in the dark header/hero bands; occasional shooting star.

### `<InteractiveField>` — canvas, **dark mode only**
Two roles, both pointer-driven:
1. **Constellation** (in dark banner/hero bands): stars brighten and link with accent lines near the cursor. **No parallax** (field stays put). Mounted with `moteCount={0}` in headers.
2. **Margin fireflies** (`<MarginFireflies>`): warm gold motes that drift in the **side gutters only** (never behind text). Implemented as two absolutely-positioned gutter strips beside a centered content column.

Important behaviors to preserve:
- **Density-driven count:** motes derive from strip height (`moteDensity` ≈ 1 per ~220px), clamped **2–5**. So short pages (About/Contact) get fewer; spacing stays consistent.
- **Even vertical distribution:** motes are stratified into vertical bands so they don't cluster at the top.
- **Min-width gate:** if a gutter is `< 96px`, render nothing (prevents a glowing-line artifact in thin gutters).
- **Wall reflection:** motes bounce within a padded band so their glow never smears against the canvas edge.
- **Edge-fade mask:** each strip is masked to fade on its inner edge (toward content) *and* at top/bottom (under the header divider, above the footer reeds) — composited with `mask-composite: intersect`.
- **Light mode renders nothing** (the field is dark-only).

Props on `<MarginFireflies maxWidth={...} density={0.0045} maxCount={5} />` — `maxWidth` matches each page's content column (home 920, work/about/journal 1080, contact 700, post 1180).

### `<SunRays>` — **light mode only**, hero top-right
- A warm sun in the top-right corner: a glowing core + dashed golden rays fanning down-left. Rays are individual dash segments that **rotate toward the cursor** playfully on hover (no scaling/stretching), easing back when the pointer leaves.
- Rays **fade into the glow** near the core (pale/transparent close in → amber outward) so it reads as one sun.
- **Responsive:** scales down on smaller desktops; **hidden below 768px** (needs corner room). Also hidden if it would crowd hero content (appears comfortably ~≥1196px; scale below).
- **Dark mode:** hidden.

### `<Clouds>` — light mode only
- Slow-drifting cloud silhouettes in the hero/header band. **Masked** so they **dissolve as they enter the sun's top-right corner** instead of sliding behind it: a radial transparent zone anchored top-right (`radial-gradient(circle 360px at 100% 0%, transparent 0 30%, …, #000 78%)`).

---

## 6. Page specs

> For exact spacing/copy, open the matching prototype in `design-reference/`. Highlights below.

### `/` Home (`Home.html`, `home-app.jsx`)
- **Hero band** (tinted, atmospheric): eyebrow `Orlando, FL · software developer · physical therapist`; large headline with an accent phrase; sub paragraph; dark = stars/constellation, light = clouds + sun rays. Curved divider into content.
- **01 Recent writing** — list of recent posts (kept as-is; no status system).
- **02 What I'm building now** — leads with **Route Optimizer** (building); a "now" strip (project · what · when). (The standalone `/now` page was removed; nav "now" is gone — it's a home section.)
- **03 Selected work** — condensed **3-up** cards mirroring `/work`: status dot + label (building/paused/evergreen), title, clamped desc, and link affordances (see §7). "all work →" links to `/work`.
- **Get in touch** + **Newsletter** sections, then reeds footer.
- Margin fireflies (dark) at `maxWidth={920}`.

### `/journal` (`Journal.html`, `journal-app.jsx`)
- Header band, then a two-column shell (`1080px`): post **list** + sticky **rail** (topic filters, "Popular reads"). Newsletter card spans the list column above the footer. Margin fireflies wrap **both** the list and the newsletter section (not just the list).

### `/journal/[slug]` (`Blog Post.html`, `app.jsx`, `post-content.jsx`)
- **Progress bar** (fixed, top, accent, glowing) tracks scroll.
- Tinted **post header band** (title aligned above the article column), curved divider.
- **Post shell** `1180px`: article column `680px` + a right **TOC** rail (sticky; active-section highlight; reading %). Left gutter holds margin fireflies (dark).
- Content (MDX): headings (with anchor slugs feeding the TOC), paragraphs, **code blocks**, **callouts**, **figures**, **footnotes**, blockquotes, links. Bottom padding tightened (no big gap under footnotes).
- Newsletter card above footer.

### `/work` (`Work.html`, `work-app.jsx`)
- Header band (eyebrow "Selected work"), narrative **lead** paragraph (PT → software throughline).
- **Featured** project: large asymmetric card — pulsing **building** status, top accent bar, corner glow, meta side-rail. **Not a link while building**; shows "In active development" note. Route Optimizer (Next.js, Prisma, Neon, Google Maps API).
- **"Also built"** — compact, low-weight rows that recede: status chip + title + desc + stack + per-link affordances. Projects: Scribe Companion (paused), kylerlong.dev (evergreen), plus filler verosnapshots.com (photographer site). 
- Margin fireflies `maxWidth={1080}`.

### `/about` (`About.html`, `about-app.jsx`)
- Header band, then a **bento grid (layout A)** of tiles: Intro/who-I-am (big), Portrait photo, "Things I believe about craft," Fun facts/quick hits, PT→software throughline, Get in touch (GitHub + X), Where I live (Orlando). Portrait tile is slightly taller than wide. (Tweakable B/C layouts were dropped — ship A.)
- Margin fireflies `maxWidth={1080}`.

### `/contact` (`Contact.html`, `contact-app.jsx`)
- Header band ("Say hello."), then the **colophon ledger**: a card titled **contact** (mono `key → value` rows: email, location, response, then `// elsewhere` github + twitter/x). Below it, the standard **newsletter card**. GitHub → `KylerLong-dev`; X is `#` placeholder.
- Margin fireflies `maxWidth={700}` (narrow content = visible gutters).

---

## 7. Project link affordance system (shared by Home + Work)

Each project carries a `links: { type, href }[]`. Render rules:
- `type: 'case-study'` → label **"Case study"**, internal link.
- `type: 'live'` → label **"Visit"**, external (`target="_blank"`).
- Both use the **diagonal up-right arrow** that rotates to horizontal on hover.
- **0 links** → no link; show muted "In development".
- **1+ links** → render each as its own small link chip. **Only the link text is the click target** (never the whole row/card) — so a project with both a case study and a live site shows two independently-clickable chips.

Status system (dot + mono label):
- `building` → sky-blue, **pulsing** dot.
- `paused` → amber.
- `evergreen` → green.

---

## 8. Interactions & motion summary

| Element | Motion |
|---|---|
| Hamburger | 3 bars → X, ±45° rotate + mid fade, 0.32s. |
| Mobile menu | max-height + opacity + translateY slide, 0.36s; links stagger-in. |
| Theme toggle | sun⇄moon rotate+scale crossfade, ~0.5s; button press scale 0.9. |
| Building status | pulsing dot. |
| Project link arrow | diagonal → horizontal rotate on hover. |
| Constellation | stars brighten + link near cursor (dark). |
| Fireflies | drift + scatter from cursor, in gutters (dark). |
| Sun rays | dashes rotate toward cursor, ease back (light). |
| Clouds | slow drift; dissolve into sun corner (light). |
| Progress bar | width tracks scroll (post). |
| Theme switch | `background`/`color` 0.2s ease. |

All atmospheric/decorative motion must no-op under `prefers-reduced-motion: reduce` and on touch/narrow viewports.

---

## 9. Build plan (work in this order)

**Phase 0 — Scaffold.** `create-next-app` (App Router, TS, Tailwind, ESLint). Add `next-themes`, `geist`, fonts, MDX deps. Drop in `globals.css` tokens (§3) and the Tailwind theme. Wire `next-themes` `ThemeProvider` with `attribute="data-theme"` and an inline no-flash script. **Verify:** dark/light toggle flips tokens with no FOUC on reload.

**Phase 1 — Shell.** `<Nav>` (animated hamburger + theme toggle), `<Footer>`, reeds separator (`reeds-mask.png`), page header band + curved divider, the newsletter card. Root layout. **Verify:** nav animations + mobile menu + theme persistence across routes.

**Phase 2 — Static pages.** `/work`, `/about`, `/contact` with the link-affordance + status systems (§7). Pixel-match against prototypes. **Verify:** side-by-side with `design-reference/`.

**Phase 3 — Journal + MDX.** MDX pipeline (frontmatter, GFM, slug/autolink, Shiki). `/journal` index (list + rail) and `/journal/[slug]` (progress bar, sticky TOC from headings, callouts/figures/footnotes). Migrate the sample post. **Verify:** TOC tracks scroll; code highlights; footnotes link.

**Phase 4 — Home.** Compose hero + sections 01–05 reusing work/journal pieces.

**Phase 5 — Atmosphere.** Port `<InteractiveField>`/`<MarginFireflies>`, `<Stars>`/`<ShootingStar>`, `<SunRays>`, `<Clouds>` as `'use client'` canvas/DOM components with all the guardrails in §5. Add per page at the right `maxWidth`. **Verify:** dark = constellation + fireflies; light = sun rays + clouds (clouds dissolve into sun); nothing on mobile/reduced-motion; no glowing-line artifact.

**Phase 6 — Polish & ship.** Responsive sweep (mobile nav, sun hidden <768px, fireflies gated), metadata/OG, sitemap/RSS, Lighthouse, deploy to Vercel.

---

## 10. Known decisions & gotchas

- **Theme flash:** use `next-themes` (or an inline `<head>` script that sets `data-theme` from `localStorage` before paint). The prototype set it in React effects, which would flash under SSR — don't replicate that.
- **`'use client'` boundaries:** Nav, theme toggle, all atmosphere/canvas, progress bar, TOC scroll-spy, newsletter form. Keep page bodies as Server Components where possible.
- **Accent shifts by theme** (#38BDF8 dark → #0284C7 light) for contrast — keep that.
- **Placeholders to fill:** real `rss` feed, X handle (currently `#`), confirm contact email (`kyler@kylerlong.dev`), real social/case-study/live URLs in project data, the portrait photo and Orlando map on About.
- **Don't port:** the Tweaks panel, Motion Lab, Variants, Contact Options, design canvas — exploration scaffolding only.
- **`reeds-mask.png`** is included; re-export at 2x if you want crisper retina reeds.
```
