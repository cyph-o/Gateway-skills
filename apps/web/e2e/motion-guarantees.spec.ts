import { expect, test } from "@playwright/test";

/**
 * The two motion guarantees that are about content rather than about the
 * animation itself: the capture form is never animated, and nothing is lost
 * when scroll timelines cannot advance. Split from motion.spec.ts to keep each
 * file within the project's size standard.
 */

test.describe("the enquiry form is never animated", () => {
  test.use({ reducedMotion: "no-preference" });

  test("capture form controls are opaque the moment they are on screen", async ({ page }) => {
    await page.goto("/care-show/leadership#register");
    await page.waitForTimeout(900);

    for (const id of ["#fullName", "#companyName", "#mobileNumber", "#email"]) {
      const opacity = await page.locator(id).evaluate((el) => getComputedStyle(el).opacity);
      expect(parseFloat(opacity), `${id} must not fade`).toBeGreaterThan(0.95);
    }
  });
});

test.describe("content survives a context where scroll timelines cannot advance", () => {
  test.use({ reducedMotion: "no-preference" });

  test("print styles force every reveal fully visible", async ({ page }) => {
    await page.goto("/care-show/leadership");
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(200);

    const hidden = await page.evaluate(() => {
      const bad: string[] = [];
      for (const el of Array.from(document.querySelectorAll("h1, h2, h3, li, p, form"))) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (el.closest('[aria-hidden="true"], .sr-only')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        if (parseFloat(cs.opacity) < 0.99) {
          bad.push(`${el.tagName} opacity=${cs.opacity} "${(el.textContent || "").trim().slice(0, 40)}"`);
        }
      }
      return bad;
    });

    expect(hidden, `Hidden when printing:\n${hidden.join("\n")}`).toEqual([]);
  });
});
