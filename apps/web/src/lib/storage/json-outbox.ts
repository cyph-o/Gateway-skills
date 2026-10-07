import type { OutboxRecord } from "./types";
import type { Shape } from "./json-shape";

/**
 * Outbox and rate-limit mutations for the JSON driver, as plain functions over
 * the loaded document. The store calls them inside its serialised
 * read-modify-write, which is what makes them atomic — they must never read or
 * write the file themselves.
 */

/** Claims due entries by marking them processing, so a second drain running
 *  concurrently cannot pick up the same work. */
export function claimDue(data: Shape, limit: number, now = Date.now()): OutboxRecord[] {
  const due = data.outbox
    .filter((e) => (e.state === "pending" || e.state === "failed") && Date.parse(e.nextRetryAt) <= now)
    .sort((a, b) => a.nextRetryAt.localeCompare(b.nextRetryAt))
    .slice(0, limit);
  for (const entry of due) {
    entry.state = "processing";
    entry.attempts += 1;
  }
  // Copies, so a caller mutating a result cannot corrupt the document.
  return due.map((e) => ({ ...e }));
}

export function markSent(data: Shape, id: string, providerMessageId?: string): void {
  const entry = data.outbox.find((e) => e.id === id);
  if (!entry) return;
  entry.state = "sent";
  entry.completedAt = new Date().toISOString();
  entry.lastError = null;
  entry.providerMessageId = providerMessageId ?? null;
}

export function markFailed(
  data: Shape,
  id: string,
  error: string,
  dead: boolean,
  nextRetryAt: Date,
): void {
  const entry = data.outbox.find((e) => e.id === id);
  if (!entry) return;
  entry.state = dead ? "dead_letter" : "failed";
  entry.lastError = error.slice(0, 1000);
  entry.completedAt = dead ? new Date().toISOString() : null;
  if (!dead) entry.nextRetryAt = nextRetryAt.toISOString();
}

/** Fixed-window counter. Returns the count after incrementing. */
export function hitBucket(data: Shape, bucket: string, windowStart: Date): number {
  const key = windowStart.toISOString();
  const row = data.rateLimits.find((r) => r.bucket === bucket && r.windowStart === key);
  if (row) {
    row.count += 1;
    return row.count;
  }
  data.rateLimits.push({ bucket, windowStart: key, count: 1 });
  return 1;
}

export function pruneBuckets(data: Shape, before: Date): void {
  data.rateLimits = data.rateLimits.filter((r) => Date.parse(r.windowStart) >= before.getTime());
}
