import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { emailDeliveries, outboxEvents, type OutboxEvent } from "@/db/schema";
import { serverEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { nextRetryAt } from "./backoff";
import { handlers } from "./handlers";

export interface DrainReport {
  claimed: number;
  sent: number;
  retrying: number;
  deadLettered: number;
}

/** Tolerates driver differences in how result rows are surfaced. */
function toRows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  return (result as { rows?: T[] }).rows ?? [];
}

/**
 * Atomically claims due events and marks them processing in one statement.
 * FOR UPDATE SKIP LOCKED is what makes concurrent drains safe: an overlapping
 * cron run and an `after()` call can never pick up the same event.
 */
async function claim(limit: number): Promise<OutboxEvent[]> {
  const result = await db().execute(sql`
    UPDATE outbox_events SET
      state = 'processing',
      attempts = attempts + 1
    WHERE id IN (
      SELECT id FROM outbox_events
      WHERE state IN ('pending', 'failed')
        AND next_retry_at <= now()
      ORDER BY next_retry_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    )
    RETURNING id, lead_id AS "leadId", type, payload_version AS "payloadVersion",
              state, attempts, next_retry_at AS "nextRetryAt", last_error AS "lastError",
              meta, created_at AS "createdAt", completed_at AS "completedAt"
  `);
  return toRows<OutboxEvent>(result);
}

async function recordSuccess(event: OutboxEvent, providerMessageId?: string): Promise<void> {
  const database = db();
  await database.transaction(async (tx) => {
    await tx
      .update(outboxEvents)
      .set({ state: "sent", completedAt: new Date(), lastError: null })
      .where(sql`${outboxEvents.id} = ${event.id}`);

    if (providerMessageId) {
      await tx.insert(emailDeliveries).values({
        outboxEventId: event.id,
        providerMessageId,
        status: "sent",
      });
    }
  });
}

async function recordFailure(event: OutboxEvent, error: string, retryable: boolean) {
  const exhausted = event.attempts >= serverEnv().OUTBOX_MAX_ATTEMPTS;
  const dead = !retryable || exhausted;

  // A dead event's retry time is meaningless, so leave the column untouched
  // rather than round-tripping a raw-SQL timestamp back through the mapper.
  const update = dead
    ? { state: "dead_letter" as const, lastError: error.slice(0, 1000), completedAt: new Date() }
    : {
        state: "failed" as const,
        lastError: error.slice(0, 1000),
        nextRetryAt: nextRetryAt(event.attempts),
        completedAt: null,
      };

  await db().update(outboxEvents).set(update).where(sql`${outboxEvents.id} = ${event.id}`);

  // A dead-lettered lead is captured but unannounced — it needs a human.
  logger[dead ? "error" : "warn"](dead ? "outbox.dead_letter" : "outbox.retry", {
    eventId: event.id,
    attempts: event.attempts,
    error,
  });
  return dead;
}

/**
 * Drains due outbox events. Deliberately the same code path for the immediate
 * post-response attempt and the scheduled retry sweep, so the recovery path is
 * exercised on every single submission and cannot rot from disuse.
 */
export async function drainOutbox(limit = 10): Promise<DrainReport> {
  const report: DrainReport = { claimed: 0, sent: 0, retrying: 0, deadLettered: 0 };
  const events = await claim(limit);
  report.claimed = events.length;

  for (const event of events) {
    const handler = handlers[event.type];
    try {
      const result = handler
        ? await handler(db(), event)
        : { ok: false, retryable: false, error: `No handler for ${event.type}` };

      if (result.ok) {
        await recordSuccess(event, result.providerMessageId);
        report.sent += 1;
      } else if (await recordFailure(event, result.error ?? "Unknown error", result.retryable)) {
        report.deadLettered += 1;
      } else {
        report.retrying += 1;
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Handler threw";
      if (await recordFailure(event, message, true)) report.deadLettered += 1;
      else report.retrying += 1;
    }
  }

  return report;
}
