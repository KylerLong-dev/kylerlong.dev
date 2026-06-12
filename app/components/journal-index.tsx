"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostMeta } from "../lib/posts";

// Journal list + sticky rail. Client component for the topic-chip filter
// (local state, no URL params — matches the prototype's behavior).

function JournalItem({ post }: { post: PostMeta }) {
  const href = `/journal/${post.slug}`;
  return (
    <article className="j-item">
      <div className="j-meta">
        <time dateTime={post.date}>{post.dateFormatted}</time>
        <span className="j-meta-dot" />
        <span className="j-cat">{post.category}</span>
        <span className="j-meta-dot" />
        <span>{post.readMinutes} min read</span>
      </div>
      <h2 className="j-title">
        <Link href={href}>{post.title}</Link>
      </h2>
      <p className="j-excerpt">{post.excerpt}</p>
      <Link href={href} className="j-readmore">
        Read more
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </article>
  );
}

export function JournalIndex({
  posts,
  popular,
  categories,
}: {
  posts: PostMeta[];
  popular: PostMeta[];
  categories: string[];
}) {
  const [activeCat, setActiveCat] = useState("all");
  const shown =
    activeCat === "all"
      ? posts
      : posts.filter((post) => post.category === activeCat);

  return (
    <main className="journal-shell journal-grid">
      <div className="j-list">
        {shown.length === 0 ? (
          <p className="j-empty">No entries in this topic yet.</p>
        ) : (
          shown.map((post) => <JournalItem key={post.slug} post={post} />)
        )}
      </div>
      <aside className="j-rail-col">
        <div className="j-rail">
          <div className="j-rail-block">
            <div className="j-rail-label">Browse by topic</div>
            <div className="topic-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`topic-chip ${cat === activeCat ? "active" : ""}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="j-rail-block">
            <div className="j-rail-label">Popular reads</div>
            <ol className="popular-list">
              {popular.map((post, i) => (
                <li key={post.slug} className="popular-item">
                  <span className="popular-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link href={`/journal/${post.slug}`} className="popular-body">
                    <span className="popular-title">{post.title}</span>
                    <span className="popular-meta">
                      {post.category} · {post.readMinutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>
    </main>
  );
}