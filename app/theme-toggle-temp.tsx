"use client";

// TEMPORARY — Phase 0 smoke test only. Replaced by the real animated
// sun⇄moon toggle in <Nav> (Phase 1). Delete this file then.

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggleTemp() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // resolvedTheme is unknown on the server; render after mount to avoid a
  // hydration mismatch on the label.
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-sm text-fg transition-colors hover:border-accent hover:text-accent"
    >
      toggle theme — now: {resolvedTheme}
    </button>
  );
}