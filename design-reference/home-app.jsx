/* global React, ReactDOM, Nav, Footer, Stars, ShootingStar, Clouds, SunRays, Separator, InteractiveField, MarginFireflies, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect */
const { useEffect, useMemo } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "fontPair": "geist",
  "separator": "reeds",
  "stars": true,
  "skyTone": "deepblue"
}/*EDITMODE-END*/;

/* ============================================
   Newsletter signup — card
   ============================================ */
function Newsletter() {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <div className="nl nl-card">
      <div className="nl-card-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>
      <div className="nl-card-body">
        <div className="nl-card-title">Subscribe to the journal</div>
        <div className="nl-card-sub">
          New posts on software, craft, and the occasional detour — straight to your inbox. No more than a couple times a month.
        </div>
        {done ? (
          <div className="nl-done">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            You're on the list — thanks for reading.
          </div>
        ) : (
          <form className="nl-card-form" onSubmit={submit}>
            <input
              type="email"
              className="nl-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="nl-btn">Subscribe</button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ============================================
   Content
   ============================================ */
const WRITING = [
  {
    href: 'Blog Post.html',
    date: 'May 19, 2026',
    title: 'Why I rewrote my markdown pipeline (again)',
    excerpt: 'Notes from a weekend spent pulling shiki out of the runtime and folding MDX compilation into the build.',
    category: 'next.js',
  },
  {
    href: '#',
    date: 'Apr 28, 2026',
    title: 'Compiling MDX at build time, version one',
    excerpt: 'The first attempt — and the three things it got wrong that I only saw in production.',
    category: 'next.js',
  },
  {
    href: '#',
    date: 'Apr 04, 2026',
    title: 'What home health PT taught me about edge cases',
    excerpt: 'Patients live in the long tail. The patterns I see in their homes show up in my codebase, too.',
    category: 'craft',
  },
  {
    href: '#',
    date: 'Feb 11, 2026',
    title: 'Why I keep rewriting things I already wrote',
    excerpt: 'On the loop between dissatisfaction and craft, and when the loop is healthy versus when it is procrastination.',
    category: 'process',
  },
  {
    href: '#',
    date: 'Jan 02, 2026',
    title: 'A small note on cache lifetimes in the App Router',
    excerpt: 'Three caches, three lifetimes, and the diagram I wish someone had handed me a year ago.',
    category: 'next.js',
  },
];

const NOW_ITEMS = [
  { project: 'Route Optimizer', what: 'Wiring up live traffic and appointment windows so a day of home-health visits plans its own fastest loop.', when: 'building' },
  { project: 'journal', what: 'Drafting a new piece on what home-health PT taught me about edge cases.', when: 'this month' },
  { project: 'reading', what: 'Designing Data-Intensive Applications — finally — and Annie Dillard, The Writing Life.', when: 'May' },
];

const WORK = [
  {
    status: 'paused',
    statusLabel: 'Paused',
    title: 'Scribe Companion',
    desc: 'An AI scribe that turns a dictated visit into a structured SOAP note, tuned for the language of rehab.',
    links: [{ type: 'case-study', href: 'Work.html' }],
  },
  {
    status: 'evergreen',
    statusLabel: 'Evergreen',
    title: 'kylerlong.dev',
    desc: 'This site — journal, work, and the occasional long-form detour.',
    links: [{ type: 'case-study', href: 'Work.html' }, { type: 'live', href: 'Home.html' }],
  },
  {
    status: 'planned',
    statusLabel: 'Planned',
    title: 'verosnapshots.com',
    desc: 'A portfolio and booking site for a Florida-based photographer — galleries, session packages, and inquiries in one place.',
    links: [],
  },
];

/* Link affordances — mirror the work page (case study / live visit). */
function linkMeta(link) {
  switch (link.type) {
    case 'case-study': return { label: 'Case study', external: false, href: link.href };
    case 'live':       return { label: 'Visit', external: true, href: link.href };
    default:           return null;
  }
}
function WorkLink({ meta }) {
  return (
    <a className="arch-link" href={meta.href} {...(meta.external ? { target: '_blank', rel: 'noopener' } : {})}>
      {meta.label}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"/>
        <polyline points="7 7 17 7 17 17"/>
      </svg>
    </a>
  );
}

/* ============================================
   App
   ============================================ */
function App() {
  const [tweaks, setTweak] = useTweaks({ ...TWEAK_DEFAULS, theme: savedTheme(TWEAK_DEFAULS.theme) });

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

  // Sync light-mode sky tone (drives hero gradient, footer band, nav background)
  React.useEffect(() => {
    const tones = {
      sky:        { top: '#E0F2FE', bot: '#BAE6FD', solid: '#BAE6FD' }, // bright sky blue
      powder:     { top: '#DBEAFE', bot: '#BFDBFE', solid: '#BFDBFE' }, // soft powder blue
      slate:      { top: '#E2E8F0', bot: '#CBD5E1', solid: '#CBD5E1' }, // neutral slate
      ice:        { top: '#F0F9FF', bot: '#E0F2FE', solid: '#E0F2FE' }, // very pale ice
      periwinkle: { top: '#E0E7FF', bot: '#C7D2FE', solid: '#C7D2FE' }, // blue-purple
      deepblue:   { top: '#DBEAFE', bot: '#93C5FD', solid: '#93C5FD' }, // stronger blue
    };
    const t = tones[tweaks.skyTone] || tones.sky;
    document.documentElement.style.setProperty('--light-band-top',   t.top);
    document.documentElement.style.setProperty('--light-band-bot',   t.bot);
    document.documentElement.style.setProperty('--light-band-solid', t.solid);
  }, [tweaks.skyTone]);

  const toggleTheme = () => setTweak('theme', tweaks.theme === 'dark' ? 'light' : 'dark');
  const tinted = tweaks.separator !== 'none';

  return (
    <>
      <Nav theme={tweaks.theme} onToggleTheme={toggleTheme} active="home" />

      <section className={`hero-band ${tinted ? 'tinted' : ''} ${tweaks.separator === 'reeds' ? 'has-reeds' : ''}`}>
        {tweaks.stars && tinted && <Stars />}
        {tweaks.stars && tinted && tweaks.theme === 'dark' && <InteractiveField moteCount={0} />}
        {tweaks.stars && tinted && <ShootingStar />}
        {tweaks.theme === 'light' && tinted && <Clouds />}
        {tweaks.theme === 'light' && tinted && <SunRays />}
        <div className="home-shell">
          <section className="hero">
            <div className="hero-eyebrow">
              <span className="dot" />
              <span>Orlando, FL · software developer · physical therapist</span>
            </div>
            <h1 className="hero-title">
              I build software and let my passion <span className="accent">shine through the work</span>.
            </h1>
            <p className="hero-lede">
              I share my thoughts on the process here — the successes, the failures,
              and the experiences gained along the way. Based in Orlando, FL,
              working as a <strong>home health PT</strong> — which gives me firsthand
              insight into the problems I build for.
            </p>
          </section>
        </div>
        <Separator variant={tweaks.separator} position="hero-bottom" />
      </section>

      <div style={{ position: 'relative' }}>
        {<MarginField maxWidth={920} />}
        <main className="home-shell" style={{ position: 'relative', zIndex: 1 }}>
          <section className="section" id="writing">
          <div className="section-head">
            <div className="section-label"><span className="num">01</span><span>Recent writing</span></div>
            <a href="Journal.html" className="section-link">
              all entries
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
          <div className="writing-list">
            {WRITING.map((p, i) => (
              <a key={i} href={p.href} className="writing-item">
                <span className="writing-date">{p.date}</span>
                <div className="writing-body">
                  <div className="writing-title">{p.title}</div>
                  <div className="writing-excerpt">{p.excerpt}</div>
                </div>
                <span className="writing-category">{p.category}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="now">
          <div className="section-head">
            <div className="section-label"><span className="num">02</span><span>What I'm building now</span></div>
          </div>
          <div className="now-strip">
            <div className="now-strip-label">
              <span className="live" />
              Now
            </div>
            <div className="now-items">
              {NOW_ITEMS.map((n, i) => (
                <div key={i} className="now-item">
                  <div className="what">
                    <span className="project">{n.project}</span>
                    {n.what}
                  </div>
                  <span className="when">{n.when}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="work">
          <div className="section-head">
            <div className="section-label"><span className="num">03</span><span>Selected work</span></div>
            <a href="Work.html" className="section-link">
              all work
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
          <div className="work-grid">
            {WORK.map((w, i) => {
              const metas = (w.links || []).map(linkMeta).filter(Boolean);
              return (
                <div key={i} className="work-card">
                  <span className={`st ${w.status}`}>
                    <span className="st-dot" />
                    {w.statusLabel}
                  </span>
                  <div className="work-title">{w.title}</div>
                  <div className="work-desc">{w.desc}</div>
                  <div className="work-card-foot">
                    {metas.length === 0 ? (
                      <span className="arch-link arch-link-static">In development</span>
                    ) : (
                      metas.map((m, j) => <WorkLink key={j} meta={m} />)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section" id="contact" style={{ paddingBottom: 96 }}>
          <div className="section-head">
            <div className="section-label"><span className="num">04</span><span>Get in touch</span></div>
          </div>
          <p style={{ fontSize: 17, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 560 }}>
            The best way to reach me is{' '}
            <a href="#" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent-line)', textDecoration: 'none' }}>kyler@kylerlong.dev</a>{' '}
            — I read everything and reply to most. I'm slow but I'm honest.
          </p>
        </section>

        <section className="section" id="subscribe" style={{ paddingBottom: 100 }}>
          <div className="section-head">
            <div className="section-label"><span className="num">05</span><span>Stay in the loop</span></div>
          </div>
          <Newsletter />
        </section>
      </main>
      </div>

      <section className={`footer-band ${tinted ? 'tinted' : ''} ${tweaks.separator === 'reeds' ? 'has-reeds' : ''}`}>
        <Separator variant={tweaks.separator} position="footer-top" />
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
        <TweakSection title="After dark">
          <TweakSelect
            label="Horizon"
            value={tweaks.separator}
            onChange={(v) => setTweak('separator', v)}
            options={[
              { value: 'reeds',    label: 'Reeds + cattails (image)' },
              { value: 'wetlands', label: 'Cypress wetlands (drawn)' },
              { value: 'mossy',    label: 'Cypress + Spanish moss' },
              { value: 'sparse',   label: 'Sparse wetlands' },
              { value: 'hills',    label: 'Layered hills' },
              { value: 'pines',    label: 'Pine forest' },
              { value: 'wave',     label: 'Soft waves' },
              { value: 'none',     label: 'None (straight)' },
            ]}
          />
          <TweakToggle
            label="Sparkling stars"
            value={tweaks.stars}
            onChange={(v) => setTweak('stars', v)}
          />
        </TweakSection>
        <TweakSection title="In the daylight">
          <TweakSelect
            label="Sky tone"
            value={tweaks.skyTone}
            onChange={(v) => setTweak('skyTone', v)}
            options={[
              { value: 'sky',        label: 'Sky blue (default)' },
              { value: 'powder',     label: 'Powder blue' },
              { value: 'periwinkle', label: 'Periwinkle' },
              { value: 'deepblue',   label: 'Deep blue' },
              { value: 'slate',      label: 'Slate gray' },
              { value: 'ice',        label: 'Ice (very pale)' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
