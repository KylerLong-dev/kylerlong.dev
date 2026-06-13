"use client";

import { useSyncExternalStore } from "react";

// True only when the decorative canvases should run: a fine pointer AND motion
// is allowed. SSR + first client render return false (the server can't know),
// so canvas fields mount after hydration — fine for a behind-content, purely
// decorative layer, and matches our useSyncExternalStore pattern elsewhere.
const QUERIES = ["(pointer: coarse)", "(prefers-reduced-motion: reduce)"];

function subscribe(onChange: () => void) {
  const mqls = QUERIES.map((q) => window.matchMedia(q));
  mqls.forEach((m) => m.addEventListener("change", onChange));
  return () => mqls.forEach((m) => m.removeEventListener("change", onChange));
}

function getSnapshot() {
  return !QUERIES.some((q) => window.matchMedia(q).matches);
}

export function useAtmosphere() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}