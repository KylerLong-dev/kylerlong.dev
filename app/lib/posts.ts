import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

// Journal content lives outside app/ so route changes never touch posts.
const POSTS_DIR = path.join(process.cwd(), "content", "journal");

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  tags: string[];
  category: string;
};

export type Post = PostFrontmatter & {
  content: string;
  readMinutes: number;
};

// Serializable shape passed to client components (journal index/rail).
export type PostMeta = PostFrontmatter & {
  readMinutes: number;
  dateFormatted: string;
};

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

// Curated "Popular reads" — prototype order (journal-app.jsx POPULAR).
const POPULAR_SLUGS = [
  "why-i-rewrote-my-markdown-pipeline-again",
  "what-home-health-pt-taught-me-about-edge-cases",
  "a-small-note-on-cache-lifetimes-in-the-app-router",
  "why-i-keep-rewriting-things-i-already-wrote",
];

// gray-matter parses unquoted YAML dates into Date objects; normalize both
// shapes back to ISO yyyy-mm-dd so the rest of the app sees one format.
function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

// ~200 wpm over the raw source (code + prose), matching the editorial
// "n min read" convention; never less than 1.
function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(iso: string): string {
  // Anchor to UTC noon so the rendered day never shifts across timezones.
  const date = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getAllPosts(): Post[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as Omit<PostFrontmatter, "date"> & { date: unknown };
    return {
      ...fm,
      date: normalizeDate(fm.date),
      content,
      readMinutes: readingMinutes(content),
    };
  });

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function toPostMeta(post: Post): PostMeta {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags,
    category: post.category,
    readMinutes: post.readMinutes,
    dateFormatted: formatDate(post.date),
  };
}

// 'all' + categories in first-appearance order over the date-sorted list
// (yields all · next.js · craft · process with the current content).
export function getCategories(posts: Post[]): string[] {
  const seen: string[] = [];
  for (const post of posts) {
    if (!seen.includes(post.category)) seen.push(post.category);
  }
  return ["all", ...seen];
}

export function getPopularPosts(posts: Post[]): Post[] {
  return POPULAR_SLUGS.map((slug) =>
    posts.find((post) => post.slug === slug),
  ).filter((post): post is Post => Boolean(post));
}

// Build the TOC from the raw MDX. Uses github-slugger — the same slugger
// rehype-slug runs over the rendered heading text — so ids match the DOM.
export function extractHeadings(content: string): PostHeading[] {
  const slugger = new GithubSlugger();
  // Drop fenced code blocks so `## comments` inside code don't register.
  const withoutCode = content.replace(/^```[\s\S]*?^```/gm, "");
  const headings: PostHeading[] = [];

  for (const match of withoutCode.matchAll(/^(#{2,3})\s+(.+?)\s*$/gm)) {
    const level = match[1].length as 2 | 3;
    // Strip inline markdown (code ticks, emphasis, links) to the text that
    // rehype-slug will actually see.
    const text = match[2]
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1")
      .trim();
    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}