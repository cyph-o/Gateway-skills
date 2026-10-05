import { expect, test } from "@playwright/test";

/**
 * Motion is covered here rather than in the functional specs, which run under
 * reduced motion for determinism. Both branches of the preference are asserted,
 * so neither can regress unnoticed.
 */

test.describe("in-page anchors glide to their section", () => {
  test.use({ reducedMotion: "no-preference" });

  test("smooth scrolling is enabled when motion is welcome", async ({ page }) => {
    await page.goto("/care-show/leadership");
    const behaviour = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behaviour).toBe("smooth");
  });

  test("a hero CTA scrolls the capture form into view", async ({ page }) => {
    await page.goto("/care-show/leadership");

    const form = page.locator("#register");
    await expect(form).not.toBeInViewport();

    // The hero CTA is an in-page anchor, not a navigation.
    await page.locator('a[href="#register"]').first().click();
    await expect(page).toHaveURL(/#register$/);

    // Allow the glide to finish, then confirm it actually arrived.
    await expect(form).toBeInViewport({ timeout: 5000 });
  });

  test("the landed section clears the sticky header", async ({ page }) => {
    await page.goto("/care-show/leadership#register");
    await page.waitForTimeout(800);

    const headerBottom = await page
      .locator("header")
      .evaluate((el) => el.getBoundingClientRect().bottom);
    const sectionTop = await page
      .locator("#register")
      .evaluate((el) => el.getBoundingClientRect().top);

    // scroll-margin-top must keep the section below the sticky header.
    expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 1);
  });
});

test.describe("reduced motion is respected", () => {
  test.use({ reducedMotion: "reduce" });

  test("scrolling jumps instantly instead of gliding", async ({ page }) => {
    await page.goto("/care-show/leadership");
    const behaviour = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behaviour).toBe("auto");
  });

  test("decorative animation is suppressed", async ({ page }) => {
    await page.goto("/");
    const duration = await page.evaluate(() => {
      const node = document.querySelector(".animate-pulse");
      return node ? getComputedStyle(node).animationDuration : null;
    });
    // The global reduced-motion rule collapses animations to ~0s.
    if (duration) expect(parseFloat(duration)).toBeLessThan(0.1);
  });
});

/**
 * The failure mode that matters: a reveal that never resolves leaves content
 * permanently invisible. On a lead-generation page that is catastrophic and
 * silent — the page looks blank rather than broken.
 *
 * Scroll-driven animations scrub with scroll position rather than firing once,
 * so an element below the fold is *correctly* transparent. The guarantee to
 * assert is therefore: anything actually on screen must be readable. Checked
 * at every scroll step, in both motion branches.
 */
for (const motion of ["no-preference", "reduce"] as const) {
  test.describe(`on-screen content is always readable (prefers-reduced-motion: ${motion})`, () => {
    test.use({ reducedMotion: motion });

    for (const route of ["/", "/care-show/leadership", "/programmes/leadership"]) {
      test(`${route} never shows a faded element in the viewport`, async ({ page }) => {
        await page.goto(route, { waitUntil: "load" });
        // The hero plays a staged on-load entrance (longest child delay 0.32s
        // + 0.85s duration). Let it finish before judging opacity.
        await page.waitForTimeout(1400);

        const height = await page.evaluate(() => document.body.scrollHeight);
        const faded: string[] = [];

        // Walk down the page the way a visitor would, pausing for each reveal.
        for (let y = 0; y < height; y += 500) {
          await page.evaluate(
            (top) => window.scrollTo({ top, behavior: "instant" as ScrollBehavior }),
            y,
          );
          await page.waitForTimeout(120);

          faded.push(
            ...(await page.evaluate(() => {
              const bad: string[] = [];
              const vh = window.innerHeight;
              for (const el of Array.from(
                document.querySelectorAll("h1, h2, h3, form, input, button, li, p"),
              )) {
                const r = el.getBoundingClientRect();
                // Only elements comfortably inside the viewport, away from the
                // edges where an entry animation is legitimately mid-flight.
                if (r.height === 0 || r.top < vh * 0.15 || r.bottom > vh * 0.85) continue;
                const cs = getComputedStyle(el);
                if (cs.visibility === "hidden" || cs.display === "none") continue;
                if (el.closest('[aria-hidden="true"], .sr-only')) continue;
                if (parseFloat(cs.opacity) < 0.9) {
                  bad.push(
                    `${el.tagName} opacity=${cs.opacity} "${(el.textContent || "").trim().slice(0, 40)}"`,
                  );
                }
              }
              return bad;
            })),
          );
        }

        expect(
          [...new Set(faded)],
          `Faded content inside the viewport on ${route}`,
        ).toEqual([]);
      });
    }
  });
}

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
