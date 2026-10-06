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

/** Bounded wait for in-flight images. Never awaits decode() on a lazy image
 *  that has not started loading — that promise never resolves. */
async function settleImages(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((done) => {
        const pending = Array.from(document.images).filter((img) => !img.complete);
        if (pending.length === 0) return done();
        let left = pending.length;
        const tick = () => {
          if (--left <= 0) done();
        };
        for (const img of pending) {
          img.addEventListener("load", tick, { once: true });
          img.addEventListener("error", tick, { once: true });
        }
        setTimeout(done, 1200);
      }),
  );
}

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
    // Navigate once, then resize. Re-navigating per width multiplied load time
    // by seven and blew the test budget once photography was added; resizing
    // exercises the same reflow and keeps images warm.
    await page.setViewportSize({ width: WIDTHS[0]!, height: 900 });
    await page.goto(route, { waitUntil: "load" });
    await settleImages(page);

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      // Let fluid type, grid reflow and any late web font settle.
      await page.waitForTimeout(220);

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

  for (const name of ["fullName", "jobTitle", "companyName", "mobileNumber", "email"]) {
    const field = page.locator(`#${name}`);
    const box = await field.boundingBox();
    expect(box!.height, `${name} touch target`).toBeGreaterThanOrEqual(44);
    const fontSize = await field.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    // Below 16px, iOS Safari zooms the viewport on focus.
    expect(fontSize, `${name} font size`).toBeGreaterThanOrEqual(16);
  }

  const submit = page.locator('form button[type="submit"]');
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

test("the mobile menu opens wherever the visitor has scrolled to", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "load" });

  // Regression: a body scroll-lock used to stop the sticky header sticking,
  // which threw the panel (anchored to that header) far off-screen. The menu
  // then looked broken until you scrolled back to the top.
  for (const y of [0, 1500, 4000]) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(250);

    await page.getByRole("button", { name: /open menu/i }).click();
    const panel = page.locator("#mobile-nav-panel");
    await expect(panel, `panel at scrollY=${y}`).toBeInViewport();
    await expect(panel.getByRole("link", { name: "Funding" })).toBeVisible();

    // The header must stay pinned while the menu is open.
    const headerTop = await page
      .locator("header")
      .evaluate((el) => Math.round(el.getBoundingClientRect().top));
    expect(headerTop, `header must stay stuck at scrollY=${y}`).toBe(0);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  }
});

/**
 * The hero is the first thing a QR-code visitor sees. If the call to action is
 * below the fold on load, the page has failed before it started — which is
 * exactly what happened when the headline copy grew to ~100 characters and the
 * display scale was still tuned for a short one.
 */
const FOLD_CASES = [
  { label: "desktop", width: 1440, height: 820 },
  { label: "laptop", width: 1280, height: 700 },
  { label: "short laptop", width: 1280, height: 620 },
  { label: "tablet", width: 834, height: 1050 },
  { label: "phone", width: 390, height: 730 },
  { label: "small phone", width: 375, height: 600 },
];

for (const route of ["/", "/care-show/leadership"]) {
  test(`${route}: the hero call to action is above the fold on every screen`, async ({ page }) => {
    for (const { label, width, height } of FOLD_CASES) {
      await page.setViewportSize({ width, height });
      await page.goto(route, { waitUntil: "load" });
      await page.waitForTimeout(300);

      const cta = page.locator("section").first().getByRole("link").first();
      await expect(cta, `${route} CTA on ${label}`).toBeInViewport();
    }
  });
}

test("the hero owns the first screen: nothing below it peeks above the fold", async ({ page }) => {
  for (const { label, width, height } of FOLD_CASES) {
    await page.setViewportSize({ width, height });
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(300);

    // The trust banner is the first thing after the hero. If any of it shows
    // on load it competes with the headline for the opening impression.
    const banner = page.getByText(/^Delivering High-Impact Professional Development/);
    await expect(banner, `trust banner must stay below the fold on ${label}`).not.toBeInViewport();

    // ...without pushing the call to action off-screen to achieve it.
    const cta = page.locator("section").first().getByRole("link").first();
    await expect(cta, `hero CTA on ${label}`).toBeInViewport();
  }
});
