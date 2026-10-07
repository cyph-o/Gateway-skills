import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { leadConsents, leads, outboxEvents } from "@/db/schema";
import { buildConsents } from "./consents";
import {
  claimDueOutbox,
  hitRateLimit,
  listOutboxForLead,
  markOutboxFailed,
  markOutboxSent,
  pruneRateLimits,
} from "./postgres-outbox";
import type {
  ConsentRecord,
  CreateLeadResult,
  LeadListOptions,
  LeadRecord,
  LeadStore,
  NewLeadInput,
} from "./types";

type LeadRow = typeof leads.$inferSelect;

function toRecord(row: LeadRow, marketingConsent = false): LeadRecord {
  return {
    id: row.id,
    reference: row.reference,
    submissionId: row.submissionId,
    fullName: row.fullName,
    jobTitle: row.jobTitle,
    companyName: row.companyName,
    mobileNumber: row.mobileNumber,
    email: row.email,
    emailNormalised: row.emailNormalised,
    campaign: row.campaign,
    employeeBand: row.employeeBand,
    levyPayer: row.levyPayer,
    interests: row.interests ?? [],
    attribution: row.attribution ?? {},
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    marketingConsent,
  };
}

/** Postgres driver. The lead, its consents and its outbox entry commit in one
 *  transaction, so an acknowledged enquiry is never missing its notification. */
export class PostgresLeadStore implements LeadStore {
  readonly driver = "postgres" as const;

  async createLead(input: NewLeadInput): Promise<CreateLeadResult> {
    return db().transaction(async (tx) => {
      const [inserted] = await tx
        .insert(leads)
        .values({
          reference: input.reference,
          submissionId: input.submissionId,
          fullName: input.fullName,
          jobTitle: input.jobTitle,
          companyName: input.companyName,
          mobileNumber: input.mobileNumber,
          email: input.email,
          emailNormalised: input.emailNormalised,
          campaign: input.campaign,
          employeeBand: input.employeeBand,
          levyPayer: input.levyPayer,
          interests: input.interests,
          attribution: input.attribution,
        })
        .onConflictDoNothing({ target: leads.submissionId })
        .returning({ id: leads.id, reference: leads.reference });

      if (!inserted) {
        const [existing] = await tx
          .select({ reference: leads.reference })
          .from(leads)
          .where(eq(leads.submissionId, input.submissionId))
          .limit(1);
        return { reference: existing?.reference ?? "", duplicate: true };
      }

      await tx.insert(leadConsents).values(
        buildConsents(inserted.id, input.campaign, input.marketingConsent).map((c) => ({
          leadId: c.leadId,
          purpose: c.purpose,
          granted: c.granted,
          noticeVersion: c.noticeVersion,
          source: c.source,
        })),
      );

      await tx.insert(outboxEvents).values({ leadId: inserted.id, type: "lead_notification" });
      return { reference: inserted.reference, duplicate: false };
    });
  }

  async listLeads(options: LeadListOptions = {}) {
    const { limit = 50, offset = 0, search, campaign } = options;
    const filters = [];
    if (campaign) filters.push(eq(leads.campaign, campaign));
    if (search?.trim()) {
      const needle = `%${search.trim()}%`;
      filters.push(
        or(
          ilike(leads.fullName, needle),
          ilike(leads.companyName, needle),
          ilike(leads.email, needle),
          ilike(leads.reference, needle),
        )!,
      );
    }
    const where = filters.length ? and(...filters) : undefined;

    const rows = await db()
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);
    const [totals] = await db().select({ value: count() }).from(leads).where(where);

    return { leads: rows.map((r) => toRecord(r)), total: totals?.value ?? 0 };
  }

  async getLeadByReference(reference: string) {
    const [row] = await db().select().from(leads).where(eq(leads.reference, reference)).limit(1);
    if (!row) return null;
    const consents = await db()
      .select({ purpose: leadConsents.purpose, granted: leadConsents.granted })
      .from(leadConsents)
      .where(eq(leadConsents.leadId, row.id));
    return toRecord(row, consents.some((c) => c.purpose === "marketing" && c.granted));
  }

  claimDueOutbox = claimDueOutbox;
  markOutboxSent = markOutboxSent;
  markOutboxFailed = markOutboxFailed;
  listOutboxForLead = listOutboxForLead;
  hitRateLimit = hitRateLimit;
  pruneRateLimits = pruneRateLimits;

  async listConsentsForLead(leadId: string): Promise<ConsentRecord[]> {
    const rows = await db()
      .select()
      .from(leadConsents)
      .where(eq(leadConsents.leadId, leadId));
    return rows.map((r) => ({
      leadId: r.leadId,
      purpose: r.purpose as ConsentRecord["purpose"],
      granted: r.granted,
      noticeVersion: r.noticeVersion,
      source: r.source,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async ping() {
    await db().execute(sql`SELECT 1`);
  }
}
