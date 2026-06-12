"use client";

import { useSyncExternalStore } from "react";

// Shared scroll plumbing for the post progress bar + TOC reading %.
// useSyncExternalStore (not useEffect+setState) — set-state-in-effect is
// error-level in eslint-config-next@16 (see BUILD_PLAN Phase 1 notes).
export function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function getScrollPct() {
  const h = document.documentElement;
  const total = h.scrollHeight - h.clientHeight;
  return total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0;
}

export function useScrollProgress(): number {
  return useSyncExternalStore(subscribeToScroll, getScrollPct, () => 0);
}