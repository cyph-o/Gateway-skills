import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { emailDeliveries } from "@/db/schema";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/** Reject anything older than this to stop replay of a captured payload. */
const TOLERANCE_MS = 5 * 60 * 1000;

const STATUS_MAP: Record<string, (typeof emailDeliveries.$inferInsert)["status"]> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.delivery_delayed": "queued",
  "email.failed": "failed",
};

/**
 * Verifies a Svix-style signature (the scheme Resend uses): HMAC-SHA256 over
 * `id.timestamp.body`, keyed with the base64 portion of the whsec_ secret.
 * Implemented directly rather than pulling in the svix SDK for one function.
 */
function verify(secret: string, headers: Headers, body: string): boolean {
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signature = headers.get("svix-signature");
  if (!id || !timestamp || !signature) return false;

  const age = Math.abs(Date.now() - Number(timestamp) * 1000);
  if (!Number.isFinite(age) || age > TOLERANCE_MS) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64");

  // The header may carry several space-separated "v1,<sig>" versions.
  return signature.split(" ").some((part) => {
    const candidate = part.split(",")[1];
    if (!candidate || candidate.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
  });
}

/** Reconciles provider-side delivery outcomes. Unsigned or stale requests are
 *  rejected; unknown message ids are acknowledged and ignored. */
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const body = await request.text();
  if (!verify(secret, request.headers, body)) {
    logger.warn("webhook.rejected", { provider: "resend" });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { type?: string; data?: { email_id?: string } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const status = event.type ? STATUS_MAP[event.type] : undefined;
  const messageId = event.data?.email_id;
  if (!status || !messageId) return NextResponse.json({ received: true });

  await db()
    .update(emailDeliveries)
    .set({ status, updatedAt: new Date() })
    .where(eq(emailDeliveries.providerMessageId, messageId));

  logger.info("webhook.processed", { provider: "resend", type: event.type, status });
  return NextResponse.json({ received: true });
}
