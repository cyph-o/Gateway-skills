import { and, lt, sql } from "drizzle-orm";
import { rateLimitCounters } from "@/db/schema";
import type { Database } from "@/db/client";
import { serverEnv } from "@/lib/env";

const WINDOW_MS = 10 * 60 * 1000;

function windowStart(now = Date.now()): Date {
  return new Date(Math.floor(now / WINDOW_MS) * WINDOW_MS);
}

/** Atomic increment-and-read. The upsert is the check: concurrent requests
 *  cannot both observe a stale count and slip past the limit. */
async function hit(database: Database, bucket: string): Promise<number> {
  const [row] = await database
    .insert(rateLimitCounters)
    .values({ bucket, windowStart: windowStart(), count: 1 })
    .onConflictDoUpdate({
      target: [rateLimitCounters.bucket, rateLimitCounters.windowStart],
      set: { count: sql`${rateLimitCounters.count} + 1` },
    })
    .returning({ count: rateLimitCounters.count });
  return row?.count ?? 1;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Which limit tripped, for logging. Never surfaced to the visitor. */
  scope?: "ip" | "global";
}

/**
 * Two limits, both per 10-minute window: one per IP to stop a single abuser,
 * and one global as a backstop against a distributed flood. A genuine queue of
 * visitors at a stand sits far below the global ceiling.
 */
export async function checkRateLimit(
  database: Database,
  ip: string | null,
): Promise<RateLimitResult> {
  const env = serverEnv();
  const globalCount = await hit(database, "global");
  if (globalCount > env.LEAD_RATE_LIMIT_GLOBAL) return { allowed: false, scope: "global" };

  if (ip) {
    const ipCount = await hit(database, `ip:${ip}`);
    if (ipCount > env.LEAD_RATE_LIMIT_PER_IP) return { allowed: false, scope: "ip" };
  }
  return { allowed: true };
}

/** Housekeeping, called from the cron drain. Keeps the table from growing. */
export async function pruneRateLimits(database: Database): Promise<void> {
  const cutoff = new Date(Date.now() - WINDOW_MS * 6);
  await database.delete(rateLimitCounters).where(and(lt(rateLimitCounters.windowStart, cutoff)));
}
