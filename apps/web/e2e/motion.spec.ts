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

    // Assert the page actually travelled, rather than that the target starts
    // fully off-screen: the hero is short enough now that #register can already
    // be a pixel or two into view, which made that precondition flaky.
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBe(0);

    // The hero CTA is an in-page anchor, not a navigation.
    await page.locator('a[href="#register"]').first().click();
    await expect(page).toHaveURL(/#register$/);

    // Allow the glide to finish, then confirm it actually arrived.
    await expect(form).toBeInViewport({ ratio: 0.3, timeout: 6000 });
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });

  test("the landed section clears the sticky header", async ({ page }) => {
    await page.goto("/care-show/leadership#register");

    // Wait for the glide to actually stop. A fixed timeout is a guess, and
    // under parallel workers on a loaded machine it was expiring mid-scroll.
    await page.waitForFunction(
      () =>
        new Promise<boolean>((resolve) => {
          let last = window.scrollY;
          let settled = 0;
          const tick = () => {
            if (window.scrollY === last) {
              settled += 1;
              if (settled >= 3) return resolve(true);
            } else {
              settled = 0;
              last = window.scrollY;
            }
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      undefined,
      { timeout: 10_000 },
    );

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
