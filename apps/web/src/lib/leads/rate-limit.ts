import { serverEnv } from "@/lib/env";
import { leadStore } from "@/lib/storage";

const WINDOW_MS = 10 * 60 * 1000;

function windowStart(now = Date.now()): Date {
  return new Date(Math.floor(now / WINDOW_MS) * WINDOW_MS);
}

export interface RateLimitResult {
  allowed: boolean;
  /** Which limit tripped, for logging. Never surfaced to the visitor. */
  scope?: "ip" | "global";
}

/**
 * Two limits per 10-minute window: one per IP to stop a single abuser, and a
 * global backstop against a distributed flood. A genuine queue of visitors at
 * a stand sits far below the global ceiling.
 */
export async function checkRateLimit(ip: string | null): Promise<RateLimitResult> {
  const env = serverEnv();
  const store = leadStore();
  const start = windowStart();

  if ((await store.hitRateLimit("global", start)) > env.LEAD_RATE_LIMIT_GLOBAL) {
    return { allowed: false, scope: "global" };
  }
  if (ip && (await store.hitRateLimit(`ip:${ip}`, start)) > env.LEAD_RATE_LIMIT_PER_IP) {
    return { allowed: false, scope: "ip" };
  }
  return { allowed: true };
}

/**
 * Sign-in throttling for the admin area, deliberately on its own counters.
 *
 * It must never share the public form's global backstop: that ceiling is sized
 * for enquiry volume, so a burst of enquiries — or someone flooding the form on
 * purpose — would otherwise lock the Gateway team out of their own dashboard,
 * which is precisely what an attacker flooding the form would want. Brute-force
 * protection is kept by a per-IP bucket plus an admin-only global ceiling.
 */
export async function checkAdminRateLimit(ip: string | null): Promise<RateLimitResult> {
  const env = serverEnv();
  const store = leadStore();
  const start = windowStart();

  if ((await store.hitRateLimit("admin:global", start)) > env.ADMIN_RATE_LIMIT_GLOBAL) {
    return { allowed: false, scope: "global" };
  }
  if (ip && (await store.hitRateLimit(`admin:ip:${ip}`, start)) > env.ADMIN_RATE_LIMIT_PER_IP) {
    return { allowed: false, scope: "ip" };
  }
  return { allowed: true };
}

/** Housekeeping, called from the cron drain. */
export async function pruneRateLimits(): Promise<void> {
  await leadStore().pruneRateLimits(new Date(Date.now() - WINDOW_MS * 6));
}
