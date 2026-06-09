import { ThemeToggleTemp } from "./theme-toggle-temp";

// TEMPORARY — Phase 0 smoke test. Proves tokens flip and fonts render.
// Replaced by the real home page in Phase 4.
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-10 px-6 py-16">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
          phase 0 · scaffold
        </p>
        <h1 className="text-3xl font-semibold text-fg">
          kylerlong<span className="text-accent">.</span>dev
        </h1>
        <p className="text-muted">
          Token + theme smoke test. Toggle the theme and confirm every swatch
          and text tone flips with no flash on reload.
        </p>
        <p className="font-serif text-lg italic text-muted">
          Newsreader serif sample — used sparingly for editorial flourishes.
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Swatch className="bg-bg" label="bg" />
          <Swatch className="bg-surface" label="surface" />
          <Swatch className="bg-surface-2" label="surface-2" />
          <Swatch className="bg-accent" label="accent" />
          <Swatch className="bg-accent-soft" label="accent-soft" />
          <Swatch className="bg-border" label="border" />
        </div>

        <div className="space-y-1 border-t border-border pt-4">
          <p className="text-fg">text-fg — primary body text (Geist)</p>
          <p className="text-muted">text-muted — secondary text</p>
          <p className="text-faint">text-faint — faint / labels</p>
          <p className="font-mono text-sm text-accent">
            font-mono — Geist Mono, accent
          </p>
        </div>
      </section>

      <ThemeToggleTemp />
    </main>
  );
}

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <div
        className={`h-12 w-full rounded-md border border-border ${className}`}
      />
      <p className="font-mono text-xs text-faint">{label}</p>
    </div>
  );
}