import { expect, test } from "@playwright/test";
import {
  closeDb,
  consentsForLead,
  deleteLeadsByEmail,
  leadsByEmail,
  outboxForLead,
  resetRateLimits,
} from "./helpers/db";
import { MIN_FILL_MS } from "../src/lib/leads/schema";

/** Unique per run so parallel projects never collide on the same row. */
function uniqueEmail(tag: string): string {
  return `e2e.${tag}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@example.co.uk`;
}

const FILLED = {
  fullName: "Alex Morgan",
  companyName: "Example Care Group Ltd",
  mobileNumber: "07700 900123",
};

test.describe.configure({ mode: "serial" });
/**
 * A distinct client IP for this spec. The rate limiter keys on
 * x-forwarded-for, so without this the submission specs share one bucket and
 * trip the per-IP limit when they run in parallel — a test-environment
 * collision, not a product fault. Giving each spec its own address isolates
 * them and exercises the per-IP keying for real.
 */
test.use({ extraHTTPHeaders: { "x-forwarded-for": "203.0.113.11" } });

test.beforeEach(async () => {
  await resetRateLimits();
});

test.afterAll(async () => {
  await closeDb();
});

async function fillForm(page: import("@playwright/test").Page, email: string) {
  await page.fill("#fullName", FILLED.fullName);
  await page.fill("#jobTitle", "Registered Manager");
  await page.fill("#companyName", FILLED.companyName);
  await page.fill("#mobileNumber", FILLED.mobileNumber);
  await page.fill("#email", email);
  await page.selectOption("#employeeBand", "50-249");
  await page.selectOption("#levyPayer", "no");
  // The server rejects submissions faster than a human could type.
  await page.waitForTimeout(MIN_FILL_MS + 300);
}

test("submits an enquiry, persists it transactionally and confirms with a reference", async ({
  page,
}) => {
  const email = uniqueEmail("happy");
  await page.goto("/care-show/leadership?utm_source=care_show&utm_medium=qr&utm_campaign=q4_2026");
  await fillForm(page, email);
  await page.locator('form button[type="submit"]').click();

  await expect(page).toHaveURL(/\/enquiry-received\?ref=GSN-/);
  await expect(page.getByText(/GSN-/)).toBeVisible();

  const rows = await leadsByEmail(email);
  expect(rows).toHaveLength(1);
  const lead = rows[0]!;

  expect(lead.full_name).toBe(FILLED.fullName);
  expect(lead.company_name).toBe(FILLED.companyName);
  // Normalised to E.164 regardless of how it was typed.
  expect(lead.mobile_number).toBe("+447700900123");
  expect(lead.campaign).toBe("care_show_leadership");
  expect(lead.reference).toMatch(/^GSN-[2-9A-HJ-NP-TV-Z]{6}$/);
  // QR attribution captured and stored with the lead, not left to a cookie.
  expect(lead.attribution).toMatchObject({
    utm_source: "care_show",
    utm_medium: "qr",
    utm_campaign: "q4_2026",
  });

  // The outbox row committed in the same transaction as the lead.
  const outbox = await outboxForLead(lead.id);
  expect(outbox).toHaveLength(1);
  expect(outbox[0]!.type).toBe("lead_notification");

  // Consent recorded per purpose; marketing left unticked means not granted.
  const consents = await consentsForLead(lead.id);
  expect(consents).toHaveLength(2);
  expect(consents.find((c) => c.purpose === "enquiry_response")?.granted).toBe(true);
  expect(consents.find((c) => c.purpose === "marketing")?.granted).toBe(false);

  await deleteLeadsByEmail(email);
});

test("the same enquiry submitted twice yields one lead and one notification", async ({
  page,
}) => {
  const email = uniqueEmail("idem");

  // Two independent visits with identical details — the realistic duplicate:
  // a visitor who is unsure the first submission worked and does it again.
  for (const attempt of [1, 2]) {
    await page.goto("/care-show/ai-automation");
    await fillForm(page, email);
    await page.locator('form button[type="submit"]').click();
    await expect(page, `attempt ${attempt} should confirm`).toHaveURL(/\/enquiry-received/);
  }

  const rows = await leadsByEmail(email);
  expect(rows, "a repeated enquiry must not create a second lead").toHaveLength(1);
  expect(
    await outboxForLead(rows[0]!.id),
    "nor a second notification for Gateway to chase twice",
  ).toHaveLength(1);

  await deleteLeadsByEmail(email);
});

test("rejects invalid input with field-level errors and keeps what was typed", async ({ page }) => {
  await page.goto("/care-show/leadership");
  await page.fill("#fullName", "A");
  await page.fill("#jobTitle", "Operations Director");
  await page.fill("#companyName", "Example Care Group Ltd");
  await page.fill("#mobileNumber", "not-a-number");
  await page.fill("#email", "not-an-email");
  await page.selectOption("#employeeBand", "1-49");
  await page.selectOption("#levyPayer", "no");
  await page.waitForTimeout(MIN_FILL_MS + 300);
  await page.locator('form button[type="submit"]').click();

  await expect(page.locator("#fullName-error")).toBeVisible();
  await expect(page.locator("#mobileNumber-error")).toBeVisible();
  await expect(page.locator("#email-error")).toBeVisible();
  // Nothing lost on rejection — the organisation name survives the round trip.
  await expect(page.locator("#companyName")).toHaveValue("Example Care Group Ltd");
  await expect(page).not.toHaveURL(/enquiry-received/);
});

test("a bot that fills the honeypot is rejected and nothing is stored", async ({ page }) => {
  const email = uniqueEmail("bot");
  await page.goto("/care-show/leadership");
  await fillForm(page, email);
  await page.evaluate(() => {
    const field = document.querySelector<HTMLInputElement>("#company_website");
    if (field) field.value = "https://spam.example";
  });
  await page.locator('form button[type="submit"]').click();

  await expect(page.locator('form [role="alert"]')).toContainText(/rejected/i);
  expect(await leadsByEmail(email)).toHaveLength(0);
});

test("submitting too quickly is rejected as mechanical", async ({ page }) => {
  const email = uniqueEmail("fast");
  await page.goto("/care-show/leadership");
  await page.fill("#fullName", FILLED.fullName);
  await page.fill("#jobTitle", "Registered Manager");
  await page.fill("#companyName", FILLED.companyName);
  await page.fill("#mobileNumber", FILLED.mobileNumber);
  await page.fill("#email", email);
  await page.selectOption("#employeeBand", "50-249");
  await page.selectOption("#levyPayer", "no");

  // Reset the render stamp immediately before submitting. Filling this form
  // now takes longer than MIN_FILL_MS on a loaded machine, so relying on the
  // test itself being fast was flaky. This exercises the server-side timing
  // guard directly and deterministically.
  await page.evaluate(() => {
    const stamp = document.querySelector<HTMLInputElement>('input[name="renderedAt"]');
    if (stamp) stamp.value = String(Date.now());
  });
  await page.locator('form button[type="submit"]').click();

  await expect(page.locator('form [role="alert"]')).toContainText(/rejected/i);
  expect(await leadsByEmail(email)).toHaveLength(0);
});
