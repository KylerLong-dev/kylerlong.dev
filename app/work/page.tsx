import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";

export const metadata: Metadata = { title: "Work" };

// Phase 1 stub — featured project + "also built" rows arrive in Phase 2.
export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Software that started in a patient’s living room"
        sub="Tools I’ve built for the messy realities of home-health care — and what each one taught me on the way."
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