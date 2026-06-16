# Build Plan — kylerlong.dev

Working tracker for the Next.js rebuild. Phase definitions also live in `design-reference/SPEC.md §9`; this file is the **expanded description + kickoff prompts + status**. Build one phase at a time, review on the Vercel preview, then check it off before moving on.

**Stack reminder:** Next.js (App Router) · TypeScript · **Tailwind v4** (CSS `@theme` + `@custom-variant`, no `tailwind.config.js`) · `next-themes` (`attribute="data-theme"`) · MDX via **`next-mdx-remote/rsc` + `gray-matter`** · Geist + Newsreader · Vercel.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done & reviewed.

---

## [x] Phase 0 — Scaffold & foundations

**Goal:** A blank, themeable, correctly-tokened app that flips dark/light with no flash. No real UI yet — just the bedrock every later phase stands on.

**Why it matters:** Getting tokens + theming right now means every component later just uses `bg-surface` / `text-muted` and themes "for free." Getting it wrong means re-touching every file.

**Tasks**
- Install deps: `next-themes`, `geist`; MDX set (`next-mdx-remote gray-matter remark-gfm rehype-slug rehype-autolink-headings rehype-pretty-code shiki`); optional `-D @tailwindcss/typography`.
- `app/globals.css`: define the token variables under `:root` (dark defaults) and `[data-theme="light"]`; expose them via Tailwind v4 `@theme`; add the `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` so any `dark:` utilities track the attribute. (Use the v4 approach over any v3 `tailwind.config` snippet in SPEC.md.)
- Fonts: wire Geist sans + mono via the `geist` package; load `Newsreader` via `next/font/google`. Remove the leftover demo `next/font/google` Geist wiring in `layout.tsx`.
- `next-themes` `ThemeProvider` with `attribute="data-theme"`, `defaultTheme="dark"`, `suppressHydrationWarning` on `<html>`, plus the inline no-flash script so theme is set before paint.
- Clean remaining boilerplate: `layout.tsx` metadata, unused `public/*.svg` demo assets, favicon.
- Add a temporary visible theme-toggle button to prove the flip.

**Kickoff prompt**
> Phase 0 only — scaffold & foundations, no real UI. Install the deps we agreed on (next-themes, geist, and the next-mdx-remote MDX set incl. shiki). In `app/globals.css` define the design tokens from SPEC §3 as CSS variables under `:root` (dark) and `[data-theme="light"]`, expose them via Tailwind v4 `@theme`, and add the `@custom-variant dark` pointed at `[data-theme="dark"]` with `:where()` for 0 specificity. Wire Geist (sans+mono) via the geist package and Newsreader via next/font/google. Set up next-themes ThemeProvider with `attribute="data-theme"`, defaultTheme dark, suppressHydrationWarning, and an inline no-flash script. Clean the create-next-app boilerplate (layout metadata, demo SVGs, unused font wiring). Add a temporary theme-toggle button. Use your Tailwind v4 token approach over any v3 config snippets in SPEC.md. Stop when I can reload and confirm tokens flip with no flash.

**Done when**
- [x] Dark/light toggle flips all tokens; **no FOUC on hard reload**.
- [x] Geist + Newsreader render; no console/build errors (`npm run build` green).
- [x] No leftover create-next-app demo markup/assets.

---

## [x] Phase 1 — Shared shell

**Goal:** The chrome every page wears — nav, footer, header band, separators, newsletter card — as reusable components, with their signature animations.

**Why it matters:** These appear on all six routes; building them once (and well) makes Phases 2–4 mostly composition.

**Tasks**
- `<Nav>` (`'use client'`): logo (accent `.`), links (journal/work/about/contact), active state = accent. Desktop inline; **≤640px** collapses to a dropdown.
  - **Animated hamburger → X**: 3 bars, top/bottom rotate ±45° to center, middle fades; ~0.32s `cubic-bezier(0.5,0.05,0.2,1)`.
  - **Slide-down menu**: `max-height` + opacity + `translateY`, ~0.36s; links **stagger in** (delays 0.06→0.21s).
  - **Theme toggle**: sun⇄moon rotate+scale crossfade ~0.5s, press scale 0.9; driven by `next-themes` active theme.
