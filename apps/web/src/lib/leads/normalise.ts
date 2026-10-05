import { parsePhoneNumberFromString } from "libphonenumber-js";

/** Rejects 0000000000, 1111111111 and similar placeholder input that is
 *  structurally "possible" but obviously not a real number. */
function isRepeatedDigits(e164: string): boolean {
  const digits = e164.replace(/\D/g, "").slice(2);
  return digits.length > 0 && /^(\d)\1+$/.test(digits);
}

/**
 * Normalises a UK-or-international mobile to E.164. Accepts the formats people
 * actually type on a phone at an event — "07700 900123", "+44 7700 900123",
 * "(0)7912-345678", "0791 234 5678".
 *
 * Gated on `isPossible()` rather than `isValid()` deliberately. `isValid()`
 * checks the number against currently-allocated ranges in libphonenumber's
 * bundled metadata, which goes stale: it rejects Ofcom's reserved ranges and
 * would also reject a genuine customer whose range is newer than our last
 * dependency bump. For a commercial lead form, losing a real enquiry costs far
 * more than storing an unusual number, so we accept anything structurally
 * possible for its country and reject only true garbage.
 */
export function normaliseMobile(input: string): string | null {
  const cleaned = input.replace(/[^\d+]/g, "");
  if (cleaned.length < 7) return null;

  const parsed = parsePhoneNumberFromString(cleaned, "GB");
  if (!parsed || !parsed.isPossible()) return null;
  if (isRepeatedDigits(parsed.number)) return null;

  return parsed.number;
}

/** Lowercase + trim for indexed lookup. The original casing is kept separately. */
export function normaliseEmail(input: string): string {
  return input.trim().toLowerCase();
}

/** Collapses runs of whitespace so names and company names store cleanly. */
export function collapseWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
