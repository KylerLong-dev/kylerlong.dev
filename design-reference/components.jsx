/* global React */
const { useState, useEffect, useRef, useCallback } = React;

/* ============================================
   Nav
   ============================================ */
function Nav({ theme, onToggleTheme, active = 'journal' }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="Home.html" className="nav-logo">kylerlong<span className="dot">.</span>dev</a>
        <div className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <a href="Journal.html" className={`nav-link ${active === 'journal' ? 'active' : ''}`}>journal</a>
          <a href="Work.html" className={`nav-link ${active === 'work' ? 'active' : ''}`}>work</a>
          <a href="About.html" className={`nav-link ${active === 'about' ? 'active' : ''}`}>about</a>
          <a href="Contact.html" className={`nav-link ${active === 'contact' ? 'active' : ''}`}>contact</a>
        </div>
        <div className="nav-actions">
          <button className={`theme-toggle ${theme}`} onClick={onToggleTheme} aria-label="Toggle theme">
            <span className="theme-icon">
              <svg className="ti-sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
              <svg className="ti-moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
          </button>
          <button className={`nav-burger ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <span className="burger-box">
              <span className="burger-bar burger-bar-top"></span>
              <span className="burger-bar burger-bar-mid"></span>
              <span className="burger-bar burger-bar-bot"></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ============================================
   Progress bar
   ============================================ */
function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0;
      setPct(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return <div className="progress-bar" style={{ width: `${pct}%` }} />;
}

/* ============================================
   TOC
   ============================================ */
function TOC({ items, activeId, pct }) {
  return (
    <div className="toc">
      <div className="toc-label">On this page</div>
      <ul className="toc-list">
        {items.map((it) => (
          <li
            key={it.id}
            className={`toc-item ${activeId === it.id ? 'active' : ''}`}
          >
            <a
              href={`#${it.id}`}
              className={`toc-link ${it.level === 3 ? 'h3' : ''}`}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="toc-reading-time">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span><span className="pct">{Math.round(pct)}%</span> · 8 min read</span>
      </div>
    </div>
  );
}

/* ============================================
   Code block
   ============================================ */
function CodeBlock({ filename, lang, lines, highlight = [] }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    const txt = lines.map(l => stripTokens(l)).join('\n');
    navigator.clipboard?.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }, [lines]);

  return (
    <div className="codeblock">
      <div className="codeblock-header">
        <span className="codeblock-filename">
          <span className="lang-dot" />
          {filename}
        </span>
        <button className={`codeblock-copy ${copied ? 'copied' : ''}`} onClick={copy}>
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              copied
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              copy
            </>
          )}
        </button>
      </div>
      <div className="codeblock-body">
        <div className="codeblock-gutter">
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre className="codeblock-pre"><code>
          {lines.map((line, i) => (
            <span key={i} className={`codeblock-line ${highlight.includes(i + 1) ? 'highlighted' : ''}`}>
              <Tokenized html={line} />
              {'\n'}
            </span>
          ))}
        </code></pre>
      </div>
    </div>
  );
}

// Renders a string with simple [[token:class|text]] markup
function Tokenized({ html }) {
  if (!html) return <>{'\u00A0'}</>;
  const parts = [];
  const re = /\[\[(\w+):([^\]]*?)\]\]/g;
  let last = 0, m, key = 0;
  while ((m = re.exec(html)) !== null) {
    if (m.index > last) parts.push(html.slice(last, m.index));
    parts.push(<span key={key++} className={`tok-${m[1]}`}>{m[2]}</span>);
    last = m.index + m[0].length;
  }
  if (last < html.length) parts.push(html.slice(last));
  return <>{parts}</>;
}
function stripTokens(s) {
  return s.replace(/\[\[(\w+):([^\]]*?)\]\]/g, (_, _k, v) => v);
}

/* ============================================
   Callout
   ============================================ */
