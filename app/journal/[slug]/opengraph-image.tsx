import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "../../lib/og";
import { formatDate, getAllPosts, getPostBySlug } from "../../lib/posts";

export const alt = "Journal — Kyler Long";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Pre-generate one card per post at build time (matches the page's params).
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return ogImage({
      eyebrow: "Journal",
      title: "Kyler Long",
      meta: "kylerlong.dev",
    });
  }

  return ogImage({
    eyebrow: post.category,
    title: post.title,
    meta: `kylerlong.dev · ${formatDate(post.date)}`,
  });
}