- `<Footer>`: `© <year> Kyler Long · Orlando, FL` + links (`rss` placeholder, `github`→`github.com/KylerLong-dev`, `x` placeholder `#`), tinted band above the reeds separator.
- `<Separator variant="reeds">` using `design-reference/reeds-mask.png`; `<CurveDivider>` elliptical header divider.
- Page **header band** (`.j-header`/`.page-band`): mono eyebrow + dot, title, sub.
- `<NewsletterCard>`: icon, "Subscribe to the journal", sub, email input + button → success state; elevated shadow (toned in light, moonlight glow in dark).
- Root `layout.tsx` composes Nav + page slot + Footer.
- All motion respects `prefers-reduced-motion`.

**Kickoff prompt**
> Phase 1 only — the shared shell. Build `<Nav>` (logo, links with active=accent, animated hamburger→X, slide-down mobile menu with staggered links, animated sun⇄moon theme toggle), `<Footer>` (reeds separator via design-reference/reeds-mask.png, footer links), the page header band + `<CurveDivider>`, and `<NewsletterCard>`. Match design-reference/components.jsx and styles.css exactly (open them for precise values). Mark interactive pieces `'use client'`; gate all motion on prefers-reduced-motion. Wire them into the root layout. Stop so I can review the nav animations, mobile menu, and theme persistence across routes.

**Done when**
- [x] Hamburger morphs to X; mobile menu slides + staggers; theme toggle animates.
- [x] Footer reeds render correctly in both themes; links point to the right places.
- [x] Reduced-motion disables the decorative transitions.

---

## [x] Phase 2 — Static pages (/work, /about, /contact)

**Goal:** The three content-light pages, pixel-matched, plus the shared **project link + status systems** they (and Home) rely on.

**Why it matters:** Establishes the project-data shape and the link-affordance rules before Home reuses them.

**Tasks**
- Shared **status system**: dot + mono label — `building` (sky, pulsing), `paused` (amber), `evergreen` (green).
- Shared **link-affordance** (SPEC §7): `links[]`; `case-study`→"Case study" (internal), `live`→"Visit" (external new-tab), diagonal arrow rotates flat on hover; **0 links** → muted "In development"; **only the link text is clickable** (never the whole row), so multi-link projects render independent chips.
- `/work`: eyebrow, narrative **lead** (PT→software), **featured** project (large asymmetric card — pulsing building status, top accent bar, corner glow, meta side-rail, NOT a link while building → "In active development"), then **"Also built"** recessive rows (Scribe Companion paused, kylerlong.dev evergreen, verosnapshots.com filler).
- `/about`: bento **layout A** tiles — Intro (big), Portrait (slightly tall), craft beliefs, fun facts, PT→software throughline, get-in-touch (GitHub + X), Orlando. Use an image placeholder for portrait/map.
- `/contact`: **colophon ledger** card titled "contact" (mono key→value: email, location, response; `// elsewhere` github + twitter/x) + the newsletter card below. GitHub→KylerLong-dev, X `#`.
- No atmosphere layers yet.

**Kickoff prompt**
> Phase 2 only — /work, /about, /contact. First implement the shared status system (building=sky pulsing, paused=amber, evergreen=green) and the link-affordance system from SPEC §7 (only link text is clickable; "Case study" internal / "Visit" external chips with the diagonal→flat arrow; 0 links shows "In development"). Then build the three pages to pixel-match design-reference/Work.html, About.html, Contact.html (open them + styles.css for exact values). About = bento layout A with image placeholders. Contact = colophon ledger + newsletter card. No fireflies/sun/clouds yet. Stop for side-by-side review against the prototypes.

