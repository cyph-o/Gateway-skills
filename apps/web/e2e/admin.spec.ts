import { expect, test } from "@playwright/test";
import { resetRateLimits } from "./helpers/store";

const PASSWORD = "care-show-admin-2026";

/** Its own IP so admin sign-in attempts do not share the public form's
 *  rate-limit bucket when specs run in parallel. */
test.use({ extraHTTPHeaders: { "x-forwarded-for": "203.0.113.44" } });

// Sign-in attempts are throttled per IP in a 10-minute window, so without
// this a third run of this file inside one window would fail on the limit
// rather than on anything the tests are about.
test.beforeEach(async () => {
  await resetRateLimits();
});

async function signIn(page: import("@playwright/test").Page, password = PASSWORD) {
  await page.goto("/admin/login");
  await page.fill("#password", password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

test.describe("the admin area is closed by default", () => {
  test("an unauthenticated visitor cannot reach the dashboard or any record", async ({ page }) => {
    for (const route of ["/admin", "/admin/leads/GSN-ANY123"]) {
      await page.goto(route);
      await expect(page, `${route} must redirect`).toHaveURL(/\/admin\/login/);
      // The guard must not leak what it was protecting.
      await expect(page.locator("body")).not.toContainText(/@example\.co\.uk/);
    }
  });

  test("a wrong password is rejected without revealing why", async ({ page }) => {
    await signIn(page, "definitely-not-the-password");
    await expect(page.locator('form [role="alert"]')).toContainText(/sign in failed/i);
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("the admin area is excluded from search engines", async ({ page }) => {
    await page.goto("/admin/login");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toContain("noindex");
  });
});

test.describe("an enquiry flows from the public form to the dashboard", () => {
  test("submit, sign in, find it, open it, sign out", async ({ page }) => {
    const email = `admin.e2e.${Date.now()}@example.co.uk`;
    const company = `Dashboard Check ${Date.now()}`;

    await page.goto("/#enquire");
    await page.fill("#fullName", "Dana Whitfield");
    await page.fill("#jobTitle", "Registered Manager");
    await page.fill("#companyName", company);
    await page.fill("#mobileNumber", "07912 345678");
    await page.fill("#email", email);
    await page.selectOption("#employeeBand", "50-249");
    await page.selectOption("#levyPayer", "unsure");
    await page.check("#interest-dual_pathway");
    await page.waitForTimeout(2300);
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/enquiry-received\?ref=GSN-/);
    const reference = new URL(page.url()).searchParams.get("ref")!;

    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Enquiries" })).toBeVisible();

    // Search narrows to the record just captured.
    await page.fill('input[name="q"]', company);
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByRole("link", { name: reference })).toBeVisible();

    await page.getByRole("link", { name: reference }).click();
    await expect(page).toHaveURL(new RegExp(`/admin/leads/${reference}`));

    // Every field the form captured must be readable here, or the dashboard
    // is not actually usable for following a lead up.
    for (const value of [
      company,
      "Dana Whitfield",
      "Registered Manager",
      email,
      "+447912345678",
      "50-249",
      "unsure",
      "Level 6 & Level 7 Combined Pathway",
    ]) {
      await expect(page.locator("dl")).toContainText(value);
    }

    await page.goto("/admin");
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/admin\/login/);

    // The session must really be gone, not just visually.
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
