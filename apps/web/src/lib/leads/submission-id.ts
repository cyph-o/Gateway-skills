import { createHash } from "node:crypto";

const WINDOW_MS = 10 * 60 * 1000;

/** Formats 32 hex characters as a UUID so it fits the uuid column. */
function asUuid(hex: string): string {
  const h = hex.slice(0, 32);
  return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20, 32)].join(
    "-",
  );
}

export interface DerivedIdParts {
  campaign: string;
  email: string;
  mobileNumber: string;
}

/**
 * Fallback idempotency key for submissions that arrive without a client-issued
 * id — which is exactly the no-JavaScript path, where nothing can generate one.
 *
 * Derived from the enquiry's own content plus a 10-minute window, so a
 * double-submit collapses into one lead while a genuine enquiry made later the
 * same day is correctly treated as new.
 */
export function deriveSubmissionId(parts: DerivedIdParts, now = Date.now()): string {
  const window = Math.floor(now / WINDOW_MS);
  const digest = createHash("sha256")
    .update(
      [parts.campaign, parts.email.toLowerCase(), parts.mobileNumber, String(window)].join("|"),
    )
    .digest("hex");
  return asUuid(digest);
}
