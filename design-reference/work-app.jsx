/* global React, ReactDOM, Nav, Footer, Separator, Stars, ShootingStar, Clouds, CurveDivider, InteractiveField, MarginFireflies, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect */
const { useEffect } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "fontPair": "geist",
  "skyTone": "deepblue"
}/*EDITMODE-END*/;

/* ============================================
   Content
   ============================================ */
const FEATURED = {
  href: '#',
  index: '01',
  status: 'building',
  statusLabel: 'Now building',
  title: 'Route Optimizer',
  role: 'Route planning for home-health clinicians',
  desc: 'Clinicians can lose an hour a day just deciding what order to see patients in. Route Optimizer turns a day\u2019s visit list into the fastest realistic loop \u2014 accounting for traffic, appointment windows, and the fact that some visits always run long.',
  note: 'I built the first version for myself, sketching the day\u2019s route on a paper map between visits. This is what that hunch grew into.',
  stack: ['Next.js', 'Prisma', 'Neon', 'Google Maps API'],
  links: [],
};

const ARCHIVE = [
  {
    status: 'paused',
    statusLabel: 'Paused',
    title: 'Scribe Companion',
    desc: 'Dictate a visit and get a structured SOAP note back \u2014 an AI scribe tuned for the language of rehab. Parked while I work out the parts I\u2019m not willing to get wrong.',
    stack: ['OpenAI', 'Azure STT', 'AWS', 'Clerk'],
    links: [{ type: 'case-study', href: '#' }],
  },
  {
    status: 'evergreen',
    statusLabel: 'Evergreen',
    title: 'kylerlong.dev',
    desc: 'This site. Journal, work, and the occasional long-form detour \u2014 built to stay out of the way of the writing.',
    stack: ['Next.js', 'MDX', 'App Router'],
    links: [{ type: 'case-study', href: '#' }, { type: 'live', href: 'Home.html' }],
  },
  {
    status: 'planned',
    statusLabel: 'Planned',
    title: 'verosnapshots.com',
    desc: 'A portfolio and booking site for a Florida-based photographer \u2014 galleries, session packages, and inquiries in one place. On the someday list.',
    stack: ['Next.js', 'Sanity', 'Cloudinary'],
    links: [],
  },
];

/* ============================================
   Link affordances — each link's type drives its label + behavior.
     case-study → internal "Case study"
     live       → external "Visit" (opens in a new tab)
   A project can carry several (e.g. a write-up AND a deployed site).
   An empty links array = nothing to visit yet (in development).
   ============================================ */
function linkMeta(link) {
  switch (link.type) {
    case 'case-study': return { label: 'Case study', external: false, href: link.href };
    case 'live':       return { label: 'Visit', external: true, href: link.href };
    default:           return null;
  }
}
function projectLinks(project) {
  return (project.links || []).map(linkMeta).filter(Boolean);
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/>
      <polyline points="7 7 17 7 17 17"/>
    </svg>
  );
}
function CtaLink({ meta, className }) {
  return (
    <a className={className} href={meta.href} {...(meta.external ? { target: '_blank', rel: 'noopener' } : {})}>
      {meta.label}
      <LinkIcon />
    </a>
  );
}

/* ============================================
   Featured hero
   ============================================ */
function FeaturedCard({ project }) {
  return (
    <div className="feat-card">
      <div className="feat-main">
        <div className="feat-statusline">
          <span className={`st ${project.status}`}>
            <span className="st-dot" />
            {project.statusLabel}
          </span>
          <span className="feat-index">{project.index}</span>
        </div>
        <h2 className="feat-title">{project.title}</h2>
        <div className="feat-role">{project.role}</div>
        <p className="feat-desc">{project.desc}</p>
        <p className="feat-note">{project.note}</p>
      </div>
      <div className="feat-side">
        <div className="feat-side-block">
          <div className="feat-side-label">Built with</div>
          <div className="feat-stack">
            {project.stack.map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </div>
        {(() => {
          const metas = projectLinks(project);
          if (metas.length === 0) {
            return (
              <span className="feat-buildnote">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <polyline points="12 7 12 12 15 14"/>
                </svg>
                In active development
              </span>
            );
          }
          return (
            <div className="feat-ctas">
              {metas.map((m, i) => <CtaLink key={i} meta={m} className="feat-cta" />)}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ============================================
   Archive row
   ============================================ */
function ArchiveRow({ project }) {
  const metas = projectLinks(project);
  return (
    <div className="arch-row">
      <span className={`st ${project.status}`}>
        <span className="st-dot" />
        {project.statusLabel}
      </span>
      <div className="arch-body">
        <div className="arch-title">{project.title}</div>
        <div className="arch-desc">{project.desc}</div>
        <div className="arch-stack">
          {project.stack.map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </div>
      {metas.length === 0 ? (
        <span className="arch-link arch-link-static">In development</span>
      ) : (
        <div className="arch-links">
          {metas.map((m, i) => <CtaLink key={i} meta={m} className="arch-link" />)}
        </div>
      )}
    </div>
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
      <Nav theme={tweaks.theme} onToggleTheme={toggleTheme} active="work" />

      <header className="j-header page-band">
        {tweaks.theme === 'dark' && <Stars />}
        {tweaks.theme === 'dark' && <InteractiveField moteCount={0} />}
        {tweaks.theme === 'dark' && <ShootingStar />}
        {tweaks.theme === 'light' && <Clouds />}
        <div className="journal-shell">
          <div className="j-header-inner">
            <div className="j-eyebrow">
              <span className="dot" />
              Selected work
            </div>
            <h1 className="j-page-title">Software that started in a patient&rsquo;s living room</h1>
            <p className="j-page-sub">
              Tools I&rsquo;ve built for the messy realities of home-health care &mdash;
              and what each one taught me on the way.
            </p>
          </div>
        </div>
        <CurveDivider />
      </header>

      <div style={{ position: 'relative' }}>
        {<MarginField maxWidth={1080} />}
        <main className="journal-shell" style={{ paddingTop: 56, paddingBottom: 16, position: 'relative', zIndex: 1 }}>
        <div className="work-lead">
          <p>
            Every project here traces back to a problem I watched slow down good care.
            The early ones were rough experiments held together with spreadsheets and
            stubbornness; <span className="accent">what follows is where that went</span> &mdash;
            each one a little less naive than the last.
          </p>
        </div>

        <section className="work-sec">
          <div className="work-sec-head">
            <span className="work-sec-label">Currently</span>
            <span className="work-sec-rule" />
          </div>
          <FeaturedCard project={FEATURED} />
        </section>

        <section className="work-sec">
          <div className="work-sec-head">
            <span className="work-sec-label">Also built</span>
            <span className="work-sec-rule" />
            <span className="work-sec-count">{ARCHIVE.length} projects</span>
          </div>
          <div className="archive-list">
            {ARCHIVE.map((p) => <ArchiveRow key={p.title} project={p} />)}
          </div>
        </section>
      </main>
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
