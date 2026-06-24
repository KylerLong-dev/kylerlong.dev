import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";
import { MarginField } from "../components/atmosphere/margin-field";
import { pageMetadata } from "../lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Kyler Long — a software developer and home-health physical therapist in Orlando, FL, building from the field and writing about both crafts.",
  path: "/about",
});

function IntroTile() {
  return (
    <div className="bento-tile tile-intro">
      <div className="bento-eyebrow">
        <span className="pin-dot" /> Orlando, FL
      </div>
      <h2 className="intro-title">
        I’m a software developer &amp;{" "}
        <span className="accent">physical therapist</span> building from the
        field.
      </h2>
      <p className="intro-body">
        By day I’m in patients’ homes as a home-health PT. The rest of the time
        I’m writing software for the gaps I keep noticing there. The two worlds
        won’t stop teaching each other — and this site is where I think out loud
        about both.
      </p>
    </div>
  );
}

function PhotoTile() {
  // TODO(placeholder): real portrait photo of Kyler.
  return (
    <div className="bento-tile tile-photo">
      <div className="img-ph">Drop a photo of you</div>
    </div>
  );
}

function ThroughTile() {
  return (
    <div className="bento-tile tile-through">
      <div className="tile-heading">The throughline</div>
      <div className="through-big">
        PT <span className="arrow">→</span> software
      </div>
      <p className="tile-lead">
        Clinical work is all <strong>edge cases</strong> — every home is
        different, every body is different. That instinct for the long tail is
        exactly what I bring to the code.
      </p>
    </div>
  );
}

function MapTile() {
  // Real map via OpenStreetMap's embed (no API key, no extra deps). Zoomed out
  // to the Florida region with a marker on Orlando — city-level, not an exact
  // address. Themed to the site in CSS (dark mode inverts the light tiles).
  const bbox = "-92.0,22.0,-76.0,33.0";
  const marker = "28.5383,-81.3792";
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
  return (
    <div className="bento-tile tile-map">
      <iframe
        className="map-frame"
        title="Map showing Orlando, Florida"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
      />
      <div className="map-label">
        <div className="city">Orlando, FL</div>
      </div>
    </div>
  );
}

function CraftTile() {
  return (
    <div className="bento-tile tile-craft">
      <div className="tile-heading">Things I believe about craft</div>
      <ul className="belief-list">
        <li>
          <span className="mk">01</span>
          <span>Good software gets out of the way.</span>
        </li>
        <li>
          <span className="mk">02</span>
          <span>The long tail is where real people live.</span>
        </li>
        <li>
          <span className="mk">03</span>
          <span>Rewrite it until it’s honest, then ship it.</span>
        </li>
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
          <span className="v">
            <strong>Tampa native</strong> — a true Floridian, sun and all.
          </span>
        </div>
        <div className="fact">
          <span className="k">Fuel</span>
          <span className="v">
            Always hunting the best <strong>local cold brew</strong> to program
            beside.
          </span>
        </div>
        <div className="fact">
          <span className="k">Outside</span>
          <span className="v">
            Hiking, birding, and finding great restaurants around town.
          </span>
        </div>
        <div className="fact">
          <span className="k">Crew</span>
          <span className="v">
            My <strong>wife</strong>, a mini dachshund, and two cats — the best
            of them all.
          </span>
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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>
            Reading <b>anything fantasy</b> I can get my hands on.
          </span>
        </div>
        <div className="off-row">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span>
            <b>Lofi beats</b> to soothe the soul while I work.
          </span>
        </div>
      </div>
    </div>
  );
}

function ContactTile() {
  return (
    <div className="bento-tile tile-contact">
      <div className="tile-heading">Get in touch</div>
      <a className="contact-email" href="mailto:hello@kylerlong.dev">
        hello@kylerlong.dev
      </a>
      <div className="contact-links">
        <a
          href="https://github.com/KylerLong-dev"
          target="_blank"
          rel="noopener"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z" />
          </svg>
          GitHub
        </a>
        <a href="#" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.9 1.2h3.7l-8 9.1L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9zm-1.3 19.4h2L6.5 3.3h-2.2l13.3 17.3z" />
          </svg>
          X
        </a>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Hey — I’m Kyler."
        sub="Developer, physical therapist, and lifelong Floridian. Here’s the longer story, in pieces."
      />
      <div className="atmo-wrap">
        <MarginField maxWidth={1080} />
        <main
          className="journal-shell atmo-content"
          style={{ paddingTop: 56, paddingBottom: 24 }}
        >
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
    </>
  );
}