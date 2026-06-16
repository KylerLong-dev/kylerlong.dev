import type { MetadataRoute } from "next";
import { getAllPosts } from "./lib/posts";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
      { url: `${SITE_URL}/journal`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ] as const
  ).map((entry) => ({ ...entry, lastModified: now }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    lastModified: new Date(`${post.date}T12:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...posts];
}
