import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import { CurveDivider } from "../../components/curve-divider";
import { NewsletterCard } from "../../components/newsletter-card";
import { ProgressBar } from "../../components/progress-bar";
import { Toc } from "../../components/toc";
import { mdxComponents } from "../../components/mdx-components";
import { codeThemeDark, codeThemeLight } from "../../lib/shiki-themes";
import {
  extractHeadings,
  formatDate,
  getAllPosts,
  getPostBySlug,
} from "../../lib/posts";

const prettyCodeOptions: Options = {
  theme: { dark: codeThemeDark, light: codeThemeLight },
  keepBackground: false,
  defaultLang: "txt",
};

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  // Keep TS happy about plugin tuples without fighting unified's types.
} as React.ComponentProps<typeof MDXRemote>["options"];

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <>
      <ProgressBar />

      <header className="page-band post-band">
        {/* Atmosphere layers (Stars/Clouds) arrive in Phase 5. */}
        <div className="post-band-grid">
          <div className="post-band-col">
            <h1 className="post-title">{post.title}</h1>
            <p className="post-description">{post.excerpt}</p>
            <div className="post-meta">
              <span className="author">
                <span className="avatar">KL</span>
                Kyler Long
              </span>
              <span className="meta-sep" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>
        </div>
        <CurveDivider />
      </header>

      <div className="post-shell">
        <main className="post-main">
          <div className="post-topbar">
            <Link href="/journal" className="back-link">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              back to journal
            </Link>
            {/* No series data in frontmatter — the category fills the
                eyebrow slot instead (Kyler-approved deviation). */}
            <div className="post-eyebrow">
              <span className="series-tag">{post.category}</span>
            </div>
          </div>
          <article className="prose">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={mdxOptions}
            />
          </article>
        </main>

        <aside className="post-rail-right">
          <Toc items={headings} readMinutes={post.readMinutes} />
        </aside>
      </div>

      <section className="page-cta">
        <div className="post-shell post-cta-shell">
          <div className="post-main" style={{ padding: 0 }}>
            <NewsletterCard />
          </div>
          <div className="post-rail-right" aria-hidden="true"></div>
        </div>
      </section>
    </>
  );
}