"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";

const LINKS = [
  { href: "/journal", label: "journal" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

// True only after the client takes over. useSyncExternalStore gives `false` on
// the server and first hydration render, then `true` — hydration-safe with no
// setState-in-effect (which is an error under react-hooks rules here).
const subscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  // Active = current section (also matches nested routes like /journal/[slug]).
  const activeHref = LINKS.find(
    (l) => pathname === l.href || pathname?.startsWith(`${l.href}/`),
  )?.href;

  // next-themes reads localStorage synchronously, so resolvedTheme can already
  // be "light" on the client's first render while the server rendered "dark".
  // Render the server value ("dark") until the client takes over to avoid a
  // hydration mismatch, then swap to the real theme. The mobile menu closes via
  // the nav-links container's onClick when any link is tapped.
  const themeClass = isClient ? resolvedTheme ?? "dark" : "dark";

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          kylerlong<span className="dot">.</span>dev
        </Link>

        <div
          className={`nav-links ${open ? "open" : ""}`}
          onClick={() => setOpen(false)}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${activeHref === l.href ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className={`theme-toggle ${themeClass}`}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <span className="theme-icon">
              <svg
                className="ti-sun"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
              <svg
                className="ti-moon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
          </button>

          <button
            type="button"
            className={`nav-burger ${open ? "open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className="burger-box">
              <span className="burger-bar burger-bar-top" />
              <span className="burger-bar burger-bar-mid" />
              <span className="burger-bar burger-bar-bot" />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}