/**
 * Exponential backoff with full jitter. Jitter matters: without it every event
 * queued during a provider outage retries in lockstep and hammers the provider
 * the moment it recovers.
 */
const BASE_MS = 30_000;
const CAP_MS = 60 * 60 * 1000;

export function nextRetryDelay(attempt: number): number {
  const exponential = Math.min(CAP_MS, BASE_MS * 2 ** Math.max(0, attempt - 1));
  return Math.floor(exponential / 2 + Math.random() * (exponential / 2));
}

export function nextRetryAt(attempt: number, from = Date.now()): Date {
  return new Date(from + nextRetryDelay(attempt));
}

/** 4xx from a provider will never succeed on retry; 429 and 5xx will. */
export function isRetryableStatus(status: number | undefined): boolean {
  if (status === undefined) return true; // unknown outcome — assume transient
  if (status === 429) return true;
  return status >= 500;
}
