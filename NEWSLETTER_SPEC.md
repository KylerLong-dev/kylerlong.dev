# Newsletter Subscription — Spec & Task List

Status: **planned, not started.** Created 2026-06-22. Pick this up when ready.

## Goal
Turn the journal's newsletter form from a fake (local-only) success state into a real
subscription that adds confirmed subscribers to an email list, without leaking secrets
to the browser and without abandoning the custom `nl-card` design.

## Current state (what exists today)
- `app/components/newsletter-card.tsx` — `"use client"` form. On submit it only flips a
  local `done` state to `true`. Nothing is sent anywhere. States: idle / done only (no
  loading, no error).
- One shared component, reused on **all four pages** — wiring it once covers everything:
  - `app/page.tsx:207` (home, section-05)
  - `app/contact/page.tsx:75`
  - `app/journal/page.tsx:42`
  - `app/journal/[slug]/page.tsx:155`
- Styling: `nl`, `nl-card`, `nl-card-form`, `nl-input`, `nl-btn`, `nl-done` classes in
  `app/globals.css` (will likely need a new `nl-error` style).
- RSS already published at `/feed.xml` (enables provider RSS-to-email later).

## Decisions already made
- **Provider: Buttondown.** Developer-first REST API; handles double opt-in, unsubscribe,
  and compliance; can auto-draft/send issues from our existing `/feed.xml`.
- **Architecture: Next.js Server Action proxy.** Form → server action (runs on Vercel,
  holds the secret key) → POST to Buttondown → returns status. Browser never sees the key.
  React 19 `useActionState` + progressive enhancement. (Route Handler is the fallback if a
  plain endpoint is ever wanted.)
- **Double opt-in: ON.** Buttondown sends the confirm email. Success copy must say
  "check your inbox to confirm," not "you're on the list."
- **Addresses** (see CLAUDE.md placeholders):
  - `hello@kylerlong.dev` → general contact (already wired into `mailto:` links).
  - `journal@kylerlong.dev` → newsletter "from" address (set in Buttondown, not in code).

## Prerequisites — Kyler's manual steps (Claude can't do these)
1. **Receiving inbox.** Set up free **Cloudflare Email Routing** for `kylerlong.dev`
   → forward `hello@` and `journal@` to the personal Gmail. (Confirm where the domain's
   DNS is managed — Cloudflare / Vercel / registrar — that's where records go.)
2. **Buttondown account.** Sign up (login email can be the existing Gmail).
3. **Domain authentication in Buttondown.** Add the DKIM/SPF DNS records it provides so it
   can send as `journal@kylerlong.dev`. Set that as the from-address.
4. **API key.** Copy from Buttondown settings → put in `.env.local` as
   `BUTTONDOWN_API_KEY=...` (never commit) and add the same var in Vercel project settings.

## Implementation tasks (Claude, once the API key exists)
- [ ] **1. Server action** — `app/actions/subscribe.ts`
  - Reads `BUTTONDOWN_API_KEY` from `process.env` (server-only).
  - Validates email (basic shape) and rejects empty.
  - Honeypot check: if the hidden field is filled, return success silently (don't POST).
  - `POST https://api.buttondown.com/v1/subscribers` with `Authorization: Token <key>`,
    body `{ email_address, tags?: ["journal"] }`.
  - Map responses → typed result `{ ok: true } | { ok: false, error }`:
    - 201 created → ok (pending confirmation).
    - already-subscribed → friendly "you're already subscribed."
    - invalid email / other 4xx → user-facing error.
    - network/5xx → generic "something went wrong, try again."
  - No secrets or raw provider errors leaked to the client.
- [ ] **2. Wire the form** — `app/components/newsletter-card.tsx`
  - Switch to `useActionState` against the server action (keep it a client component for
    pending UI; form still works without JS).
  - Add **pending** (disable button / "Subscribing…") and **error** states (the component
    currently has neither).
  - Update success copy → "Check your inbox to confirm your subscription."
  - Add the hidden honeypot input (visually hidden, `aria-hidden`, `tabindex=-1`,
    `autocomplete=off`).
- [ ] **3. Styles** — `app/globals.css`
  - Add `nl-error` style (matching the design language of `nl-done`).
  - Style/disable state for the button while pending.
- [ ] **4. Env docs** — note `BUTTONDOWN_API_KEY` in CLAUDE.md and `.env.example` if we add one.
- [ ] **5. (Optional, later) RSS-to-email** — configure Buttondown to draft issues from
  `/feed.xml` so writing an MDX post can become the newsletter. Provider-side config, no code.

## Hardening
- Honeypot field (covered above) — primary spam defense, cheap.
- Light rate limiting on the action (Vercel KV or in-memory) — optional for a personal site;
  defer unless abuse shows up.
- Keep double opt-in on for deliverability + GDPR.

## Acceptance criteria
- [ ] Submitting a valid email on any of the four pages creates a *pending* subscriber in
  Buttondown and the visitor receives a confirmation email.
- [ ] Confirming the email moves them to active/confirmed in Buttondown.
- [ ] Invalid email shows an inline error; duplicate shows the "already subscribed" message.
- [ ] Button shows a pending state during submit; form is keyboard-usable; no layout shift.
- [ ] No API key or raw provider error is ever present in client JS / network response body.
- [ ] Works with JavaScript disabled (progressive enhancement) — degrades, doesn't break.
- [ ] `prefers-reduced-motion` respected for any new transitions.

## Open questions / to confirm before building
- Where is `kylerlong.dev` DNS managed? (affects steps 1 & 3)
- Tag subscribers (`["journal"]`) or single untagged list? (default: tag `journal`)
- Any extra fields to collect later (name)? (default: email only)

## References
- Buttondown API: https://docs.buttondown.com/api-introduction
- Cloudflare Email Routing: https://developers.cloudflare.com/email-routing/
- Next.js Server Actions / forms: https://nextjs.org/docs/app/guides/forms