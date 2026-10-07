import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { emailDeliveries, outboxEvents, rateLimitCounters } from "@/db/schema";
import type { OutboxRecord } from "./types";

/**
 * Outbox and rate-limit queries for the Postgres driver, kept apart from the
 * lead queries so each file stays readable. The store delegates to them.
 */

export async function claimDueOutbox(limit: number): Promise<OutboxRecord[]> {
  const result = await db().execute(sql`
    UPDATE outbox_events SET state = 'processing', attempts = attempts + 1
    WHERE id IN (
      SELECT id FROM outbox_events
      WHERE state IN ('pending', 'failed') AND next_retry_at <= now()
      ORDER BY next_retry_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    )
    RETURNING id, lead_id AS "leadId", type, state, attempts,
              next_retry_at AS "nextRetryAt", last_error AS "lastError",
              created_at AS "createdAt", completed_at AS "completedAt"
  `);
  const rows = Array.isArray(result) ? result : ((result as { rows?: unknown[] }).rows ?? []);
  return (rows as Record<string, unknown>[]).map((r) => ({
    id: String(r.id),
    leadId: String(r.leadId),
    type: "lead_notification",
    state: r.state as OutboxRecord["state"],
    attempts: Number(r.attempts),
    nextRetryAt: new Date(r.nextRetryAt as string).toISOString(),
    lastError: (r.lastError as string) ?? null,
    providerMessageId: null,
    createdAt: new Date(r.createdAt as string).toISOString(),
    completedAt: r.completedAt ? new Date(r.completedAt as string).toISOString() : null,
  }));
}

export async function markOutboxSent(id: string, providerMessageId?: string) {
  await db().transaction(async (tx) => {
    await tx
      .update(outboxEvents)
      .set({ state: "sent", completedAt: new Date(), lastError: null })
      .where(eq(outboxEvents.id, id));
    if (providerMessageId) {
      await tx
        .insert(emailDeliveries)
        .values({ outboxEventId: id, providerMessageId, status: "sent" });
    }
  });
}

export async function markOutboxFailed(id: string, error: string, dead: boolean, nextRetryAt: Date) {
  await db()
    .update(outboxEvents)
    .set(
      dead
        ? { state: "dead_letter", lastError: error.slice(0, 1000), completedAt: new Date() }
        : { state: "failed", lastError: error.slice(0, 1000), nextRetryAt, completedAt: null },
    )
    .where(eq(outboxEvents.id, id));
}

export async function listOutboxForLead(leadId: string): Promise<OutboxRecord[]> {
  const rows = await db().select().from(outboxEvents).where(eq(outboxEvents.leadId, leadId));
  return rows.map((r) => ({
    id: r.id,
    leadId: r.leadId,
    type: "lead_notification",
    state: r.state,
    attempts: r.attempts,
    nextRetryAt: r.nextRetryAt.toISOString(),
    lastError: r.lastError,
    providerMessageId: null,
    createdAt: r.createdAt.toISOString(),
    completedAt: r.completedAt?.toISOString() ?? null,
  }));
}

export async function hitRateLimit(bucket: string, windowStart: Date) {
  const [row] = await db()
    .insert(rateLimitCounters)
    .values({ bucket, windowStart, count: 1 })
    .onConflictDoUpdate({
      target: [rateLimitCounters.bucket, rateLimitCounters.windowStart],
      set: { count: sql`${rateLimitCounters.count} + 1` },
    })
    .returning({ count: rateLimitCounters.count });
  return row?.count ?? 1;
}

export async function pruneRateLimits(before: Date) {
  await db().delete(rateLimitCounters).where(sql`${rateLimitCounters.windowStart} < ${before}`);
}
