import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";

export const metadata: Metadata = { title: "About" };

// Phase 1 stub — bento layout arrives in Phase 2.
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Hey — I’m Kyler."
        sub="Developer, physical therapist, and lifelong Floridian. Here’s the longer story, in pieces."
      />
      <main
        className="journal-shell"
        style={{ paddingTop: 56, paddingBottom: 64 }}
      >
        <p className="text-muted">Phase 1 shell stub — full page in Phase 2.</p>
      </main>
    </>
  );
}