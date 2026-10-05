/** Campaign attribution we are willing to store. Anything else is discarded. */
export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const MAX_VALUE_LENGTH = 64;

/** Keeps only safe characters: attribution is untrusted marketing input that
 *  ends up in an internal email and a jsonb column. */
function clean(value: string): string | null {
  const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
  if (!trimmed) return null;
  return /^[\w.\-+ ]+$/.test(trimmed) ? trimmed : null;
}

type RawParams = Record<string, string | string[] | undefined>;

/** Server-side read from a page's resolved searchParams. */
export function readAttribution(params: RawParams): Attribution {
  const out: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const raw = params[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value !== "string") continue;
    const safe = clean(value);
    if (safe) out[key] = safe;
  }
  return out;
}

/** Re-validated on submit: the hidden inputs are client-controlled. */
export function readAttributionFromForm(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = formData.get(key);
    if (typeof value !== "string") continue;
    const safe = clean(value);
    if (safe) out[key] = safe;
  }
  return out;
}
