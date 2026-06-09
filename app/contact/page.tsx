import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";
import { NewsletterCard } from "../components/newsletter-card";

export const metadata: Metadata = { title: "Contact" };

// Phase 1 stub — colophon ledger arrives in Phase 2; the newsletter card here
// is the real shared component.
export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Say hello."
        sub="Got a question, an idea, or just want to talk shop? My inbox is open."
      />
      <main
        className="journal-shell"
        style={{ paddingTop: 56, paddingBottom: 64 }}
      >
        <NewsletterCard />
      </main>
    </>
  );
}