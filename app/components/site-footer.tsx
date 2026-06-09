import { Separator } from "./separator";

// Tinted band with upward-pointing reeds, plus the copyright + links row.
// rss/x are placeholders (#) until a feed/handle exist; github is live.
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <section className="footer-band tinted has-reeds">
      <Separator variant="reeds" position="footer-top" />
      <footer className="footer">
        <div className="footer-inner">
          <span>© {year} Kyler Long · Orlando, FL</span>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="#">rss</a>
            <a
              href="https://github.com/KylerLong-dev"
              target="_blank"
              rel="noopener"
            >
              github
            </a>
            <a href="#">x</a>
          </div>
        </div>
      </footer>
    </section>
  );
}