import { expect, test, type Page } from "@playwright/test";

/**
 * Text sitting on a photograph cannot be checked from the DOM — there is no
 * background-color to resolve, and the real risk is a bright patch of the
 * image showing through the scrim under one line of a heading.
 *
 * So this measures what is actually painted: hide the section's text, capture
 * the pixels where that text sits, take the WORST pixel (brightest behind
 * light text, darkest behind dark text), and check the real contrast ratio.
 */

const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = (r: number, g: number, b: number) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratio = (a: number, b: number) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * Luminance extremes of a PNG, decoded in the browser via canvas. Doing it
 * here rather than with a native image library keeps the suite free of binary
 * dependencies — one less thing to break on a different machine or in CI.
 */
async function extremes(page: Page, png: Buffer) {
  return page.evaluate(async (dataUrl: string) => {
    const bitmap = await createImageBitmap(await (await fetch(dataUrl)).blob());
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const toLinear = (c: number) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    const lums: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      lums.push(
        0.2126 * toLinear(data[i]!) +
          0.7152 * toLinear(data[i + 1]!) +
          0.0722 * toLinear(data[i + 2]!),
      );
    }
    lums.sort((a, b) => a - b);
    const at = (p: number) => lums[Math.min(lums.length - 1, Math.floor(lums.length * p))]!;
    // 10th/90th percentile: tolerant of a few stray pixels, strict about a
    // genuinely light or dark region sitting behind the text.
    return { min: at(0.1), max: at(0.9) };
  }, `data:image/png;base64,${png.toString("base64")}`);
}

async function auditOverlays(page: Page, route: string) {
  await page.goto(route, { waitUntil: "load" });
  await page.evaluate(
    () =>
      new Promise<void>((done) => {
        const p = Array.from(document.images).filter((i) => !i.complete);
        if (!p.length) return done();
        let n = p.length;
        const tick = () => --n <= 0 && done();
        p.forEach((i) => {
          i.addEventListener("load", tick, { once: true });
          i.addEventListener("error", tick, { once: true });
        });
        setTimeout(done, 5000);
      }),
  );

  const failures: string[] = [];
  // Photographic heroes carry text over an image exactly as overlay bands do.
  const sections = page.locator('[data-overlay], section:has(.hero-slide)');

  for (let i = 0; i < (await sections.count()); i += 1) {
    const section = sections.nth(i);
    const texts = section.locator("h1, h2, p, dd span");
    for (let j = 0; j < (await texts.count()); j += 1) {
      const el = texts.nth(j);
      const content = (await el.textContent())?.trim() ?? "";
      if (content.length < 3) continue;

      // Scroll the ELEMENT, not the section: these sections are taller than a
      // 720px test viewport, so aligning the section can leave the text
      // outside it and the clip then samples the wrong pixels entirely.
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

      // Hide every bit of text in the section, so the capture is pure background.
      await section.evaluate((node) => {
        node.setAttribute("data-audit", "1");
        const style = document.createElement("style");
        style.id = "audit-style";
        style.textContent = '[data-audit="1"] * { color: transparent !important; }';
        document.head.append(style);
      });

      const shot = await page.screenshot({ clip: info.box });

      await section.evaluate((node) => {
        node.removeAttribute("data-audit");
        document.getElementById("audit-style")?.remove();
      });

      const [r, g, b] = info.color.match(/\d+/g)!.slice(0, 3).map(Number);
      const textLum = lum(r!, g!, b!);

      let { min, max } = await extremes(page, shot);
      // A perfectly uniform sample means the frame was captured before the
      // photograph and scrim painted — under full-suite parallelism that
      // happens occasionally. Re-capture once rather than assert on a blank.
      if (max - min < 0.001) {
        await page.waitForTimeout(400);
        await section.evaluate((node) => {
          node.setAttribute("data-audit", "1");
          const style = document.createElement("style");
          style.id = "audit-style";
          style.textContent = '[data-audit="1"] * { color: transparent !important; }';
          document.head.append(style);
        });
        const retry = await page.screenshot({ clip: info.box });
        await section.evaluate((node) => {
          node.removeAttribute("data-audit");
          document.getElementById("audit-style")?.remove();
        });
        ({ min, max } = await extremes(page, retry));
      }
      // Worst case: compare against whichever extreme is nearest the text.
      const worst = Math.min(ratio(textLum, min), ratio(textLum, max));

      const large = info.size >= 24 || (info.size >= 18.66 && Number(info.weight) >= 700);
      const required = large ? 3 : 4.5;
      if (worst < required) {
        failures.push(
          `${worst.toFixed(2)}:1 (need ${required}) at ${info.size}px — "${content.slice(0, 44)}"`,
        );
      }
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
