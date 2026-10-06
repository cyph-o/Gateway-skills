import { index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

/** Campaign identifiers are an allowlist, mirrored in lib/leads/campaigns.ts. */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Non-sequential public handle shown to the visitor, e.g. GSN-7F3K2Q. */
    reference: text("reference").notNull(),
    /** Client-generated per form render — the idempotency key. */
    submissionId: uuid("submission_id").notNull(),
    fullName: text("full_name").notNull(),
    jobTitle: text("job_title"),
    companyName: text("company_name").notNull(),
    /** E.164 normalised. */
    mobileNumber: text("mobile_number").notNull(),
    email: text("email").notNull(),
    /** Lowercased + trimmed, for lookup without a uniqueness constraint. */
    emailNormalised: text("email_normalised").notNull(),
    campaign: text("campaign").notNull(),
    /** Employer size band: "1-49" | "50-249" | "250+". */
    employeeBand: text("employee_band"),
    /** Apprenticeship levy status: "yes" | "no" | "unsure". */
    levyPayer: text("levy_payer"),
    /** Programme interests ticked on the form. */
    interests: jsonb("interests").$type<string[]>().notNull().default([]),
    attribution: jsonb("attribution").$type<Record<string, string>>().notNull().default({}),
    status: text("status", { enum: ["new", "contacted", "closed"] })
      .notNull()
      .default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("leads_submission_id_key").on(t.submissionId),
    uniqueIndex("leads_reference_key").on(t.reference),
    // Deliberately NOT unique: one organisation may legitimately enquire twice.
    index("leads_email_normalised_idx").on(t.emailNormalised),
    index("leads_created_at_idx").on(t.createdAt),
  ],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
