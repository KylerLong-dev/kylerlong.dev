/* global React, ReactDOM, Nav, Footer, Separator, Stars, ShootingStar, Clouds, CurveDivider, NewsletterCard, InteractiveField, MarginFireflies, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect */
const { useEffect } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "fontPair": "geist",
  "skyTone": "deepblue"
}/*EDITMODE-END*/;

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
      <Nav theme={tweaks.theme} onToggleTheme={toggleTheme} active="contact" />

      <header className="j-header page-band">
        {tweaks.theme === 'dark' && <Stars />}
        {tweaks.theme === 'dark' && <InteractiveField moteCount={0} />}
        {tweaks.theme === 'dark' && <ShootingStar />}
        {tweaks.theme === 'light' && <Clouds />}
        <div className="journal-shell">
          <div className="j-header-inner">
            <div className="j-eyebrow">
              <span className="dot" />
              Contact
            </div>
            <h1 className="j-page-title">Say hello.</h1>
            <p className="j-page-sub">
              Got a question, an idea, or just want to talk shop? My inbox is open.
            </p>
          </div>
        </div>
        <CurveDivider />
      </header>

      <div style={{ position: 'relative' }}>
        {<MarginField maxWidth={700} />}
        <main className="journal-shell" style={{ paddingTop: 56, paddingBottom: 48, position: 'relative', zIndex: 1 }}>
        <div className="ledger-wrap">
          <div className="ledger-card">
            <div className="ledger-head">
              <span className="dot" />
              <span className="name">contact</span>
            </div>
            <div className="ledger-body">
              <div className="ledger-row">
                <span className="k">email</span>
                <span className="v"><a href="mailto:kyler@kylerlong.dev">kyler@kylerlong.dev</a></span>
              </div>
              <div className="ledger-row">
                <span className="k">location</span>
                <span className="v">Orlando, FL</span>
              </div>
              <div className="ledger-row">
                <span className="k">response</span>
                <span className="v">usually within a few days</span>
              </div>

              <div className="ledger-group">// elsewhere</div>
              <div className="ledger-row">
                <span className="k">github</span>
                <span className="v"><a href="https://github.com/KylerLong-dev" target="_blank" rel="noopener">@KylerLong-dev</a></span>
              </div>
              <div className="ledger-row">
                <span className="k">twitter / x</span>
                <span className="v"><a href="#" target="_blank" rel="noopener">@kylerlong</a></span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <NewsletterCard />
          </div>
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
