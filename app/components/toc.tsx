"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { PostHeading } from "../lib/posts";
import { subscribeToScroll, useScrollProgress } from "./use-scroll-progress";

// Sticky "On this page" rail: scroll-spy active section + reading %.
// Active heading = last one whose top has passed 120px from the viewport
// top (same rule as the prototype app.jsx).
export function Toc({
  items,
  readMinutes,
}: {
  items: PostHeading[];
  readMinutes: number;
}) {
  const pct = useScrollProgress();

  const getActiveId = useCallback(() => {
    let current = items[0]?.id ?? "";
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top - 120 <= 0) current = it.id;
      else break;
    }
    return current;
  }, [items]);

  const activeId = useSyncExternalStore(
    subscribeToScroll,
    getActiveId,
    () => items[0]?.id ?? "",
  );

  // Mirror the active id onto the heading itself — .prose h2.active shows
  // the accent bullet in the article margin.
  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    els.forEach((el) => el.classList.toggle("active", el.id === activeId));
    return () => els.forEach((el) => el.classList.remove("active"));
  }, [items, activeId]);

  return (
    <div className="toc">
      <div className="toc-label">On this page</div>
      <ul className="toc-list">
        {items.map((it) => (
          <li
            key={it.id}
            className={`toc-item ${activeId === it.id ? "active" : ""}`}
          >
            <a
              href={`#${it.id}`}
              className={`toc-link ${it.level === 3 ? "h3" : ""}`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
      <div className="toc-reading-time">
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>
          <span className="pct">{Math.round(pct)}%</span> · {readMinutes} min
          read
        </span>
      </div>
    </div>
  );
}