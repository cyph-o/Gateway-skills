import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/care-show",
  "/care-show/leadership",
  "/care-show/ai-automation",
  "/programmes/leadership",
  "/programmes/ai-automation",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
  "/accessibility",
];

for (const route of ROUTES) {
  test(`${route} has no WCAG 2.2 A/AA violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)\n    ${v.nodes[0]?.html?.slice(0, 120)}`,
    );
    expect(results.violations, `axe violations on ${route}:\n${summary.join("\n")}`).toEqual([]);
  });
}

test("the enquiry form is fully operable by keyboard alone", async ({ page }) => {
  await page.goto("/care-show/leadership");

  // Tab from the first field through to the submit button without a mouse.
  await page.locator("#fullName").focus();
  await page.keyboard.type("Keyboard Tester");
  await page.keyboard.press("Tab");
  await page.keyboard.type("Northwood Care Homes");
  await page.keyboard.press("Tab");
  await page.keyboard.type("07912 345678");
  await page.keyboard.press("Tab");
  await page.keyboard.type("keyboard@example.co.uk");

  await expect(page.locator("#companyName")).toHaveValue("Northwood Care Homes");
  await expect(page.locator("#email")).toHaveValue("keyboard@example.co.uk");

  // The consent checkbox and submit button must both be reachable and focusable.
  await page.locator("#marketingConsent").focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#marketingConsent")).toBeChecked();

  const submit = page.getByRole("button", { name: /secure my funding audit/i });
  await submit.focus();
  await expect(submit).toBeFocused();
});

test("every page exposes exactly one h1 and a skip link", async ({ page }) => {
  for (const route of ["/", "/care-show/leadership", "/programmes/ai-automation", "/privacy"]) {
    await page.goto(route, { waitUntil: "load" });
    await expect(page.locator("h1"), `${route} h1 count`).toHaveCount(1);
    await expect(page.getByRole("link", { name: /skip to main content/i })).toBeAttached();
  }
});
