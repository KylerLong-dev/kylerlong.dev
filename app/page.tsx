import { PageHeader } from "./components/page-header";
import { NewsletterCard } from "./components/newsletter-card";

// Phase 1 placeholder. The real hero band, now-strip, and selected work are
// built in Phase 4 — for now this exercises the shared shell.
export default function Home() {
  return (
    <>
      <PageHeader
        eyebrow="Orlando · developer · physical therapist"
        title="kylerlong.dev"
        sub="Phase 1 shows the shared shell — nav, header band, footer with reeds, and the newsletter card. The real home page lands in Phase 4."
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