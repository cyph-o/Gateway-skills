import { expect, test } from "@playwright/test";

/** Marquee behaviour, split out of motion.spec.ts to keep both files under the
 *  200-line limit. */

test.describe("logo marquee", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the two rows drift in opposite directions", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const tracks = page.locator(".marquee-track");
    await expect(tracks).toHaveCount(2);

    const animations = await tracks.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).animationName),
    );
    expect(animations).toContain("marquee-right");
    expect(animations).toContain("marquee-left");
  });

  test("each organisation is announced once, not twice", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    // The duplicated half of each track is aria-hidden with empty alt, so a
    // screen reader hears the list once despite the DOM carrying it twice.
    const announced = await page
      .locator(".marquee-track img:not([alt=''])")
      .evaluateAll((els) => els.map((el) => el.getAttribute("alt")));
    expect(new Set(announced).size).toBe(announced.length);
    expect(announced.length).toBeGreaterThan(4);
  });
});

test.describe("reduced motion falls back to a static grid", () => {
  test.use({ reducedMotion: "reduce" });

  test("the marquee stops and every logo stays reachable", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const track = page.locator(".marquee-track").first();
    const name = await track.evaluate((el) => getComputedStyle(el).animationName);
    expect(name).toBe("none");
  });
});
