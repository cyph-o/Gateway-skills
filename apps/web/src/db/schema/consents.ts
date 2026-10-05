import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { leads } from "./leads";

/**
 * Consent is recorded per purpose, not as a single flag. Responding to a
 * requested funding audit rests on legitimate interest; marketing by email,
 * call or text is a separate, opt-in record (PECR).
 */
export const leadConsents = pgTable("lead_consents", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  purpose: text("purpose", { enum: ["enquiry_response", "marketing"] }).notNull(),
  granted: boolean("granted").notNull(),
  /** Version of the privacy notice shown at the moment of capture. */
  noticeVersion: text("notice_version").notNull(),
  /** Where it was captured, e.g. "care_show_leadership". */
  source: text("source").notNull(),
  withdrawnAt: timestamp("withdrawn_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type LeadConsent = typeof leadConsents.$inferSelect;
