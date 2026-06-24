import Link from "next/link";
import { Separator } from "./components/separator";
import { Sky } from "./components/atmosphere/sky";
import { MarginField } from "./components/atmosphere/margin-field";
import { NewsletterCard } from "./components/newsletter-card";
import { Status } from "./components/status";
import { CtaLink } from "./components/cta-link";
import { ARCHIVE, projectLinks } from "./lib/projects";
import { getAllPosts, toPostMeta } from "./lib/posts";

// Section-link arrow ("all entries →" / "all work →"). Slides right on hover
// via the .section-link:hover gap change.
function ArrowRight() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// "What I'm building now" — leads with Route Optimizer (the featured project on
// /work), then the journal + reading. Placeholder copy carried from the
// prototype until there's something truer to say.
const NOW = [
  {
    project: "Route Optimizer",
    what: "Wiring up live traffic and appointment windows so a day of home-health visits plans its own fastest loop.",
    when: "building",
  },
  {
    project: "journal",
    what: "Drafting a new piece on what home-health PT taught me about edge cases.",
    when: "this month",
  },
  {
    project: "reading",
    what: "Designing Data-Intensive Applications — finally — and Annie Dillard, The Writing Life.",
    when: "now",
  },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 5).map(toPostMeta);

  return (
    <>
      <section className="hero-band has-reeds">
        <Sky sun starCount={75} />
        <div className="home-shell">
          <section className="hero">
            <div className="hero-eyebrow">
              <span className="dot" />
              <span>Orlando, FL · software developer · physical therapist</span>
            </div>
            <h1 className="hero-title">
              I build software and let my passion{" "}
              <span className="accent">shine through the work</span>.
            </h1>
            <p className="hero-lede">
              I share my thoughts on the process here — the successes, the
              failures, and the experiences gained along the way. Based in
              Orlando, FL, working as a <strong>home health PT</strong> — which
              gives me firsthand insight into the problems I build for.
            </p>
          </section>
        </div>
        <Separator variant="reeds" position="hero-bottom" />
      </section>

      <div className="atmo-wrap">
        <MarginField maxWidth={920} />
        <main className="home-shell atmo-content">
        {/* 01 — Recent writing */}
        <section className="section" id="writing">
          <div className="section-head">
            <div className="section-label">
              <span className="num">01</span>
              <span>Recent writing</span>
            </div>
            <Link href="/journal" className="section-link">
              all entries
              <ArrowRight />
            </Link>
          </div>
          <div className="writing-list">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/journal/${p.slug}`}
                className="writing-item"
              >
                <span className="writing-date">{p.dateFormatted}</span>
                <div className="writing-body">
                  <div className="writing-title">{p.title}</div>
                  <div className="writing-excerpt">{p.excerpt}</div>
                </div>
                <span className="writing-category">{p.category}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 02 — What I'm building now */}
        <section className="section" id="now">
          <div className="section-head">
            <div className="section-label">
              <span className="num">02</span>
              <span>What I&rsquo;m building now</span>
            </div>
          </div>
          <div className="now-strip">
            <div className="now-strip-label">
              <span className="live" />
              Now
            </div>
            <div className="now-items">
              {NOW.map((n) => (
                <div key={n.project} className="now-item">
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

        {/* 03 — Selected work */}
        <section className="section" id="work">
          <div className="section-head">
            <div className="section-label">
              <span className="num">03</span>
              <span>Selected work</span>
            </div>
            <Link href="/work" className="section-link">
              all work
              <ArrowRight />
            </Link>
          </div>
          <div className="work-grid">
            {ARCHIVE.map((project) => {
              const metas = projectLinks(project);
              return (
                <div key={project.title} className="work-card">
                  <Status status={project.status} label={project.statusLabel} />
                  <div className="work-title">{project.title}</div>
                  <div className="work-desc">{project.desc}</div>
                  <div className="work-card-foot">
                    {metas.length === 0 ? (
                      <span className="arch-link arch-link-static">
                        In development
                      </span>
                    ) : (
                      metas.map((m) => (
                        <CtaLink
                          key={`${m.href}${m.label}`}
                          meta={m}
                          className="arch-link"
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 04 — Get in touch */}
        <section className="section" id="contact">
          <div className="section-head">
            <div className="section-label">
              <span className="num">04</span>
              <span>Get in touch</span>
            </div>
          </div>
          <p className="home-contact-lede">
            The best way to reach me is{" "}
            <a className="home-contact-email" href="mailto:hello@kylerlong.dev">
              hello@kylerlong.dev
            </a>{" "}
            — I read everything and reply to most. I&rsquo;m slow but I&rsquo;m
            honest.
          </p>
        </section>

        {/* 05 — Stay in the loop */}
        <section className="section" id="subscribe">
          <div className="section-head">
            <div className="section-label">
              <span className="num">05</span>
              <span>Stay in the loop</span>
            </div>
          </div>
          <NewsletterCard />
        </section>
        </main>
      </div>
    </>
  );
}