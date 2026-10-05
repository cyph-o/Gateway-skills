import { expect, test, type Page } from "@playwright/test";

/** WCAG 2.2 relative luminance and contrast ratio. */
const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: number[]) =>
  0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!);
const parse = (css: string) => css.match(/\d+/g)!.slice(0, 3).map(Number);
const contrast = (fg: string, bg: string) => {
  const [hi, lo] = [luminance(parse(fg)), luminance(parse(bg))].sort((a, b) => b - a);
  return (hi! + 0.05) / (lo! + 0.05);
};

async function textSamples(page: Page) {
  return page.evaluate(() => {
    const effectiveBg = (el: Element): string => {
      let node: Element | null = el;
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
        node = node.parentElement;
      }
      return "rgb(255, 255, 255)";
    };
    const out: { text: string; color: string; bg: string; size: number; weight: string }[] = [];
    for (const el of Array.from(document.querySelectorAll("p, h1, h2, h3, h4, li, a, span, dt, dd, label"))) {
      const text = el.textContent?.trim();
      if (!text || text.length < 4 || el.children.length > 0) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      // Deliberately off-screen / hidden from assistive tech (e.g. the honeypot).
      if (el.closest('[aria-hidden="true"], .sr-only')) continue;
      // Text over a photograph has no resolvable background-color; those
      // sections are verified by sampling real pixels in overlay.spec.ts.
      if (el.closest("[data-overlay]")) continue;
      out.push({
        text: text.slice(0, 50),
        color: cs.color,
        bg: effectiveBg(el),
        size: parseFloat(cs.fontSize),
        weight: cs.fontWeight,
      });
    }
    return out;
  });
}

const ROUTES = [
  "/",
  "/care-show/leadership",
  "/care-show/ai-automation",
  "/programmes/leadership",
  "/programmes/ai-automation",
];

for (const route of ROUTES) {
  test(`${route} meets WCAG AA text contrast`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(300);

    const failures: string[] = [];
    for (const sample of await textSamples(page)) {
      const ratio = contrast(sample.color, sample.bg);
      const isLarge =
        sample.size >= 24 || (sample.size >= 18.66 && Number(sample.weight) >= 700);
      const minimum = isLarge ? 3 : 4.5;
      if (ratio < minimum) {
        failures.push(`${ratio.toFixed(2)}:1 (need ${minimum}) at ${sample.size}px — "${sample.text}"`);
      }
    }
    expect(failures, `Contrast failures on ${route}:\n${failures.join("\n")}`).toHaveLength(0);
  });
}
