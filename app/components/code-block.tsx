"use client";

import { useRef, useState } from "react";

// Wraps the <figure> emitted by rehype-pretty-code: keeps its children
// (figcaption title + highlighted <pre>) and adds the copy button from the
// prototype's CodeBlock. Non-pretty-code figures pass through untouched.
export function CodeBlockFigure(
  props: React.ComponentPropsWithoutRef<"figure">,
) {
  const figureRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const isCodeFigure = "data-rehype-pretty-code-figure" in props;
  if (!isCodeFigure) return <figure {...props} />;

  const copy = () => {
    const code = figureRef.current?.querySelector("pre code");
    if (!code) return;
    // innerText keeps line breaks and skips the CSS-counter line numbers.
    navigator.clipboard?.writeText((code as HTMLElement).innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const { children, ...rest } = props;
  return (
    <figure {...rest} ref={figureRef} className="codeblock">
      {children}
      <button
        type="button"
        className={`codeblock-copy ${copied ? "copied" : ""}`}
        onClick={copy}
        aria-label="Copy code"
      >
        {copied ? (
          <>
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
            copied
          </>
        ) : (
          <>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            copy
          </>
        )}
      </button>
    </figure>
  );
}