function Callout({ type = 'note', title, children }) {
  const icons = {
    note: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    warn: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    tip: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M15 14a5 5 0 1 0-6 0c1 1 1.5 2 1.5 3h3c0-1 .5-2 1.5-3z"/>
      </svg>
    ),
  };
  const labels = { note: 'Note', warn: 'Warning', tip: 'Tip' };
  return (
    <div className={`callout callout-${type}`}>
      <div className="callout-icon">{icons[type]}</div>
      <div className="callout-body">
        <strong>{title || labels[type]}</strong>
        {children}
      </div>
    </div>
  );
}

/* ============================================
   Figure
   ============================================ */
function Figure({ children, caption, label = 'Fig.' }) {
  return (
    <figure className="figure">
      <div className="figure-img terminal">{children}</div>
      <figcaption>
        <span className="label">{label}</span>{caption}
      </figcaption>
    </figure>
  );
}

/* ============================================
   Tweet embed
   ============================================ */
function Tweet({ name, handle, date, children }) {
  return (
    <div className="tweet">
      <div className="tweet-header">
        <div className="tweet-avatar" />
        <div className="tweet-meta">
          <span className="tweet-name">{name}</span>
          <span className="tweet-handle">@{handle}</span>
        </div>
      </div>
      <div className="tweet-body">{children}</div>
      <div className="tweet-footer">
        <span>{date}</span>
        <svg className="tweet-logo" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    </div>
  );
}

/* ============================================
   Footnote ref
   ============================================ */
function FN({ n }) {
  return (
    <a href={`#fn-${n}`} id={`fn-ref-${n}`} className="footnote-ref">[{n}]</a>
  );
}

/* ============================================
   Related posts
   ============================================ */
function Related({ items }) {
  return (
    <section className="related">
      <div className="related-inner">
        <div className="related-label">More in this series</div>
        <div className="related-list">
          {items.map((p, i) => (
            <a key={i} href="#" className="related-item">
              <span className="related-date">{p.date}</span>
              <span className="related-title">{p.title}</span>
              <span className="related-category">{p.category}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ signup = false }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };
  return (
    <footer className="footer">
      {signup && (
        <div className="footer-signup">
          <div className="footer-signup-copy">
            <span className="footer-signup-title">Get new posts in your inbox</span>
            <span className="footer-signup-sub">Occasional — only when I publish. No spam.</span>
          </div>
          {done ? (
            <div className="footer-signup-done">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              You're on the list.
            </div>
          ) : (
            <form className="footer-signup-form" onSubmit={submit}>
              <input
                type="email"
                className="footer-signup-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className="footer-signup-btn" aria-label="Subscribe">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
      <div className="footer-inner">
        <span>© 2026 Kyler Long · Orlando, FL</span>
        <div style={{ display: 'flex', gap: 18 }}>
          <a href="#">rss</a>
          <a href="https://github.com/KylerLong-dev" target="_blank" rel="noopener">github</a>
          <a href="#">x</a>
        </div>
      </div>
    </footer>
  );
}

/* Shared newsletter card — used standalone on interior pages (above the footer)
   and matching the home page's section-05 card. */
function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
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

/* Elliptical curved divider — used at the bottom of interior page-header bands.
   The fill color (set via CSS `color`) should match the page background so the
   curve appears to "cut" the tinted band into the content below. */
function CurveDivider() {
  return (
    <div className="curve-divider" aria-hidden="true">
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
        <path d="M0,18 Q720,82 1440,18 L1440,70 L0,70 Z" fill="currentColor" />
        <path d="M0,18 Q720,82 1440,18" fill="none" stroke="var(--curve-line, transparent)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* Shared theme persistence across pages (runtime preference). */
function savedTheme(fallback) {
  try { return localStorage.getItem('kl-theme') || fallback; } catch (e) { return fallback; }
}
function rememberTheme(t) {
  try { localStorage.setItem('kl-theme', t); } catch (e) {}
}

Object.assign(window, {
  Nav, ProgressBar, TOC, CodeBlock, Callout, Figure, Tweet, FN, Related, Footer, CurveDivider, NewsletterCard,
  Tokenized, stripTokens, savedTheme, rememberTheme,
});
