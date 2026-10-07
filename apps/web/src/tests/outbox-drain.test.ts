import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { rm } from "node:fs/promises";
import { leadStore } from "@/lib/storage";
import { drainOutbox } from "@/lib/outbox/drain";
import { generateReference } from "@/lib/leads/reference";
import type { OutboxRecord } from "@/lib/storage/types";

/**
 * Proves the central durability claim: when email delivery fails, the lead is
 * still safe and the notification is retried on a bounded schedule rather than
 * being dropped. Runs with RESEND_API_KEY unset, which is exactly the
 * "provider unreachable" condition.
 *
 * It goes through the storage interface rather than SQL, so it proves the claim
 * for whichever driver is configured — including the JSON file, which is the
 * default and therefore the one most likely to be running.
 */
const TEST_EMAIL = "outbox.integration@example.co.uk";

async function seedLead() {
  const store = leadStore();
  const reference = generateReference();
  await store.createLead({
    submissionId: crypto.randomUUID(),
    reference,
    fullName: "Integration Test",
    jobTitle: null,
    companyName: "Example Care Group Ltd",
    mobileNumber: "+447700900123",
    email: TEST_EMAIL,
    emailNormalised: TEST_EMAIL,
    campaign: "care_show_leadership",
    employeeBand: null,
    levyPayer: null,
    interests: [],
    attribution: {},
    marketingConsent: false,
  });
  const lead = (await store.getLeadByReference(reference))!;
  const [event] = await store.listOutboxForLead(lead.id);
  return { leadId: lead.id, eventId: event!.id, reference };
}

async function readEvent(leadId: string, eventId: string): Promise<OutboxRecord> {
  const rows = await leadStore().listOutboxForLead(leadId);
  return rows.find((r) => r.id === eventId)!;
}

async function cleanup() {
  const store = leadStore();
  if (store.driver === "postgres") {
    const { db } = await import("@/db/client");
    const { leads } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    await db().delete(leads).where(eq(leads.emailNormalised, TEST_EMAIL));
    return;
  }
  // The JSON driver runs against a file of its own, so removing it is both the
  // cheapest reset and a guarantee no fixture leaks into the next run.
  await rm(process.env.LEAD_STORE_FILE!, { force: true });
}

describe("outbox drain under provider failure", () => {
  beforeEach(cleanup);
  afterAll(cleanup);

  it("keeps the lead and schedules a retry when email cannot be sent", async () => {
    const { leadId, eventId, reference } = await seedLead();

    const report = await drainOutbox(10);
    expect(report.claimed).toBeGreaterThanOrEqual(1);

    const event = await readEvent(leadId, eventId);
    expect(event.state, "a transient failure must stay retryable").toBe("failed");
    expect(event.attempts).toBe(1);
    expect(event.lastError).toContain("RESEND_API_KEY");
    expect(Date.parse(event.nextRetryAt)).toBeGreaterThan(Date.now());

    // The commercially important assertion: the enquiry itself is untouched.
    const lead = await leadStore().getLeadByReference(reference);
    expect(lead, "the lead must survive an email outage").toBeTruthy();
    expect(lead!.email).toBe(TEST_EMAIL);
  });

  it("does not re-claim an event before its retry time", async () => {
    const { leadId, eventId } = await seedLead();
    await drainOutbox(10);
    const afterFirst = await readEvent(leadId, eventId);

    const second = await drainOutbox(10);
    const afterSecond = await readEvent(leadId, eventId);
    expect(second.claimed).toBe(0);
    expect(afterSecond.attempts).toBe(afterFirst.attempts);
  });

  it("dead-letters once attempts are exhausted, so it cannot retry forever", async () => {
    const { leadId, eventId } = await seedLead();
    const store = leadStore();
    const max = Number(process.env.OUTBOX_MAX_ATTEMPTS ?? 6);

    // Drive it to the ceiling the way production would — repeated failed sends,
    // each made due again — rather than writing an attempt count into storage.
    let reportedDeadLetter = 0;
    for (let attempt = 0; attempt <= max; attempt += 1) {
      reportedDeadLetter += (await drainOutbox(10)).deadLettered;
      const event = await readEvent(leadId, eventId);
      if (event.state === "dead_letter") break;
      await store.markOutboxFailed(eventId, "forced due", false, new Date(Date.now() - 1000));
    }

    const final = await readEvent(leadId, eventId);
    expect(final.state).toBe("dead_letter");
    expect(final.attempts).toBeGreaterThanOrEqual(max);
    expect(reportedDeadLetter, "the drain must report what it gave up on").toBe(1);

    // Dead letters are terminal: nothing claims them again.
    expect((await drainOutbox(10)).claimed).toBe(0);
  });
});
