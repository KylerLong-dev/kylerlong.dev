/* global React, ReactDOM, Nav, Footer, Separator, Stars, ShootingStar, Clouds, CurveDivider, InteractiveField, MarginFireflies, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect */
const { useEffect } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "fontPair": "geist",
  "skyTone": "deepblue"
}/*EDITMODE-END*/;

/* ============================================
   Tiles
   ============================================ */
function IntroTile() {
  return (
    <div className="bento-tile tile-intro">
      <div className="bento-eyebrow"><span className="pin-dot" /> Orlando, FL</div>
      <h2 className="intro-title">
        I&rsquo;m a software developer &amp; <span className="accent">physical therapist</span> building from the field.
      </h2>
      <p className="intro-body">
        By day I&rsquo;m in patients&rsquo; homes as a home-health PT. The rest of the
        time I&rsquo;m writing software for the gaps I keep noticing there. The two
        worlds won&rsquo;t stop teaching each other &mdash; and this site is where I think
        out loud about both.
      </p>
    </div>
  );
}

function PhotoTile() {
  return (
    <div className="bento-tile tile-photo">
      <image-slot id="about-portrait" shape="rounded" radius="18" placeholder="Drop a photo of you"></image-slot>
    </div>
  );
}

function ThroughTile() {
  return (
    <div className="bento-tile tile-through">
      <div className="tile-heading">The throughline</div>
      <div className="through-big">PT <span className="arrow">&rarr;</span> software</div>
      <p className="tile-lead">
        Clinical work is all <strong>edge cases</strong> &mdash; every home is different, every
        body is different. That instinct for the long tail is exactly what I bring to
        the code.
      </p>
    </div>
  );
}

function MapTile() {
  return (
    <div className="bento-tile tile-map">
      <div className="map-canvas" />
      <svg className="map-roads" viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="1.5" preserveAspectRatio="none">
        <path d="M-5 40 C 60 55, 90 30, 210 70" stroke="var(--text-3)" />
        <path d="M30 -5 C 50 60, 110 90, 90 170" stroke="var(--text-3)" />
        <path d="M120 -5 C 130 50, 140 80, 200 110" stroke="var(--text-3)" />
      </svg>
      <span className="map-pin" />
      <div className="map-label">
        <div className="city">Orlando, FL</div>
        <div className="coords">28.54&deg; N &middot; 81.38&deg; W</div>
      </div>
    </div>
  );
}

function CraftTile() {
  return (
    <div className="bento-tile tile-craft">
      <div className="tile-heading">Things I believe about craft</div>
      <ul className="belief-list">
        <li><span className="mk">01</span><span>Good software gets out of the way.</span></li>
        <li><span className="mk">02</span><span>The long tail is where real people live.</span></li>
        <li><span className="mk">03</span><span>Rewrite it until it&rsquo;s honest, then ship it.</span></li>
      </ul>
    </div>
  );
}

function FactsTile() {
  return (
    <div className="bento-tile tile-facts">
      <div className="tile-heading">Fun facts</div>
      <div className="fact-list">
        <div className="fact">
          <span className="k">Roots</span>
          <span className="v"><strong>Tampa native</strong> &mdash; a true Floridian, sun and all.</span>
        </div>
        <div className="fact">
          <span className="k">Fuel</span>
          <span className="v">Always hunting the best <strong>local cold brew</strong> to program beside.</span>
        </div>
        <div className="fact">
          <span className="k">Outside</span>
          <span className="v">Hiking, birding, and finding great restaurants around town.</span>
        </div>
        <div className="fact">
          <span className="k">Crew</span>
          <span className="v">My <strong>wife</strong>, a mini dachshund, and two cats &mdash; the best of them all.</span>
        </div>
      </div>
    </div>
  );
}

function OffTile() {
  return (
    <div className="bento-tile tile-off">
      <div className="tile-heading">Off the clock</div>
      <div>
        <div className="off-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>Reading <b>anything fantasy</b> I can get my hands on.</span>
        </div>
        <div className="off-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
          <span><b>Lofi beats</b> to soothe the soul while I work.</span>
        </div>
      </div>
    </div>
  );
}

function ContactTile() {
  return (
    <div className="bento-tile tile-contact">
      <div className="tile-heading">Get in touch</div>
      <a className="contact-email" href="mailto:kyler@kylerlong.dev">kyler@kylerlong.dev</a>
      <div className="contact-links">
        <a href="https://github.com/KylerLong-dev" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"/></svg>
          GitHub
        </a>
        <a href="#" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.2h3.7l-8 9.1L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9zm-1.3 19.4h2L6.5 3.3h-2.2l13.3 17.3z"/></svg>
          X
        </a>
      </div>
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
      <Nav theme={tweaks.theme} onToggleTheme={toggleTheme} active="about" />

      <header className="j-header page-band">
        {tweaks.theme === 'dark' && <Stars />}
        {tweaks.theme === 'dark' && <InteractiveField moteCount={0} />}
        {tweaks.theme === 'dark' && <ShootingStar />}
        {tweaks.theme === 'light' && <Clouds />}
        <div className="journal-shell">
          <div className="j-header-inner">
            <div className="j-eyebrow">
              <span className="dot" />
              About
            </div>
            <h1 className="j-page-title">Hey &mdash; I&rsquo;m Kyler.</h1>
            <p className="j-page-sub">
              Developer, physical therapist, and lifelong Floridian. Here&rsquo;s the
              longer story, in pieces.
            </p>
          </div>
        </div>
        <CurveDivider />
      </header>

      <div style={{ position: 'relative' }}>
      {<MarginField maxWidth={1080} />}
      <main className="journal-shell" style={{ paddingTop: 56, paddingBottom: 24, position: 'relative', zIndex: 1 }}>
        <div className="about-bento layout-a">
          <IntroTile />
          <PhotoTile />
          <ThroughTile />
          <MapTile />
          <CraftTile />
          <FactsTile />
          <OffTile />
          <ContactTile />
        </div>
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
