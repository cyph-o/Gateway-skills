import { eq } from "drizzle-orm";
import type { Database } from "@/db/client";
import { leadConsents, leads } from "@/db/schema";
import { sendLeadNotification, type SendResult } from "@/lib/email/resend";
import type { CampaignId } from "@/lib/leads/campaigns";
import type { OutboxEvent } from "@/db/schema";

/**
 * Loads the lead at send time rather than copying personal data into the
 * outbox payload — contact details live in exactly one place, and a retry
 * always sends the current record.
 */
export async function handleLeadNotification(
  database: Database,
  event: OutboxEvent,
): Promise<SendResult> {
  const [lead] = await database
    .select()
    .from(leads)
    .where(eq(leads.id, event.leadId))
    .limit(1);

  if (!lead) {
    return { ok: false, retryable: false, error: "Lead no longer exists" };
  }

  const consents = await database
    .select({ purpose: leadConsents.purpose, granted: leadConsents.granted })
    .from(leadConsents)
    .where(eq(leadConsents.leadId, lead.id));

  const marketingConsent = consents.some((c) => c.purpose === "marketing" && c.granted);

  // The outbox event id is the provider idempotency key, so a retry after an
  // unknown outcome cannot produce a second email.
  return sendLeadNotification(
    {
      reference: lead.reference,
      campaign: lead.campaign as CampaignId,
      fullName: lead.fullName,
      jobTitle: lead.jobTitle,
      companyName: lead.companyName,
      employeeBand: lead.employeeBand,
      levyPayer: lead.levyPayer,
      interests: lead.interests ?? [],
      mobileNumber: lead.mobileNumber,
      email: lead.email,
      marketingConsent,
      attribution: lead.attribution ?? {},
      submittedAt: lead.createdAt,
    },
    event.id,
  );
}
