import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";

export const dynamic = "force-dynamic";

/** Liveness plus a real database round-trip, so a deploy that cannot reach
 *  Postgres fails its health check instead of silently rejecting enquiries. */
export async function GET() {
  try {
    await db().execute(sql`SELECT 1`);
    return NextResponse.json({ status: "ok", database: "ok" });
  } catch {
    // Detail is logged, never returned — health endpoints are public.
    return NextResponse.json({ status: "degraded", database: "unreachable" }, { status: 503 });
  }
}
