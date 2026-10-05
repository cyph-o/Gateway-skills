import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { leads } from "./leads";

/**
 * Transactional outbox. A row is inserted in the SAME transaction as its lead,
 * so "the enquiry was accepted" and "someone must be notified about it" can
 * never disagree. The cron drain — not the request that created it — is what
 * guarantees delivery.
 */
export const outboxEvents = pgTable(
  "outbox_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["lead_notification"] }).notNull(),
    /** Bumped when the handler's payload contract changes. */
    payloadVersion: integer("payload_version").notNull().default(1),
    state: text("state", {
      enum: ["pending", "processing", "sent", "failed", "dead_letter"],
    })
      .notNull()
      .default("pending"),
    attempts: integer("attempts").notNull().default(0),
    nextRetryAt: timestamp("next_retry_at", { withTimezone: true }).notNull().defaultNow(),
    lastError: text("last_error"),
    /** Provider response detail, redacted of credentials. */
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [index("outbox_events_claim_idx").on(t.state, t.nextRetryAt)],
);

export type OutboxEvent = typeof outboxEvents.$inferSelect;
