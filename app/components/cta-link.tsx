import Link from "next/link";
import type { LinkMeta } from "../lib/projects";

// Diagonal up-right arrow; rotates 45° to horizontal on hover (CSS).
function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

// Only the link text is the click target. Internal (case-study) → Next Link;
// external (live) → new tab.
export function CtaLink({
  meta,
  className,
}: {
  meta: LinkMeta;
  className: string;
}) {
  if (meta.external) {
    return (
      <a className={className} href={meta.href} target="_blank" rel="noopener">
        {meta.label}
        <LinkIcon />
      </a>
    );
  }
  return (
    <Link className={className} href={meta.href}>
      {meta.label}
      <LinkIcon />
    </Link>
  );
}