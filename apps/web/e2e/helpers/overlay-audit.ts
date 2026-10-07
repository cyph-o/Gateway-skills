import type { Locator, Page } from "@playwright/test";
import { extremes, type Extremes } from "./pixels";

/** Waits for every photograph that could sit behind text to be painted. */
export async function waitForImagery(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((done) => {
        const pending = Array.from(document.images).filter((i) => !i.complete);
        if (!pending.length) return done();
        let left = pending.length;
        const tick = () => --left <= 0 && done();
        pending.forEach((i) => {
          i.addEventListener("load", tick, { once: true });
          i.addEventListener("error", tick, { once: true });
        });
        setTimeout(done, 5000);
      }),
  );

  // Hero backdrops are painted from CSS background-image, which is absent from
  // document.images — so the wait above returns while they are still loading.
  await page.evaluate(async () => {
    const urls = new Set<string>();
    for (const el of Array.from(document.querySelectorAll("*"))) {
      const bg = getComputedStyle(el).backgroundImage;
      if (!bg || bg === "none") continue;
      for (const match of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) {
        if (match[1]) urls.add(match[1]);
      }
    }
    await Promise.all(
      Array.from(urls).map(
        (url) =>
          new Promise<void>((done) => {
            const img = new Image();
            img.addEventListener("load", () => done(), { once: true });
            img.addEventListener("error", () => done(), { once: true });
            img.src = url;
            if (img.complete) done();
            setTimeout(done, 5000);
          }),
      ),
    );
  });
}

const HIDE_STYLE = '[data-audit="1"] * { color: transparent !important; ' +
  "-webkit-text-fill-color: transparent !important; text-shadow: none !important; }";

/** Captures the pixels behind a text box with that section's text hidden, so
 *  the sample is pure background. */
async function captureBackground(page: Page, section: Locator, box: Extremes & object): Promise<Buffer> {
  await section.evaluate((node, css) => {
    node.setAttribute("data-audit", "1");
    const style = document.createElement("style");
    style.id = "audit-style";
    style.textContent = css;
    document.head.append(style);
  }, HIDE_STYLE);
  const shot = await page.screenshot({ clip: box as never });
  await section.evaluate((node) => {
    node.removeAttribute("data-audit");
    document.getElementById("audit-style")?.remove();
  });
  return shot;
}

/**
 * Samples until two consecutive captures agree.
 *
 * Reveal animations and lazily-decoded photographs mean an immediate capture
 * can catch a frame the visitor never really reads. What matters is the settled
 * state, and a genuine contrast failure is stable, so it still fails.
 */
export async function settledExtremes(
  page: Page,
  section: Locator,
  box: object,
): Promise<Extremes> {
  let prev = await extremes(page, await captureBackground(page, section, box as never));
  for (let attempt = 0; attempt < 6; attempt += 1) {
    await page.waitForTimeout(150);
    const next = await extremes(page, await captureBackground(page, section, box as never));
    if (Math.abs(next.min - prev.min) < 0.01 && Math.abs(next.max - prev.max) < 0.01) return next;
    prev = next;
  }
  return prev;
}

/**
 * Holds one carousel plate visible with the animation stopped, so each
 * photograph is audited in turn. Checking whichever frame happened to be up
 * would leave the other plates untested and the result decided by timing.
 * Pass null to restore the running carousel.
 */
export async function pinSlide(section: Locator, index: number | null): Promise<void> {
  await section.evaluate((node, i) => {
    const slides = Array.from(node.querySelectorAll<HTMLElement>(".hero-slide"));
    slides.forEach((slide, j) => {
      if (i === null) {
        slide.style.animation = "";
        slide.style.opacity = "";
        return;
      }
      slide.style.animation = "none";
      slide.style.opacity = j === i ? "1" : "0";
    });
  }, index);
}
