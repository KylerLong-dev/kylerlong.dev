import type { Metadata } from "next";

// Canonical site identity — single source for absolute URLs and shared copy
// used by metadata, the sitemap, robots, the RSS feed, and OG image cards.
export const SITE_URL = "https://kylerlong.dev";
export const SITE_NAME = "Kyler Long";
export const SITE_TAGLINE = "software developer & physical therapist";
export const SITE_DESCRIPTION =
  "Personal site and journal of Kyler Long — software developer and home-health physical therapist in Orlando, FL.";
export const FEED_PATH = "/feed.xml";

// RSS autodiscovery link, attached to every route's <head> via `alternates`.
export const RSS_ALTERNATE = { "application/rss+xml": FEED_PATH };

// Per-page metadata for the interior routes: sets the <title> (via the root
// template), description, canonical, and matching OpenGraph/Twitter cards.
// Paths are relative — resolved against `metadataBase` in the root layout.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const ogTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path, types: RSS_ALTERNATE },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: ogTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: ogTitle, description },
  };
}
