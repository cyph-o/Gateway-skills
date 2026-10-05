import { expect, test, type Page } from "@playwright/test";

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

/** Widths that matter: smallest phone still in use, iPhone, large phone,
 *  tablet portrait, tablet landscape, laptop, desktop. */
const WIDTHS = [320, 390, 430, 768, 1024, 1280, 1536];

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const offenders: string[] = [];
    for (const el of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      // Allow a 1px rounding tolerance.
      if (rect.right > doc.clientWidth + 1 || rect.left < -1) {
        offenders.push(`${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 60)}`);
      }
    }
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      offenders: offenders.slice(0, 5),
    };
  });
}

for (const route of ROUTES) {
  test(`${route} never scrolls sideways at any width`, async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: "load" });
      // Let fluid type and any late web font settle before measuring.
      await page.waitForTimeout(250);
      const result = await horizontalOverflow(page);
      expect(
        result.scrollWidth,
        `${route} at ${width}px overflowed. Offenders: ${result.offenders.join(", ")}`,
      ).toBeLessThanOrEqual(result.clientWidth + 1);
    }
  });
}

test("hero headline stays readable on a small phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/care-show/leadership");
  const h1 = page.locator("h1");
  await expect(h1).toBeVisible();
  const size = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  // Fluid clamp floor: large enough to lead the page, small enough to wrap.
  expect(size).toBeGreaterThanOrEqual(30);
  expect(size).toBeLessThanOrEqual(40);
});

test("form controls meet touch-target and no-zoom minimums", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/care-show/leadership");

  for (const name of ["fullName", "companyName", "mobileNumber", "email"]) {
    const field = page.locator(`#${name}`);
    const box = await field.boundingBox();
    expect(box!.height, `${name} touch target`).toBeGreaterThanOrEqual(44);
    const fontSize = await field.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    // Below 16px, iOS Safari zooms the viewport on focus.
    expect(fontSize, `${name} font size`).toBeGreaterThanOrEqual(16);
  }

  const submit = page.getByRole("button", { name: /secure my funding audit/i });
  const submitBox = await submit.boundingBox();
  expect(submitBox!.height).toBeGreaterThanOrEqual(44);
});

test("mobile navigation opens, closes and traps nothing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: /open menu/i });
  await expect(trigger).toBeVisible();
  await trigger.click();

  const panel = page.locator("#mobile-nav-panel");
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("link", { name: "Leadership" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});
