import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { leadConsents, leads, outboxEvents } from "@/db/schema";
import { PRIVACY_NOTICE_VERSION } from "@/content/legal/notice";
import { normaliseEmail } from "./normalise";
import { generateReference } from "./reference";
import type { LeadFormValues } from "./schema";

export interface CreateLeadResult {
  reference: string;
  /** True when this submission id has already been accepted. */
  duplicate: boolean;
}

export interface LeadMeta {
  attribution: Record<string, string>;
  /** Resolved idempotency key: the client's id, or a derived content-window key. */
  submissionId: string;
}

/**
 * Persists a lead, its consent records and its notification outbox event in a
 * SINGLE transaction. Nothing is acknowledged to the visitor until this commits,
 * so a confirmation can never be shown for an enquiry we did not keep.
 *
 * Idempotent on submissionId: a double-tap, a retried request, or a browser
 * replaying the form returns the original reference and does NOT enqueue a
 * second notification.
 */
export async function createLead(
  values: LeadFormValues,
  meta: LeadMeta,
): Promise<CreateLeadResult> {
  const database = db();

  return database.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(leads)
      .values({
        reference: generateReference(),
        submissionId: meta.submissionId,
        fullName: values.fullName,
        jobTitle: values.jobTitle,
        companyName: values.companyName,
        mobileNumber: values.mobileNumber,
        email: values.email,
        emailNormalised: normaliseEmail(values.email),
        campaign: values.campaign,
        employeeBand: values.employeeBand,
        levyPayer: values.levyPayer,
        interests: [...values.interests],
        attribution: meta.attribution,
      })
      .onConflictDoNothing({ target: leads.submissionId })
      .returning({ id: leads.id, reference: leads.reference });

    if (!inserted) {
      const [existing] = await tx
        .select({ reference: leads.reference })
        .from(leads)
        .where(eq(leads.submissionId, meta.submissionId))
        .limit(1);
      return { reference: existing?.reference ?? "", duplicate: true };
    }

    await tx.insert(leadConsents).values([
      {
        leadId: inserted.id,
        purpose: "enquiry_response",
        granted: true,
        noticeVersion: PRIVACY_NOTICE_VERSION,
        source: values.campaign,
      },
      {
        leadId: inserted.id,
        purpose: "marketing",
        granted: values.marketingConsent,
        noticeVersion: PRIVACY_NOTICE_VERSION,
        source: values.campaign,
      },
    ]);

    await tx.insert(outboxEvents).values({
      leadId: inserted.id,
      type: "lead_notification",
    });

    return { reference: inserted.reference, duplicate: false };
  });
}
