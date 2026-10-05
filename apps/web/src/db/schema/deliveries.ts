import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { outboxEvents } from "./outbox";

/** Provider-side delivery lifecycle, reconciled from signed Resend webhooks. */
export const emailDeliveries = pgTable(
  "email_deliveries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    outboxEventId: uuid("outbox_event_id")
      .notNull()
      .references(() => outboxEvents.id, { onDelete: "cascade" }),
    providerMessageId: text("provider_message_id").notNull(),
    status: text("status", {
      enum: ["queued", "sent", "delivered", "bounced", "complained", "failed"],
    })
      .notNull()
      .default("queued"),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("email_deliveries_provider_message_id_idx").on(t.providerMessageId)],
);

export type EmailDelivery = typeof emailDeliveries.$inferSelect;
