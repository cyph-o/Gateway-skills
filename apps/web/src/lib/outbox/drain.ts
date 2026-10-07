import { sendLeadNotification } from "@/lib/email/resend";
import type { CampaignId } from "@/lib/leads/campaigns";
import { logger } from "@/lib/logger";
import { serverEnv } from "@/lib/env";
import { leadStore } from "@/lib/storage";
import { nextRetryAt } from "./backoff";

export interface DrainReport {
  claimed: number;
  sent: number;
  retrying: number;
  deadLettered: number;
}

/**
 * Drains due notifications. Deliberately the same code path for the immediate
 * post-response attempt and the scheduled retry sweep, so the recovery path is
 * exercised on every submission and cannot rot from disuse.
 *
 * Contact details are loaded at send time rather than copied into the outbox
 * entry, so a retry always sends the current record and personal data lives in
 * exactly one place.
 */
export async function drainOutbox(limit = 10): Promise<DrainReport> {
  const store = leadStore();
  const report: DrainReport = { claimed: 0, sent: 0, retrying: 0, deadLettered: 0 };

  const due = await store.claimDueOutbox(limit);
  report.claimed = due.length;
  if (due.length === 0) return report;

  const { leads } = await store.listLeads({ limit: 1000 });
  const byId = new Map(leads.map((lead) => [lead.id, lead]));
  const maxAttempts = serverEnv().OUTBOX_MAX_ATTEMPTS;

  for (const entry of due) {
    const lead = byId.get(entry.leadId);

    if (!lead) {
      await store.markOutboxFailed(entry.id, "Lead no longer exists", true, new Date());
      report.deadLettered += 1;
      continue;
    }

    try {
      // The outbox id is the provider idempotency key, so a retry after an
      // unknown outcome cannot produce a second email.
      const result = await sendLeadNotification(
        {
          reference: lead.reference,
          campaign: lead.campaign as CampaignId,
          fullName: lead.fullName,
          jobTitle: lead.jobTitle,
          companyName: lead.companyName,
          mobileNumber: lead.mobileNumber,
          email: lead.email,
          employeeBand: lead.employeeBand,
          levyPayer: lead.levyPayer,
          interests: lead.interests,
          marketingConsent: lead.marketingConsent,
          attribution: lead.attribution,
          submittedAt: new Date(lead.createdAt),
        },
        entry.id,
      );

      if (result.ok) {
        await store.markOutboxSent(entry.id, result.providerMessageId);
        report.sent += 1;
        continue;
      }

      const exhausted = entry.attempts >= maxAttempts;
      const dead = !result.retryable || exhausted;
      await store.markOutboxFailed(
        entry.id,
        result.error ?? "Unknown error",
        dead,
        nextRetryAt(entry.attempts),
      );
      logger[dead ? "error" : "warn"](dead ? "outbox.dead_letter" : "outbox.retry", {
        outboxId: entry.id,
        attempts: entry.attempts,
        error: result.error,
      });
      if (dead) report.deadLettered += 1;
      else report.retrying += 1;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Handler threw";
      const dead = entry.attempts >= maxAttempts;
      await store.markOutboxFailed(entry.id, message, dead, nextRetryAt(entry.attempts));
      logger.error("outbox.handler_threw", { outboxId: entry.id, error: message });
      if (dead) report.deadLettered += 1;
      else report.retrying += 1;
    }
  }

  return report;
}
