import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";

export const metadata: Metadata = { title: "Journal" };

// Phase 1 stub — full journal index (MDX list + rail) arrives in Phase 3.
export default function JournalPage() {
  return (
    <>
      <PageHeader
        eyebrow="The journal"
        title="Writing on software, craft, and the long way around"
        sub="Field notes from building things — the successes, the failures, and the experiences gained along the way. New entries land here first."
      />
      <main
        className="journal-shell"
        style={{ paddingTop: 56, paddingBottom: 64 }}
      >
        <p className="text-muted">Phase 1 shell stub — full page in Phase 3.</p>
      </main>
    </>
  );
}