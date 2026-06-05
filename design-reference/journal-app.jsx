/* global React, ReactDOM, Nav, Footer, Separator, NewsletterCard, Stars, ShootingStar, Clouds, CurveDivider, InteractiveField, MarginFireflies, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect */
const { useEffect } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "fontPair": "geist",
  "skyTone": "deepblue"
}/*EDITMODE-END*/;

/* ============================================
   Content
   ============================================ */
const POSTS = [
  {
    href: 'Blog Post.html',
    date: 'May 19, 2026',
    read: '8 min',
    category: 'next.js',
    title: 'Why I rewrote my markdown pipeline (again)',
    excerpt: 'Notes from a weekend spent pulling shiki out of the runtime, folding MDX compilation into the build, and learning — again — that the best optimization is the one you stop doing. Here is everything that broke and everything I would keep.',
  },
  {
    href: '#',
    date: 'Apr 28, 2026',
    read: '6 min',
    category: 'next.js',
    title: 'Compiling MDX at build time, version one',
    excerpt: 'The first attempt at moving compilation out of the request path — and the three things it got wrong that I only saw once real traffic hit it in production. A post-mortem on premature cleverness.',
  },
  {
    href: '#',
    date: 'Apr 04, 2026',
    read: '5 min',
    category: 'craft',
    title: 'What home health PT taught me about edge cases',
    excerpt: 'Patients live in the long tail. Every home is a little different, every body is a little different, and the protocol only gets you so far. The same patterns I see walking into living rooms show up in my codebase, too.',
  },
  {
    href: '#',
    date: 'Mar 16, 2026',
    read: '4 min',
    category: 'process',
    title: 'A quiet argument for boring tools',
    excerpt: 'I spent years chasing the new thing. These days I reach for whatever I already understand at 2am when something is on fire. Boring is a feature, and here is how I learned to value it.',
  },
  {
    href: '#',
    date: 'Feb 11, 2026',
    read: '7 min',
    category: 'process',
    title: 'Why I keep rewriting things I already wrote',
    excerpt: 'On the loop between dissatisfaction and craft — when the loop is healthy and sharpening the work, versus when it is just an elaborate way to avoid shipping. A field guide to telling the two apart.',
  },
  {
    href: '#',
    date: 'Jan 02, 2026',
    read: '5 min',
    category: 'next.js',
    title: 'A small note on cache lifetimes in the App Router',
    excerpt: 'Three caches, three lifetimes, and the diagram I wish someone had handed me a year ago. If you have ever been surprised by stale data in a server component, this one is for you.',
  },
];

const POPULAR = [
  { href: 'Blog Post.html', title: 'Why I rewrote my markdown pipeline (again)', meta: 'next.js · 8 min' },
  { href: '#', title: 'What home health PT taught me about edge cases', meta: 'craft · 5 min' },
  { href: '#', title: 'A small note on cache lifetimes in the App Router', meta: 'next.js · 5 min' },
  { href: '#', title: 'Why I keep rewriting things I already wrote', meta: 'process · 7 min' },
];

const CATEGORIES = ['all', 'next.js', 'craft', 'process'];

/* ============================================
   Journal list item
   ============================================ */
function JournalItem({ post }) {
  return (
    <article className="j-item">
      <div className="j-meta">
        <time>{post.date}</time>
        <span className="j-meta-dot" />
        <span className="j-cat">{post.category}</span>
        <span className="j-meta-dot" />
        <span>{post.read} read</span>
      </div>
      <h2 className="j-title">
        <a href={post.href}>{post.title}</a>
      </h2>
      <p className="j-excerpt">{post.excerpt}</p>
      <a href={post.href} className="j-readmore">
        Read more
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
    </article>
  );
}

/* ============================================
   Popular rail
   ============================================ */
function PopularRail({ activeCat, onSelectCat }) {
  return (
    <div className="j-rail">
      <div className="j-rail-block">
        <div className="j-rail-label">Browse by topic</div>
        <div className="topic-list">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`topic-chip ${c === activeCat ? 'active' : ''}`}
              onClick={() => onSelectCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="j-rail-block">
        <div className="j-rail-label">Popular reads</div>
        <ol className="popular-list">
          {POPULAR.map((p, i) => (
            <li key={i} className="popular-item">
              <span className="popular-num">{String(i + 1).padStart(2, '0')}</span>
              <a href={p.href} className="popular-body">
                <span className="popular-title">{p.title}</span>
                <span className="popular-meta">{p.meta}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ============================================
   App
   ============================================ */
function App() {
  const [tweaks, setTweak] = useTweaks({ ...TWEAK_DEFAULS, theme: savedTheme(TWEAK_DEFAULS.theme) });
  const [activeCat, setActiveCat] = React.useState('all');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    rememberTheme(tweaks.theme);
  }, [tweaks.theme]);

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

  useEffect(() => {
    const tones = {
      sky:        { top: '#E0F2FE', bot: '#BAE6FD' },
      powder:     { top: '#DBEAFE', bot: '#BFDBFE' },
      slate:      { top: '#E2E8F0', bot: '#CBD5E1' },
      ice:        { top: '#F0F9FF', bot: '#E0F2FE' },
      periwinkle: { top: '#E0E7FF', bot: '#C7D2FE' },
      deepblue:   { top: '#DBEAFE', bot: '#93C5FD' },
    };
    const t = tones[tweaks.skyTone] || tones.sky;
    document.documentElement.style.setProperty('--light-band-top', t.top);
    document.documentElement.style.setProperty('--light-band-bot', t.bot);
  }, [tweaks.skyTone]);

  const toggleTheme = () => setTweak('theme', tweaks.theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      <Nav theme={tweaks.theme} onToggleTheme={toggleTheme} active="journal" />

      <header className="j-header page-band">
        {tweaks.theme === 'dark' && <Stars />}
        {tweaks.theme === 'dark' && <InteractiveField moteCount={0} />}
        {tweaks.theme === 'dark' && <ShootingStar />}
        {tweaks.theme === 'light' && <Clouds />}
        <div className="journal-shell">
          <div className="j-header-inner">
            <div className="j-eyebrow">
              <span className="dot" />
              The journal
            </div>
            <h1 className="j-page-title">Writing on software, craft, and the long way around</h1>
            <p className="j-page-sub">
              Field notes from building things — the successes, the failures, and the
              experiences gained along the way. New entries land here first.
            </p>
          </div>
        </div>
        <CurveDivider />
      </header>

      <div style={{ position: 'relative' }}>
      {<MarginField maxWidth={1080} />}
      <main className="journal-shell journal-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div className="j-list">
          {(() => {
            const shown = activeCat === 'all' ? POSTS : POSTS.filter((p) => p.category === activeCat);
            if (shown.length === 0) {
              return <p className="j-empty">No entries in this topic yet.</p>;
            }
            return shown.map((p, i) => <JournalItem key={p.title} post={p} />);
          })()}
        </div>
        <aside className="j-rail-col">
          <PopularRail activeCat={activeCat} onSelectCat={setActiveCat} />
        </aside>
      </main>

      <section className="page-cta">
        <div className="journal-shell journal-grid journal-cta-grid">
          <div className="j-list">
            <NewsletterCard />
          </div>
          <div className="j-rail-col" aria-hidden="true"></div>
        </div>
      </section>
      </div>

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
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
