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

test.beforeEach(async () => {
  await resetRateLimits();
});

test.afterAll(async () => {
  await closeDb();
});

async function fillForm(page: import("@playwright/test").Page, email: string) {
  await page.fill("#fullName", FILLED.fullName);
  await page.fill("#companyName", FILLED.companyName);
  await page.fill("#mobileNumber", FILLED.mobileNumber);
  await page.fill("#email", email);
  // The server rejects submissions faster than a human could type.
  await page.waitForTimeout(MIN_FILL_MS + 300);
}

test("submits an enquiry, persists it transactionally and confirms with a reference", async ({
  page,
}) => {
  const email = uniqueEmail("happy");
  await page.goto("/care-show/leadership?utm_source=care_show&utm_medium=qr&utm_campaign=q4_2026");
  await fillForm(page, email);
  await page.getByRole("button", { name: /secure my funding audit/i }).click();

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
    await page.getByRole("button", { name: /secure my funding audit/i }).click();
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
  await page.fill("#companyName", "Example Care Group Ltd");
  await page.fill("#mobileNumber", "not-a-number");
  await page.fill("#email", "not-an-email");
  await page.waitForTimeout(MIN_FILL_MS + 300);
  await page.getByRole("button", { name: /secure my funding audit/i }).click();

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
  await page.getByRole("button", { name: /secure my funding audit/i }).click();

  await expect(page.locator('form [role="alert"]')).toContainText(/rejected/i);
  expect(await leadsByEmail(email)).toHaveLength(0);
});

test("submitting too quickly is rejected as mechanical", async ({ page }) => {
  const email = uniqueEmail("fast");
  await page.goto("/care-show/leadership");
  await page.fill("#fullName", FILLED.fullName);
  await page.fill("#companyName", FILLED.companyName);
  await page.fill("#mobileNumber", FILLED.mobileNumber);
  await page.fill("#email", email);
  // Deliberately no wait: under MIN_FILL_MS.
  await page.getByRole("button", { name: /secure my funding audit/i }).click();

  await expect(page.locator('form [role="alert"]')).toContainText(/rejected/i);
  expect(await leadsByEmail(email)).toHaveLength(0);
});
