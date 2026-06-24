"use client";

import { useActionState, useState } from "react";
import { subscribe } from "../actions/subscribe";

// Standalone newsletter card — used on interior pages above the footer and the
// home page's section-05 card. Submits through the `subscribe` Server Action
// (which proxies Buttondown). React 19 `useActionState` drives pending/error
// state; the plain <form action> means it still works with JavaScript disabled.
export function NewsletterCard() {
  // Controlled so a typed address survives an inline error (the action keeps the
  // form mounted on error; on success we swap to the done state below).
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(subscribe, {
    status: "idle",
  });

  return (
    <div className="nl nl-card">
      <div className="nl-card-icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>
      <div className="nl-card-body">
        <div className="nl-card-title">Subscribe to the journal</div>
        <div className="nl-card-sub">
          New posts on software, craft, and the occasional detour — straight to
          your inbox. No more than a couple times a month.
        </div>
        {state.status === "success" ? (
          <div className="nl-done">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {state.message}
          </div>
        ) : (
          <>
            <form className="nl-card-form" action={formAction}>
              {/* Honeypot: hidden from users + AT; bots that fill it are dropped
                  server-side. Inline-styled so it's hidden regardless of CSS. */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label>
                  Leave this field empty
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>
              <input
                type="email"
                name="email"
                className="nl-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                autoComplete="email"
                required
                disabled={pending}
              />
              <button type="submit" className="nl-btn" disabled={pending}>
                {pending ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            {state.status === "error" && (
              <div className="nl-error" role="alert">
                {state.message}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}