import { expect, test, type Page } from "@playwright/test";
import { ratio, textLuminance } from "./helpers/pixels";
import { pinSlide, settledExtremes, waitForImagery } from "./helpers/overlay-audit";

// Screenshotting and decoding a region per text element is inherently slow,
// and each carousel plate is audited separately.
test.describe.configure({ timeout: 240_000 });

/** Per section, sampling every paragraph adds cost without adding signal: the
 *  heading and the first body line already prove the scrim over that image. */
const MAX_SAMPLES_PER_SECTION = 4;

/**
 * Text sitting on a photograph cannot be checked from the DOM — there is no
 * background-color to resolve, and the real risk is a bright patch of the image
 * showing through the scrim under one line of a heading.
 *
 * So this measures what is actually painted: hide the section's text, capture
 * the pixels where that text sits, take the worst pixel (brightest behind light
 * text, darkest behind dark text), and check the real contrast ratio.
 */
async function auditOverlays(page: Page, route: string): Promise<string[]> {
  await page.goto(route, { waitUntil: "load" });
  await waitForImagery(page);

  const failures: string[] = [];
  // Photographic heroes carry text over an image exactly as overlay bands do.
  const sections = page.locator("[data-overlay], section:has(.hero-slide)");

  for (let i = 0; i < (await sections.count()); i += 1) {
    const section = sections.nth(i);
    const slideCount = await section.locator(".hero-slide").count();
    // A carousel is audited once per plate; a static band once.
    const plates: (number | null)[] =
      slideCount > 0 ? Array.from({ length: slideCount }, (_, n) => n) : [null];

    for (const plate of plates) {
      if (plate !== null) await pinSlide(section, plate);
      const label = plate === null ? "" : ` [slide ${plate + 1}]`;

      const texts = section.locator("h1, h2, p, dd span");
      const sampleCount = Math.min(await texts.count(), MAX_SAMPLES_PER_SECTION);
      for (let j = 0; j < sampleCount; j += 1) {
        const el = texts.nth(j);
        const content = (await el.textContent())?.trim() ?? "";
        if (content.length < 3) continue;

        // Scroll the ELEMENT, not the section: these sections are taller than
        // the test viewport, so aligning the section can leave the text outside
        // it and the clip then samples the wrong pixels entirely.
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);

        const info = await el.evaluate((node) => {
          const cs = getComputedStyle(node);
          const r = node.getBoundingClientRect();
          return {
            color: cs.color,
            size: parseFloat(cs.fontSize),
            weight: cs.fontWeight,
            // Viewport screenshot, so viewport coordinates. (Adding the scroll
            // offset would be correct only for fullPage captures.)
            box: { x: r.x, y: r.y, width: r.width, height: r.height },
          };
        });
        if (info.box.width < 8 || info.box.height < 8) continue;

        // Only measure what is genuinely on screen — a clamped clip is a
        // meaningless sample.
        const vp = page.viewportSize();
        if (
          !vp ||
          info.box.x < 0 ||
          info.box.y < 0 ||
          info.box.x + info.box.width > vp.width ||
          info.box.y + info.box.height > vp.height
        ) {
          continue;
        }

        const textLum = textLuminance(info.color);
        const { min, max } = await settledExtremes(page, section, info.box);

        // Worst case: compare against whichever extreme is nearest the text.
        const worst = Math.min(ratio(textLum, min), ratio(textLum, max));
        const large = info.size >= 24 || (info.size >= 18.66 && Number(info.weight) >= 700);
        const required = large ? 3 : 4.5;
        if (worst < required) {
          failures.push(
            `${worst.toFixed(2)}:1 (need ${required}) at ${info.size}px${label} — ` +
              `"${content.slice(0, 44)}"`,
          );
        }
      }
      if (plate !== null) await pinSlide(section, null);
    }
  }
  return failures;
}

for (const route of ["/", "/care-show/leadership"]) {
  test(`${route}: text over photography is readable against real pixels`, async ({ page }) => {
    const failures = await auditOverlays(page, route);
    expect(failures, `Overlay contrast failures on ${route}:\n${failures.join("\n")}`).toEqual([]);
  });
}
