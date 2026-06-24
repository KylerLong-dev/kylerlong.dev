import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";
import { MarginField } from "../components/atmosphere/margin-field";
import { NewsletterCard } from "../components/newsletter-card";
import { pageMetadata } from "../lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Kyler Long — questions, ideas, or just to talk shop. The inbox is open.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Say hello."
        sub="Got a question, an idea, or just want to talk shop? My inbox is open."
      />
      <div className="atmo-wrap">
        <MarginField maxWidth={700} />
        <main
          className="journal-shell atmo-content"
          style={{ paddingTop: 56, paddingBottom: 48 }}
        >
        <div className="ledger-wrap">
          <div className="ledger-card">
            <div className="ledger-head">
              <span className="dot" />
              <span className="name">contact</span>
            </div>
            <div className="ledger-body">
              <div className="ledger-row">
                <span className="k">email</span>
                <span className="v">
                  <a href="mailto:hello@kylerlong.dev">hello@kylerlong.dev</a>
                </span>
              </div>
              <div className="ledger-row">
                <span className="k">location</span>
                <span className="v">Orlando, FL</span>
              </div>
              <div className="ledger-row">
                <span className="k">response</span>
                <span className="v">usually within a few days</span>
              </div>

              <div className="ledger-group">{"// elsewhere"}</div>
              <div className="ledger-row">
                <span className="k">github</span>
                <span className="v">
                  <a
                    href="https://github.com/KylerLong-dev"
                    target="_blank"
                    rel="noopener"
                  >
                    @KylerLong-dev
                  </a>
                </span>
              </div>
              <div className="ledger-row">
                <span className="k">twitter / x</span>
                <span className="v">
                  <a href="#" target="_blank" rel="noopener">
                    @kylerlong
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <NewsletterCard />
          </div>
        </div>
        </main>
      </div>
    </>
  );
}