**Done when**
- [x] Status + link systems match spec (multi-link = separate text targets).
- [x] All three pages match prototypes in both themes; responsive down to mobile.

---

## [x] Phase 3 — Journal + MDX

**Goal:** The content engine — MDX pipeline, the journal index, and the full article template.

**Why it matters:** This is the most logic-heavy phase (parsing, TOC, scroll-spy, highlighting). Isolating it keeps it reviewable.

**Tasks**
- MDX via `next-mdx-remote/rsc` + `gray-matter`: posts as `content/journal/*.mdx` with frontmatter `{ title, slug, date, excerpt, tags, category }`.
- Plugins: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code` (Shiki theme aligned to site palette). Map MDX elements to styled components (headings, code, callouts, figures, footnotes, blockquotes, links).
- `/journal` index: list + sticky rail (topic filters, "Popular reads"); newsletter card spanning the list column above footer.
- `/journal/[slug]`: fixed **progress bar** (accent, glowing) tracking scroll; tinted post header band + curve divider; post shell (`1180px`) = article col `680px` + sticky **TOC** rail built from headings, active-section highlight + reading %.
- Migrate the sample post from `design-reference/Blog Post.html` + `post-content.jsx` into `.mdx`.
- Tightened bottom padding (no big gap under footnotes).

**Kickoff prompt**
> Phase 3 only — Journal + MDX. Set up next-mdx-remote/rsc + gray-matter with remark-gfm, rehype-slug, rehype-autolink-headings, and rehype-pretty-code (Shiki theme matching our palette). Posts live in content/journal/*.mdx with frontmatter {title, slug, date, excerpt, tags, category}. Build /journal (list + sticky filter/popular rail + newsletter) and /journal/[slug] (fixed scroll progress bar, tinted header band, 1180px shell with 680px article column + sticky TOC from headings with active-section highlight and reading %). Map MDX elements (code, callouts, figures, footnotes) to styled components per design-reference/post-content.jsx. Migrate the sample post from design-reference/Blog Post.html into an .mdx file. Stop — I'll verify TOC scroll-spy, code highlighting, and footnote links.

**Done when**
- [x] A `.mdx` post renders with highlighted code, callouts, figures, working footnotes.
- [x] TOC tracks the active section + reading %; progress bar tracks scroll.
- [x] `/journal` index lists posts from frontmatter; filters work.

---

## [x] Phase 4 — Home

**Goal:** Compose the landing page from pieces built in Phases 1–3.

**Why it matters:** Home is mostly assembly + the hero; doing it after work/journal means the cards and lists already exist.

**Tasks**
- **Hero band** (tinted, atmospheric-ready): eyebrow (Orlando · developer · PT), headline w/ accent phrase, sub; curve divider.
- **01 Recent writing** — recent posts list (no status system here).
- **02 What I'm building now** — leads with Route Optimizer (building) + the "now" strip (project · what · when). No `/now` page.
- **03 Selected work** — condensed **3-up** cards reusing the /work card + link/status systems; "all work →" → `/work`.
- **Get in touch** + **Newsletter** sections, then reeds footer.
- No atmosphere yet (added in Phase 5).

**Kickoff prompt**
> Phase 4 only — Home. Build `/` to match design-reference/Home.html + home-app.jsx: hero band (eyebrow, accent headline, sub, curve divider), 01 Recent writing list, 02 "What I'm building now" (leads with Route Optimizer + now-strip), 03 Selected work as condensed 3-up cards reusing the /work card + link/status systems with "all work →" linking to /work, then Get in touch + Newsletter and the reeds footer. Reuse existing components; no fireflies/sun/clouds yet. Stop for review.

**Done when**
- [x] All five sections match the prototype; selected-work cards reuse the shared system.
- [x] Responsive; both themes correct.

---

## [x] Phase 5 — Atmosphere & interaction

**Goal:** The signature decorative layer — themed, performant, accessible, behind content.

**Why it matters:** Highest-risk-for-jank phase; doing it last means a complete, reviewable site underneath. All `'use client'`, all `aria-hidden`, all `pointer-events:none`, behind content (`z-index:0`).

**Tasks**
- `<Stars>` + `<ShootingStar>` (dark header/hero bands).
- `<InteractiveField>` **constellation** (dark bands; stars brighten + link near cursor; no parallax; mounted `moteCount={0}` in headers).
- `<MarginFireflies>` (dark, gutter-only): density-driven count (~1/220px) **clamped 2–5**, even vertical distribution, **96px min-gutter gate** (skip thin gutters → no glowing-line artifact), **wall reflection** (glow never smears the edge), **edge-fade mask** on inner + top + bottom (composite `intersect`). Per page `maxWidth`: home 920, work/about/journal 1080, contact 700, post 1180. Journal wraps both list **and** newsletter.
- `<SunRays>` (light, hero top-right): glowing core + dashed rays fanning down-left, **rotate toward cursor** (no stretch), fade into the glow near core; scales down on smaller desktops, **hidden <768px** / dark mode.
- `<Clouds>` (light): slow drift, **dissolve into the sun corner** via top-right radial mask.
- Everything no-ops under `prefers-reduced-motion`/touch and renders nothing in the wrong theme.

**Kickoff prompt**
> Phase 5 only — atmosphere. Port as 'use client' components matching design-reference/atmosphere.jsx + interactive-field.jsx: Stars/ShootingStar and InteractiveField constellation (dark headers, moteCount 0), MarginFireflies (dark, gutters only — density-driven count clamped 2–5, even vertical distribution, 96px min-gutter gate, wall reflection, inner+top+bottom edge-fade mask with composite intersect), SunRays (light, hero top-right, dashes rotate toward cursor, fade into glow, hidden <768px and in dark), and Clouds (light, dissolve into the sun corner via radial mask). Mount per page at the right maxWidth (home 920, work/about/journal 1080, contact 700, post 1180); journal wraps list + newsletter. All decorative layers aria-hidden, pointer-events none, behind content, and no-op under reduced-motion/touch and in the wrong theme. Stop for review.

**Done when**
- [x] Dark: constellation in headers + fireflies in gutters; no glowing-line artifact at any width.
- [x] Light: sun rays (hover-reactive, hidden <768px) + clouds dissolving into the sun.
- [x] Nothing renders on mobile/touch/reduced-motion or in the opposite theme; no perf jank.

---

## [~] Phase 6 — Polish & ship

**Goal:** Production-ready — responsive, discoverable, fast, deployed.

**Tasks**
- Responsive sweep: mobile nav, sun hidden <768px, fireflies gated, tap targets ≥44px, no horizontal overflow anywhere.
- Per-route metadata + OpenGraph/Twitter images; `app/sitemap.ts`; **RSS feed** for the journal; favicon/app icons.
- Accessibility pass: focus states, skip-to-content, color contrast, `aria` on decorative layers.
- Lighthouse (perf + a11y) on the Vercel preview; fix regressions.
- Confirm every placeholder is filled or tracked: RSS, X handle, contact email, real project/case-study/live URLs, portrait photo, Orlando map.
- Production deploy on Vercel.

**Kickoff prompt**
> Phase 6 — polish & ship. Do a full responsive sweep (mobile nav, sun hidden <768px, fireflies gated, ≥44px targets, no overflow). Add per-route metadata + OG/Twitter images, app/sitemap.ts, an RSS feed for the journal, and favicons. Accessibility pass (focus states, skip link, contrast, aria on decorative layers). Run Lighthouse against the Vercel preview and fix regressions. List every remaining placeholder from CLAUDE.md so I can fill them. Then prep the production Vercel deploy.

**Done when**
- [~] Clean on real mobile + desktop; Lighthouse a11y/perf solid. *(Responsive/overflow + a11y done & reviewed; Lighthouse pass is Kyler's step on the preview.)*
- [x] Metadata/OG/sitemap/RSS present; placeholders filled or tracked.
- [ ] Production deploy live on Vercel. *(Kyler's step.)*

---

## Notes / decisions log
- Tailwind **v4** confirmed → token approach via `@theme` + `@custom-variant` (not v3 `darkMode` config).
- MDX → **Option B** (`next-mdx-remote/rsc` + `gray-matter`) to avoid Turbopack's string-only plugin limit and to build the index from frontmatter.
- `shiki` installed explicitly (peer of `rehype-pretty-code`).
- **Phase 0 done (2026-06-09).** Color tokens mapped via `@theme inline` so utilities emit live `var(--…)` and re-resolve on the `[data-theme]` flip (plain `@theme` would freeze the dark value); fonts via plain `@theme` so the real `--font-*` vars stay referenceable in base CSS.
- No-flash: rely on **next-themes' built-in pre-paint script** (no hand-rolled inline script); `suppressHydrationWarning` on `<html>`.
- Omitted `disableTransitionOnChange` on purpose — keeps the body's 0.2s background/color transition on theme switch.
- MDX deps installed in Phase 0 but **not wired until Phase 3**.
- Temporary `app/page.tsx` + `app/theme-toggle-temp.tsx` smoke test — **delete both when the Phase 1 Nav toggle lands.**
- npm-audit: 3 moderate vulns are a transitive `postcss` inside Next's own bundle; only fix bumps Next to a preview/canary (breaking) → left as-is.
- **Phase 1 done (2026-06-09).** Chrome CSS ported **verbatim** from `styles.css` into a sectioned block in `app/globals.css` (plain CSS, not utilities) so the burger/menu-stagger/icon-crossfade timings stay exact. Components live in `app/components/`.
- Light sky/band tone fixed to **"deepblue"** (`--light-band-top:#DBEAFE`, `--light-band-bot:#93C5FD`) + `--curve-line` per theme. The light-mode footer band + reeds use `--light-band-top` (the `[data-theme="light"]` overrides were initially missed → footer looked too light; fixed).
- **Hydration gotcha:** theme-dependent classNames on SSR'd elements need a client-only guard — next-themes reads `localStorage` synchronously so `resolvedTheme` differs from the server on first render. Used a `useSyncExternalStore`-based `useIsClient`, NOT `useEffect`+`setState` (`react-hooks/set-state-in-effect` is **error-level** in eslint-config-next@16).
- Added stub routes `/journal /work /about /contact` (real header text) so nav/active/theme-persistence are reviewable; fleshed out in Phases 2–4. Deleted the temp Phase-0 toggle + smoke-test page.
- Home **hero eyebrow dot pulse** (`.hero-eyebrow .dot` + `pulse 2s`) deferred to Phase 4 — today's home eyebrow uses the static-glow `.j-eyebrow` placeholder.
- **Phase 2 done (2026-06-09).** Shared systems in `app/lib/projects.ts` (types + data + `linkMeta`/`projectLinks`), `app/components/status.tsx`, `app/components/cta-link.tsx` — reused by Home in Phase 4. Pages are Server Components; CSS ported verbatim into a Phase-2 block in `globals.css`.
- Included a **4th project status `planned`** (purple `#A78BFA`) for the verosnapshots filler — beyond the original 3-status shape; `ProjectStatus` type updated.
- **Deviations from prototype (Kyler's calls):** the contact ledger `.ledger-head .dot` now **pulses** (`bentoPulse`, gated under reduced-motion) like the work/about dots; the content indicator dots are **unified to 8px** (work status 8 unchanged, about pin 7→8, ledger 9→8). Header eyebrow dots (6px) + map marker (12px) left distinct.
- Lint: literal `// elsewhere` JSX text must be `{"// elsewhere"}` (`react/jsx-no-comment-textnodes`).
- **Phase 3 done (2026-06-11).** Content in `content/journal/*.mdx` — 1 migrated sample post + **5 placeholder stubs** (Kyler's call, so filters/popular rail are reviewable). Data layer `app/lib/posts.ts`: gray-matter index, ~200wpm computed read time (sample shows 5 min vs prototype's hardcoded 8), `extractHeadings` slugs via `github-slugger` for exact id parity with `rehype-slug`.
- Code highlighting: **custom Shiki dual-theme pair** (`app/lib/shiki-themes.ts`) built from the prototype `.tok-*` palette; rehype-pretty-code wants `ThemeRegistrationRaw` (not `ThemeRegistration` — `settings` must be required). Tokens emit `--shiki-dark/--shiki-light` vars flipped on `[data-theme]` in CSS — no re-highlight on theme switch. Line-number gutter rebuilt with CSS counters on `[data-line]::before` (`line-height: 22.95px` keeps the divider rule continuous); prototype's separate gutter column doesn't survive rehype markup.
- **Deviations from prototype (Kyler's calls):** post topbar eyebrow shows the **category** (frontmatter has no series field; no "part x of y"); footnote refs/items got `scroll-margin-top` so smooth-scroll clears the sticky nav.
- **MDX gotcha (caused a hydration error):** loose text inside JSX blocks gets wrapped in `<p>` by MDX — never write literal `<p>` inside `<blockquote>`/components in `.mdx` (yields `<p><p>`). Footnote `<li>` text also p-wraps → scoped `.footnotes li p` CSS keeps it 14px.
- Scroll state (progress bar + TOC %/active) via shared `useSyncExternalStore` hook (`use-scroll-progress.ts`) — same eslint constraint as Phase 1.
- Added `design-reference/**` to eslint `globalIgnores` — prototypes were flooding `npm run lint` with 154 pre-existing errors; app code lints clean.
- **Local-dev gotcha:** Turbopack's persistent dev cache served stale `globals.css` (missing the whole Phase 3 block) even after recompile — devtools badge showed "(stale)". Fix: stop dev, `rm -rf .next`, restart. Prod builds unaffected.
- **Phase 4 done (2026-06-13).** Home is `app/page.tsx` (Server Component) + a Phase-4 block ported into `globals.css`. Reused `getAllPosts`/`toPostMeta` (5 latest posts), `ARCHIVE` + `Status`/`CtaLink`/`projectLinks` for the 3-up selected-work cards, and `NewsletterCard`/`CurveDivider`. Build + lint green; `/` prerenders static.
- **Deviation (Kyler's call) — REVERSED in Phase 5:** Phase 4 shipped the hero with the `CurveDivider`; in Phase 5 Kyler switched the home hero to the **reeds horizon** (both themes) to bookend the footer reeds. Interior/post bands keep the curve. See the Phase 5 notes.
- Activated the **`.hero-eyebrow .dot` pulse** deferred in Phase 1 (`@keyframes pulse`, opacity) plus the now-strip green `.live` dot; both added to the `prefers-reduced-motion` no-op list per our motion convention.
- Placeholder flagged: now-strip "reading … **May**" copy carried verbatim from the prototype (reads stale in June) — left as a conscious choice pending real "now" copy.
- **Phase 5 done (2026-06-13).** Atmosphere in `app/components/atmosphere/`: `stars`/`clouds` (server — deterministic seeded / static SVG), `shooting-star`/`sun-rays`/`interactive-field` (client), `sky` (band wrapper), `margin-field` (gutter fireflies), `use-atmosphere` (gate). Built + reviewed in 2 segments (sky layers, then canvas fields).
- **Theme gating via CSS + runtime `data-theme`** (render both sets, hide the wrong one) — no SSR theme guess, no FOUC. The canvas field reads `data-theme` live + MutationObserver to re-skin on toggle.
- **Mounting:** `<Sky>` in every band (PageHeader → work/about/contact/journal, home hero with `sun`, post header), field mounted `moteCount={0}` so **bands carry only the constellation, never fireflies**. `<MarginField>` wraps each page's main content in a `.atmo-wrap`/`.atmo-content` relative container — home 920, work/about/journal 1080, contact 700, post 1180; journal wraps list **and** newsletter.
- **Gating (final, Kyler's call):** stars / shooting star / clouds stay on at **every screen size incl. touch** — only `prefers-reduced-motion` drops them (our one motion exception; the shooting-star timer self-gates on reduce too). The **sun** is light-mode only, scales down on smaller desktops (`scale .82` ≤1196px, `.66` ≤1000px) and hides `<768px`. The cursor-reactive **canvas fields** (band constellation + gutter fireflies) stay off on coarse pointers / reduced-motion via `useAtmosphere()` (`useSyncExternalStore`, false on SSR → mount post-hydration) — no hover on touch + collapsed gutters means no payoff, so not worth the rAF battery cost. (This relaxes the earlier "nothing renders on touch" done-criterion for the CSS sky layers.)
- **Hydration safety:** SunRays + Stars geometry is seeded/deterministic, and SunRays' initial inline-style floats use `toFixed(2)` — SSR and client emit identical strings.
- **Reeds hero (Kyler's call, overrides SPEC §197 which specced a curve):** home hero ends in the reeds horizon both themes (`.separator.hero-bottom`; dark = `--bg`, light = `#FFFFFF`), `.hero-band.has-reeds .hero` gets 170px bottom clearance. Home star field tuned: `spread` 90% (reach the divider on every band) + `count` 75 (denser over the taller hero).
- **Turbopack stale-CSS dev cache** bit us repeatedly (e.g. the `.atmo-wrap` rule not going live → the absolute `MarginField` escaped to the viewport and fireflies landed over the hero). Fix is always `rm -rf .next` + restart `npm run dev`; production builds are unaffected.
- **Phase 6 in progress (2026-06-16)** — built in 5 reviewable segments; production deploy + Lighthouse remain Kyler's steps on Vercel.
- **A11y:** skip-to-content link → focusable `#main-content` wrapper (each page keeps its own single `<main>`, so no duplicate landmark); global `:focus-visible` ring scoped via `:where()` (0 specificity so component styles like `.nl-input` still win); collapsed mobile menu now drops out of the tab order via a one-way-delayed `visibility` transition. Confirmed all decorative layers already `aria-hidden`.
- **Metadata:** `metadataBase = https://kylerlong.dev`; shared `pageMetadata()` helper in `app/lib/site.ts` (title/description/canonical + OG/Twitter) for the interior pages; posts get `og:type=article` (+ published time/author/tags); `app/sitemap.ts` + `app/robots.ts`.
- **OG images:** dynamic `next/og` via shared `app/lib/og.tsx` `ogImage()` — loads Geist TTFs from the installed `geist` package; root card + per-post card (title · category · date), `twitter-image` files re-export the OG ones; generated `app/icon.tsx` + `app/apple-icon.tsx` (lowercase `k.` mark, kept the default `favicon.ico` as fallback). All statically generated at build (rasterized + eyeballed both cards). *(Favicon art is a placeholder Kyler will revisit later.)*
- **RSS:** `app/feed.xml/route.ts` (`export const dynamic = "force-static"`) → RSS 2.0 from `getAllPosts`; footer `rss` link wired; `<link rel="alternate" application/rss+xml>` autodiscovery on every route via `alternates.types`.
- **Orlando map (Kyler's call — reversed from the planned SVG):** NOT a hand-drawn SVG. Real **OpenStreetMap `export/embed.html` iframe** (no API key, no new dep), zoomed-out `bbox=-92,22,-76,33` with a marker on Orlando (city-level, no exact address); dark mode tints the light tiles via `filter: invert/hue-rotate`; frosted "Orlando, FL" label chip; lat/long line dropped.
- **Copy:** home now-strip "reading … **May**" → "now" (was the flagged stale placeholder).
- **Still-open placeholders (tracked, not invented):** blog email (`kyler@kylerlong.dev` to be created), X handle (`#`), About portrait photo, real project case-study/live URLs.
- (add entries here as you go)