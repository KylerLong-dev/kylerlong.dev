import { getAllPosts } from "../lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/site";

// Prerender to a static file at build time (content only changes on rebuild).
export const dynamic = "force-static";

const ESCAPES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
};
const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => ESCAPES[char]);

const toRfc822 = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toUTCString();

export function GET() {
  const posts = getAllPosts();
  const lastBuildDate = posts[0]
    ? toRfc822(posts[0].date)
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/journal/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Journal</title>
    <link>${SITE_URL}/journal</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
