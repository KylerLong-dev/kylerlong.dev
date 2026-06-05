/* global React, ReactDOM, Nav, ProgressBar, TOC, Footer, PostContent, CurveDivider, Stars, ShootingStar, Clouds, Separator, NewsletterCard, InteractiveField, MarginFireflies,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect */

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "fontPair": "geist",
  "tocStyle": "rail",
  "showProgress": true,
  "showSeries": true
}/*EDITMODE-END*/;

const TOC_ITEMS = [
  { id: 'the-old-setup', label: 'The old setup', level: 2 },
  { id: 'what-i-changed', label: 'What I changed', level: 2 },
  { id: 'a-hiccup-with-shiki', label: 'A hiccup with shiki', level: 2 },
  { id: 'caching-the-highlighter', label: 'Caching the highlighter', level: 3 },
  { id: 'whats-left', label: "What's left to do", level: 2 },
  { id: 'signing-off', label: 'Signing off', level: 2 },
];

const RELATED = [
  { date: 'Apr 28, 2026', title: 'Compiling MDX at build time, version one', category: 'next.js' },
  { date: 'Feb 11, 2026', title: 'Why I keep rewriting things I already wrote', category: 'process' },
  { date: 'Jan 02, 2026', title: 'A small note on cache lifetimes in the App Router', category: 'next.js' },
];

function App() {
  const [tweaks, setTweak] = useTweaks({ ...TWEAK_DEFAULS, theme: savedTheme(TWEAK_DEFAULS.theme) });
  const [activeId, setActiveId] = useState(TOC_ITEMS[0].id);
  const [pct, setPct] = useState(0);

  // Sync theme to <html data-theme>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    rememberTheme(tweaks.theme);
  }, [tweaks.theme]);

  // Sync font choice
  useEffect(() => {
    const map = {
      geist: { sans: "'Geist', ui-sans-serif, system-ui, sans-serif", mono: "'Geist Mono', ui-monospace, monospace" },
      plex:  { sans: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif", mono: "'IBM Plex Mono', ui-monospace, monospace" },
      inter: { sans: "'Inter', ui-sans-serif, system-ui, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace" },
    };
    const f = map[tweaks.fontPair] || map.geist;
    document.documentElement.style.setProperty('--font-sans', f.sans);
    document.documentElement.style.setProperty('--font-mono', f.mono);
  }, [tweaks.fontPair]);

  // Match the site's default light-mode band tone (deep blue)
  useEffect(() => {
    document.documentElement.style.setProperty('--light-band-top', '#DBEAFE');
    document.documentElement.style.setProperty('--light-band-bot', '#93C5FD');
  }, []);

  // Scrollspy for TOC + progress bar
  useEffect(() => {
    const headings = TOC_ITEMS
      .map(it => document.getElementById(it.id))
      .filter(Boolean);

    const onScroll = () => {
      // progress
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0;
      setPct(p);

      // active heading: last one whose top is past 120px from viewport top
      const offset = 120;
      let current = headings[0]?.id;
      for (const el of headings) {
        const r = el.getBoundingClientRect();
        if (r.top - offset <= 0) current = el.id;
        else break;
      }
      if (current) setActiveId(current);

      // toggle .active class on the live heading (for the bullet dot)
      headings.forEach(el => {
        el.classList.toggle('active', el.id === current);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const toggleTheme = () => setTweak('theme', tweaks.theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      {tweaks.showProgress && (
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      )}
      <Nav theme={tweaks.theme} onToggleTheme={toggleTheme} />

      <header className="page-band post-band">
        {tweaks.theme === 'dark' && <Stars />}
        {tweaks.theme === 'dark' && <InteractiveField moteCount={0} />}
        {tweaks.theme === 'dark' && <ShootingStar />}
        {tweaks.theme === 'light' && <Clouds />}
        <div className="post-band-grid">
          <div className="post-band-col">
            <h1 className="post-title">
              Why I rewrote my markdown pipeline (again)
            </h1>
            <p className="post-description">
              Notes from a weekend spent pulling shiki out of the runtime,
              folding MDX compilation into the build, and learning — again —
              that the best optimization is the one you stop doing.
            </p>
            <div className="post-meta">
              <span className="author">
                <span className="avatar">KL</span>
                Kyler Long
              </span>
              <span className="meta-sep" />
              <time dateTime="2026-05-19">May 19, 2026</time>
            </div>
          </div>
        </div>
        <CurveDivider />
      </header>

      <div style={{ position: 'relative' }}>
      {<MarginField maxWidth={1180} />}
      <div className="post-shell" style={{ position: 'relative', zIndex: 1 }}>
        <main className="post-main">
          <div className="post-topbar">
            <a href="Journal.html" className="back-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              back to journal
            </a>
            <div className="post-eyebrow">
              {tweaks.showSeries && (
                <>
                  <a href="#" className="series-tag">notes from the pipeline</a>
                  <span className="sep">·</span>
                </>
              )}
              <span>part 3 of 4</span>
            </div>
          </div>
          <PostContent />
        </main>

        <aside className="post-rail-right">
          <TOC items={TOC_ITEMS} activeId={activeId} pct={pct} />
        </aside>
      </div>
      </div>

      <section className="page-cta">
        <div className="post-shell post-cta-shell">
          <div className="post-main" style={{ padding: 0 }}>
            <NewsletterCard />
          </div>
          <div className="post-rail-right" aria-hidden="true"></div>
        </div>
      </section>

      <section className="footer-band tinted has-reeds">
        <Separator variant="reeds" position="footer-top" />
        <Footer />
      </section>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakRadio
            label="Mode"
            value={tweaks.theme}
            onChange={(v) => setTweak('theme', v)}
            options={[
              { value: 'dark',  label: 'Dark'  },
              { value: 'light', label: 'Light' },
            ]}
          />
        </TweakSection>

        <TweakSection title="Type">
          <TweakSelect
            label="Font pair"
            value={tweaks.fontPair}
            onChange={(v) => setTweak('fontPair', v)}
            options={[
              { value: 'geist', label: 'Geist + Geist Mono' },
              { value: 'plex',  label: 'IBM Plex Sans + Mono' },
              { value: 'inter', label: 'Inter + JetBrains Mono' },
            ]}
          />
        </TweakSection>

        <TweakSection title="Reading aids">
          <TweakToggle
            label="Progress bar"
            value={tweaks.showProgress}
            onChange={(v) => setTweak('showProgress', v)}
          />
          <TweakToggle
            label="Series eyebrow"
            value={tweaks.showSeries}
            onChange={(v) => setTweak('showSeries', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
