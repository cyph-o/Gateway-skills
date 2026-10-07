import { leadStore } from "@/lib/storage";
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
  /** Resolved idempotency key: a derived content-window key. */
  submissionId: string;
}

/**
 * Persists a lead and its notification outbox entry together, through whichever
 * storage driver is configured. Nothing is acknowledged to the visitor until
 * that write completes, so a confirmation can never be shown for an enquiry we
 * did not keep.
 *
 * Idempotent on submissionId: a double-tap or a retried request returns the
 * original reference and does NOT enqueue a second notification.
 */
export async function createLead(
  values: LeadFormValues,
  meta: LeadMeta,
): Promise<CreateLeadResult> {
  return leadStore().createLead({
    submissionId: meta.submissionId,
    reference: generateReference(),
    fullName: values.fullName,
    jobTitle: values.jobTitle ?? null,
    companyName: values.companyName,
    mobileNumber: values.mobileNumber,
    email: values.email,
    emailNormalised: normaliseEmail(values.email),
    campaign: values.campaign,
    employeeBand: values.employeeBand ?? null,
    levyPayer: values.levyPayer ?? null,
    interests: [...values.interests],
    attribution: meta.attribution,
    marketingConsent: values.marketingConsent,
  });
}
