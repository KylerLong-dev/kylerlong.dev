# kylerlong.dev

Personal site + journal for Kyler Long — software developer & home-health
physical therapist, Orlando FL.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 (CSS-first
tokens, `data-theme` dark/light) · MDX via `next-mdx-remote/rsc` +
`gray-matter` · Geist + Newsreader · Vercel.

```bash
npm run dev     # local dev (http://localhost:3000)
npm run build   # production build
npm run lint    # eslint
```

> Dev server showing stale styles or weird errors? Stop it, `rm -rf .next`,
> and restart — Turbopack's persistent dev cache occasionally goes stale.

---

## Writing journal posts

All posts live in **`content/journal/`** — one `.mdx` file per post. To
create a post, add a file there (filename should match the slug, e.g.
`my-new-post.mdx`); to edit, edit the file. There is no registry to update —
the index, topic filters, and post pages all derive from this folder at
build time.

### Frontmatter (required)

```yaml
---
title: "My new post"
slug: "my-new-post"
date: "2026-07-01"
excerpt: "One or two sentences — shows on the journal index and as the post header description."
tags: ["next.js", "whatever"]
category: "next.js"
---
```

Keep the `date` quoted (`"YYYY-MM-DD"`).

### What happens automatically

- **Index listing + sorting** — newest date first.
- **Topic filter chips** — derived from each post's `category`; a new
  category value creates a new chip on its own.
- **Read time** — computed from word count (~200 wpm).
- **Table of contents** — built from `##` and `###` headings; scroll-spy
  and anchor links just work.

### What's manual

- **"Popular reads" rail** — a curated list, not automatic. Edit the
  `POPULAR_SLUGS` array at the top of `app/lib/posts.ts` to feature
  different posts.

### Post body

Plain Markdown (GFM), plus these components — see
`content/journal/why-i-rewrote-my-markdown-pipeline-again.mdx` for a post
that demonstrates everything:

| Component | Use |
|---|---|
| `<Callout type="note\|warn\|tip" title="...">` | Tinted aside box |
| `<Figure caption="...">` | Framed 16:9 figure with caption |
| `<Tweet name="..." handle="..." date="...">` | Static tweet embed |
| `<FN n={1} />` | Footnote reference, pairs with the footnotes section |

Code fences take a filename title and line highlights:

````
```tsx title="app/page.tsx" {2-3}
```
````

Footnotes are a manual `<section className="footnotes">` at the end of the
post with `id="fn-N"` items and `#fn-ref-N` backrefs — copy the pattern from
the sample post.

### Gotchas

- **Never write literal `<p>` tags inside JSX blocks in `.mdx`.** MDX wraps
  loose text in paragraphs itself, so a hand-written `<p>` nests
  (`<p><p>`) and causes a React hydration error. Just write the text.
- The five "Placeholder entry" stub posts are seed data for the build-out —
  replace or delete them before launch.

---

## Project docs

- `CLAUDE.md` — persistent context + conventions (stack rules, tokens,
  data shapes).
- `BUILD_PLAN.md` — phase tracker + decisions log.
- `design-reference/` — high-fidelity HTML/JSX/CSS prototypes (the design
  source of truth; reference only, not shipped code).
- `design-reference/SPEC.md` — architecture spec.