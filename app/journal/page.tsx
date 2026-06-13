import type { Metadata } from "next";
import { PageHeader } from "../components/page-header";
import { NewsletterCard } from "../components/newsletter-card";
import { JournalIndex } from "../components/journal-index";
import { MarginField } from "../components/atmosphere/margin-field";
import {
  getAllPosts,
  getCategories,
  getPopularPosts,
  toPostMeta,
} from "../lib/posts";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader
        eyebrow="The journal"
        title="Writing on software, craft, and the long way around"
        sub="Field notes from building things — the successes, the failures, and the experiences gained along the way. New entries land here first."
      />
      <div className="atmo-wrap">
        <MarginField maxWidth={1080} />
        <div className="atmo-content">
          <JournalIndex
            posts={posts.map(toPostMeta)}
            popular={getPopularPosts(posts).map(toPostMeta)}
            categories={getCategories(posts)}
          />
          <section className="page-cta">
        <div className="journal-shell journal-grid journal-cta-grid">
          <div className="j-list">
            <NewsletterCard />
          </div>
          <div className="j-rail-col" aria-hidden="true"></div>
        </div>
          </section>
        </div>
      </div>
    </>
  );
}