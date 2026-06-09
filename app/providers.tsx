"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  // attribute="data-theme" matches the token selectors in globals.css.
  // No disableTransitionOnChange — we WANT the body's 0.2s color transition.
  // next-themes injects its own pre-paint script, so no manual no-flash script.
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  );
}