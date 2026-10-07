import { expect, test } from "@playwright/test";
import { closeDb, deleteLeadsByEmail, leadsByEmail, outboxForLead, resetRateLimits } from "./helpers/store";

/**
 * The resilience claim that matters at a trade stand: a visitor scanning a QR
 * code on weak event wifi may never get the JavaScript bundle. The form is a
 * real <form action>, so it must still submit.
 *
 * With JS disabled there is no timing stamp and no client-side attribution —
 * the server skips the timing heuristic and derives the idempotency key from
 * the enquiry's own content instead.
 */
test.use({ javaScriptEnabled: false });
test.describe.configure({ mode: "serial" });
/**
 * A distinct client IP for this spec. The rate limiter keys on
 * x-forwarded-for, so without this the submission specs share one bucket and
 * trip the per-IP limit when they run in parallel — a test-environment
 * collision, not a product fault. Giving each spec its own address isolates
 * them and exercises the per-IP keying for real.
 */
test.use({ extraHTTPHeaders: { "x-forwarded-for": "203.0.113.22" } });

test.beforeEach(async () => {
  await resetRateLimits();
});

test.afterAll(async () => {
  await closeDb();
});

const email = () => `e2e.nojs.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@example.co.uk`;

test("submits an enquiry with JavaScript disabled", async ({ page }) => {
  const address = email();
  await page.goto("/care-show/leadership");

  // Prove the premise: no hydration has happened.
  const stamp = await page.locator('input[name="renderedAt"]').inputValue();
  expect(stamp, "renderedAt is set on mount, so it must be empty without JS").toBe("");

  await page.fill("#fullName", "Jordan Blake");
  await page.fill("#jobTitle", "Operations Director");
  await page.fill("#companyName", "Northwood Care Homes");
  await page.fill("#mobileNumber", "07912 345678");
  await page.fill("#email", address);
  await page.selectOption("#employeeBand", "1-49");
  await page.selectOption("#levyPayer", "no");
  await page.locator('form button[type="submit"]').click();

  await expect(page).toHaveURL(/\/enquiry-received\?ref=GSN-/);

  const rows = await leadsByEmail(address);
  expect(rows, "the enquiry must persist without JavaScript").toHaveLength(1);
  expect(rows[0]!.mobileNumber).toBe("+447912345678");
  expect(await outboxForLead(rows[0]!.id)).toHaveLength(1);

  await deleteLeadsByEmail(address);
});

test("still deduplicates a repeated no-JavaScript submission", async ({ page }) => {
  const address = email();

  for (const attempt of [1, 2]) {
    await page.goto("/care-show/ai-automation");
    await page.fill("#fullName", "Jordan Blake");
    await page.fill("#jobTitle", "Operations Director");
    await page.fill("#companyName", "Northwood Care Homes");
    await page.fill("#mobileNumber", "07912 345678");
    await page.fill("#email", address);
    await page.selectOption("#employeeBand", "1-49");
    await page.selectOption("#levyPayer", "unsure");
    await page.locator('form button[type="submit"]').click();
    await expect(page, `attempt ${attempt}`).toHaveURL(/\/enquiry-received/);
  }

  // The content-derived key works identically without a client-issued id.
  expect(await leadsByEmail(address)).toHaveLength(1);
  await deleteLeadsByEmail(address);
});

test("validation errors still render without JavaScript", async ({ page }) => {
  await page.goto("/care-show/leadership");
  await page.fill("#fullName", "J");
  await page.fill("#jobTitle", "Operations Director");
  await page.fill("#companyName", "Northwood Care Homes");
  await page.fill("#mobileNumber", "nope");
  await page.fill("#email", "also-nope");
  await page.selectOption("#employeeBand", "1-49");
  await page.selectOption("#levyPayer", "no");
  await page.locator('form button[type="submit"]').click();

  await expect(page.locator("#mobileNumber-error")).toBeVisible();
  await expect(page.locator("#email-error")).toBeVisible();
  await expect(page.locator("#companyName")).toHaveValue("Northwood Care Homes");
});
