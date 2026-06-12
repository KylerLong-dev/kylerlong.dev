import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { CodeBlockFigure } from "./code-block";

/* MDX element + custom-component map for journal posts, recreated from
   design-reference/components.jsx + post-content.jsx. Everything here is a
   Server Component except the code-block figure (copy button). */

type CalloutType = "note" | "warn" | "tip";

const calloutIcons: Record<CalloutType, React.ReactNode> = {
  note: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  warn: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  tip: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6M10 22h4M15 14a5 5 0 1 0-6 0c1 1 1.5 2 1.5 3h3c0-1 .5-2 1.5-3z" />
    </svg>
  ),
};

const calloutLabels: Record<CalloutType, string> = {
  note: "Note",
  warn: "Warning",
  tip: "Tip",
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`callout callout-${type}`}>
      <div className="callout-icon">{calloutIcons[type]}</div>
      <div className="callout-body">
        <strong>{title || calloutLabels[type]}</strong>
        {children}
      </div>
    </div>
  );
}

export function Figure({
  children,
  caption,
  label = "Fig.",
}: {
  children: React.ReactNode;
  caption: string;
  label?: string;
}) {
  return (
    <figure className="figure">
      <div className="figure-img terminal">{children}</div>
      <figcaption>
        <span className="label">{label}</span>
        {caption}
      </figcaption>
    </figure>
  );
}

export function Tweet({
  name,
  handle,
  date,
  children,
}: {
  name: string;
  handle: string;
  date: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tweet">
      <div className="tweet-header">
        <div className="tweet-avatar" />
        <div className="tweet-meta">
          <span className="tweet-name">{name}</span>
          <span className="tweet-handle">@{handle}</span>
        </div>
      </div>
      <div className="tweet-body">{children}</div>
      <div className="tweet-footer">
        <span>{date}</span>
        <svg className="tweet-logo" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    </div>
  );
}

// Footnote reference — pairs with the manual footnotes <section> at the end
// of a post (ids fn-N / fn-ref-N).
export function FN({ n }: { n: number }) {
  return (
    <a href={`#fn-${n}`} id={`fn-ref-${n}`} className="footnote-ref">
      [{n}]
    </a>
  );
}

// Static, illustrative "build output" terminal panel used inside <Figure>
// in the sample post (from post-content.jsx).
export function BuildOutput() {
  const lines = [
    { t: "$", body: "pnpm build:posts", mute: false, accent: false },
    { t: " ", body: "", mute: true, accent: false },
    { t: "✓", body: "compiled 40 posts", mute: false, accent: true },
    {
      t: "·",
      body: "shiki warming up……………………………………………… 412ms",
      mute: true,
      accent: false,
    },
    {
      t: "·",
      body: "mdx compile ………………………………………………………… 287ms",
      mute: true,
      accent: false,
    },
    {
      t: "·",
      body: "write artifacts …………………………………………………… 96ms",
      mute: true,
      accent: false,
    },
    { t: " ", body: "", mute: true, accent: false },
    { t: "✓", body: "done in 795ms", mute: false, accent: true },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "24px 32px",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 12,
            color: l.mute ? "var(--text-3)" : "var(--text)",
          }}
        >
          <span
            style={{
              color:
                l.accent || l.t === "$" ? "var(--accent)" : "var(--text-3)",
              width: 12,
            }}
          >
            {l.t}
          </span>
          <span>{l.body}</span>
        </div>
      ))}
    </div>
  );
}

export const mdxComponents: MDXRemoteProps["components"] = {
  Callout,
  Figure,
  Tweet,
  FN,
  BuildOutput,
  // rehype-pretty-code emits <figure data-rehype-pretty-code-figure> around
  // each fence; the client wrapper adds the copy button.
  figure: CodeBlockFigure,
};