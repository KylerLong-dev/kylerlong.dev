import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";
import { NewsletterCard } from "../components/newsletter-card";

export const metadata: Metadata = { title: "Contact" };

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
                  <a href="mailto:kyler@kylerlong.dev">kyler@kylerlong.dev</a>
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
    </>
  );
}