import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";
import { Status } from "../components/status";
import { CtaLink } from "../components/cta-link";
import { MarginField } from "../components/atmosphere/margin-field";
import { FEATURED, ARCHIVE, projectLinks, type Project } from "../lib/projects";
import { pageMetadata } from "../lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Selected work by Kyler Long — software built from the field, where home-health physical therapy meets shipping code.",
  path: "/work",
});

// Featured project — large asymmetric card. Not a link while building; 0 links
// shows "In active development" instead of CTAs.
function FeaturedCard({ project }: { project: Project }) {
  const metas = projectLinks(project);
  return (
    <div className="feat-card">
      <div className="feat-main">
        <div className="feat-statusline">
          <Status status={project.status} label={project.statusLabel} />
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
            {project.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
        {metas.length === 0 ? (
          <span className="feat-buildnote">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            In active development
          </span>
        ) : (
          <div className="feat-ctas">
            {metas.map((m) => (
              <CtaLink key={`${m.href}${m.label}`} meta={m} className="feat-cta" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Compact "also built" row. Only the link chips are clickable, never the row.
function ArchiveRow({ project }: { project: Project }) {
  const metas = projectLinks(project);
  return (
    <div className="arch-row">
      <Status status={project.status} label={project.statusLabel} />
      <div className="arch-body">
        <div className="arch-title">{project.title}</div>
        <div className="arch-desc">{project.desc}</div>
        <div className="arch-stack">
          {project.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
      {metas.length === 0 ? (
        <span className="arch-link arch-link-static">In development</span>
      ) : (
        <div className="arch-links">
          {metas.map((m) => (
            <CtaLink key={`${m.href}${m.label}`} meta={m} className="arch-link" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Software that started in a patient’s living room"
        sub="Tools I’ve built for the messy realities of home-health care — and what each one taught me on the way."
      />
      <div className="atmo-wrap">
        <MarginField maxWidth={1080} />
        <main
          className="journal-shell atmo-content"
          style={{ paddingTop: 56, paddingBottom: 16 }}
        >
          <div className="work-lead">
          <p>
            Every project here traces back to a problem I watched slow down good
            care. The early ones were rough experiments held together with
            spreadsheets and stubbornness;{" "}
            <span className="accent">what follows is where that went</span> —
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
            {ARCHIVE.map((p) => (
              <ArchiveRow key={p.title} project={p} />
            ))}
          </div>
        </section>
        </main>
      </div>
    </>
  );
}