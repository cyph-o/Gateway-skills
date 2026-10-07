import { NextResponse } from "next/server";
import { describeDurability, leadStore } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * Liveness plus a real storage round-trip, so a deploy that cannot reach its
 * store fails its health check instead of silently rejecting enquiries. The
 * durability warning is reported here too: JSON storage on a serverless host
 * loses leads, and that should be visible from outside the process.
 */
export async function GET() {
  const durability = describeDurability();
  try {
    const store = leadStore();
    await store.ping();
    return NextResponse.json(
      {
        status: durability.severity === "critical" ? "degraded" : "ok",
        storage: store.driver,
        durability,
      },
      { status: durability.severity === "critical" ? 503 : 200 },
    );
  } catch {
    // Detail is logged, never returned: health endpoints are public.
    return NextResponse.json(
      { status: "degraded", storage: "unreachable", durability },
      { status: 503 },
    );
  }
}
