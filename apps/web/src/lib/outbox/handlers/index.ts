import type { Database } from "@/db/client";
import type { OutboxEvent } from "@/db/schema";
import type { SendResult } from "@/lib/email/resend";
import { handleLeadNotification } from "./lead-notification";

export type OutboxHandler = (database: Database, event: OutboxEvent) => Promise<SendResult>;

/**
 * Dispatch table for outbox event types. This is the extension seam: a future
 * AI enrichment step becomes a new event type and a new handler here, without
 * touching the capture path that visitors depend on.
 */
export const handlers: Record<OutboxEvent["type"], OutboxHandler> = {
  lead_notification: handleLeadNotification,
};
