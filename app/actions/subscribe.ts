"use server";

import { headers } from "next/headers";

// Server Action that proxies a newsletter signup to Buttondown. Runs only on
// the server (Vercel), so BUTTONDOWN_API_KEY never reaches the browser and raw
// provider errors are never leaked to the client. Shaped for React 19
// `useActionState`: (prevState, formData) => newState.

const ENDPOINT = "https://api.buttondown.com/v1/subscribers";
// Basic shape check only — Buttondown does the authoritative validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Double opt-in is ON in Buttondown, so a new signup is *pending* until they
// click the confirm email — the copy must say so, not "you're on the list".
const CONFIRM_MESSAGE = "Check your inbox to confirm your subscription.";
const ALREADY_MESSAGE = "You’re already subscribed — thanks for reading.";
const INVALID_MESSAGE = "Please enter a valid email address.";
const GENERIC_ERROR = "Something went wrong. Please try again.";

export type SubscribeState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // Honeypot: a visually-hidden field real users never fill. If it has a value
  // it's almost certainly a bot — return success silently (no signal) and never
  // touch Buttondown.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", message: CONFIRM_MESSAGE };
  }

  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "error", message: INVALID_MESSAGE };
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    // Misconfiguration — log for us, stay generic for the visitor.
    console.error("[subscribe] BUTTONDOWN_API_KEY is not set");
    return { status: "error", message: GENERIC_ERROR };
  }

  // First forwarded IP, passed to Buttondown for its own spam scoring.
  const fwd = (await headers()).get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || undefined;

  const payload: Record<string, unknown> = { email_address: email };
  if (ip) payload.ip_address = ip;
  // NOTE: no `type` field — omitting it preserves Buttondown's double opt-in.

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[subscribe] network error", err);
    return { status: "error", message: GENERIC_ERROR };
  }

  if (res.status === 201) {
    return { status: "success", message: CONFIRM_MESSAGE };
  }

  // A 400 is ambiguous: it's either a collision (already subscribed) or an
  // invalid address. Buttondown doesn't use distinct status codes, so inspect
  // the JSON body to tell them apart.
  if (res.status === 400) {
    const body = await safeJson(res);
    const code = typeof body?.code === "string" ? body.code.toLowerCase() : "";
    const detail =
      typeof body?.detail === "string" ? body.detail.toLowerCase() : "";
    const alreadySubscribed =
      code.includes("exist") ||
      code.includes("already") ||
      detail.includes("already subscribed");
    if (alreadySubscribed) {
      return { status: "success", message: ALREADY_MESSAGE };
    }
    return { status: "error", message: INVALID_MESSAGE };
  }

  // 401/403 (bad key), 429 (rate limit), 5xx, anything else — don't surface
  // provider specifics; log the status for us and show a generic message.
  console.error("[subscribe] unexpected response status", res.status);
  return { status: "error", message: GENERIC_ERROR };
}
