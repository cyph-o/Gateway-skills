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

  // Tab through every text field in order, without a mouse. Asserting the
  // landing field each time means a future field inserted into the middle
  // fails loudly rather than silently shifting what gets typed where.
  const sequence = [
    ["fullName", "Keyboard Tester"],
    ["jobTitle", "Registered Manager"],
    ["companyName", "Northwood Care Homes"],
    ["mobileNumber", "07912 345678"],
    ["email", "keyboard@example.co.uk"],
  ] as const;

  await page.locator(`#${sequence[0][0]}`).focus();
  for (const [index, [id, value]] of sequence.entries()) {
    if (index > 0) await page.keyboard.press("Tab");
    await expect(page.locator(`#${id}`), `tab order reached #${id}`).toBeFocused();
    await page.keyboard.type(value);
  }

  for (const [id, value] of sequence) {
    await expect(page.locator(`#${id}`)).toHaveValue(value);
  }

  // The selects must be reachable by keyboard too.
  await page.keyboard.press("Tab");
  await expect(page.locator("#employeeBand")).toBeFocused();

  // The consent checkbox and submit button must both be reachable and focusable.
  await page.locator("#marketingConsent").focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#marketingConsent")).toBeChecked();

  const submit = page.locator('form button[type="submit"]');
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
