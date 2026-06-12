"use client";

import { useScrollProgress } from "./use-scroll-progress";

// Fixed accent bar at the very top of the post page; width tracks scroll.
export function ProgressBar() {
  const pct = useScrollProgress();
  return (
    <div
      className="progress-bar"
      style={{ width: `${pct}%` }}
      aria-hidden="true"
    />
  );
}