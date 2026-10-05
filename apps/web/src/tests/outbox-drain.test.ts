import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { leads, outboxEvents } from "@/db/schema";
import { drainOutbox } from "@/lib/outbox/drain";
import { generateReference } from "@/lib/leads/reference";

/**
 * Proves the central durability claim: when email delivery fails, the lead is
 * still safe and the notification is retried on a bounded schedule rather than
 * being dropped. Runs with RESEND_API_KEY unset, which is exactly the
 * "provider unreachable" condition.
 */
const TEST_EMAIL = "outbox.integration@example.co.uk";

async function seedLead() {
  const database = db();
  const [lead] = await database
    .insert(leads)
    .values({
      reference: generateReference(),
      submissionId: crypto.randomUUID(),
      fullName: "Integration Test",
      companyName: "Example Care Group Ltd",
      mobileNumber: "+447700900123",
      email: TEST_EMAIL,
      emailNormalised: TEST_EMAIL,
      campaign: "care_show_leadership",
    })
    .returning({ id: leads.id });

  const [event] = await database
    .insert(outboxEvents)
    .values({ leadId: lead!.id, type: "lead_notification" })
    .returning({ id: outboxEvents.id });

  return { leadId: lead!.id, eventId: event!.id };
}

async function readEvent(id: string) {
  const [row] = await db().select().from(outboxEvents).where(eq(outboxEvents.id, id)).limit(1);
  return row!;
}

async function cleanup() {
  await db().delete(leads).where(eq(leads.emailNormalised, TEST_EMAIL));
}

describe("outbox drain under provider failure", () => {
  beforeEach(cleanup);
  afterAll(cleanup);

  it("keeps the lead and schedules a retry when email cannot be sent", async () => {
    const { leadId, eventId } = await seedLead();

    const report = await drainOutbox(10);
    expect(report.claimed).toBeGreaterThanOrEqual(1);

    const event = await readEvent(eventId);
    expect(event.state, "a transient failure must stay retryable").toBe("failed");
    expect(event.attempts).toBe(1);
    expect(event.lastError).toContain("RESEND_API_KEY");
    expect(event.nextRetryAt.getTime()).toBeGreaterThan(Date.now());

    // The commercially important assertion: the enquiry itself is untouched.
    const [lead] = await db().select().from(leads).where(eq(leads.id, leadId)).limit(1);
    expect(lead, "the lead must survive an email outage").toBeTruthy();
    expect(lead!.email).toBe(TEST_EMAIL);
  });

  it("does not re-claim an event before its retry time", async () => {
    const { eventId } = await seedLead();
    await drainOutbox(10);
    const afterFirst = await readEvent(eventId);

    const second = await drainOutbox(10);
    const afterSecond = await readEvent(eventId);
    expect(second.claimed).toBe(0);
    expect(afterSecond.attempts).toBe(afterFirst.attempts);
  });

  it("dead-letters once attempts are exhausted, so it cannot retry forever", async () => {
    const { eventId } = await seedLead();
    const max = Number(process.env.OUTBOX_MAX_ATTEMPTS ?? 6);

    await db()
      .update(outboxEvents)
      .set({ attempts: max, nextRetryAt: new Date(Date.now() - 1000) })
      .where(eq(outboxEvents.id, eventId));

    const report = await drainOutbox(10);
    expect(report.deadLettered).toBe(1);
    expect((await readEvent(eventId)).state).toBe("dead_letter");
  });
});
