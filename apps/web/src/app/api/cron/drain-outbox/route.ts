import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { serverEnv } from "@/lib/env";
import { pruneRateLimits } from "@/lib/leads/rate-limit";
import { logger } from "@/lib/logger";
import { drainOutbox } from "@/lib/outbox/drain";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Constant-time comparison so the secret cannot be guessed by timing. */
function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided || provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i += 1) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Scheduled outbox drain — the actual delivery guarantee. Vercel Cron calls
 * this with `Authorization: Bearer <CRON_SECRET>`; it is also safe to call
 * manually to flush a backlog after fixing configuration.
 */
export async function GET(request: Request) {
  const expected = serverEnv().CRON_SECRET;
  if (!expected) {
    logger.error("cron.misconfigured", { reason: "CRON_SECRET not set" });
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!secretMatches(bearer, expected)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const report = await drainOutbox(25);
  await pruneRateLimits(db());

  if (report.deadLettered > 0) {
    logger.error("cron.dead_letters", { count: report.deadLettered });
  }
  logger.info("cron.drain_complete", { ...report });
  return NextResponse.json(report);
}
