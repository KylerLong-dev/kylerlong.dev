"use client";

import { useState } from "react";

// Standalone newsletter card — used on interior pages above the footer and
// (Phase 4) matching the home page's section-05 card. Submit is a local
// success state for now; real subscribe wiring is a later concern.
export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

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
        {done ? (
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
            You&rsquo;re on the list — thanks for reading.
          </div>
        ) : (
          <form className="nl-card-form" onSubmit={submit}>
            <input
              type="email"
              className="nl-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="nl-btn">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}