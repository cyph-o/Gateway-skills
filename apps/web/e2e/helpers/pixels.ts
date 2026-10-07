import type { Page } from "@playwright/test";

/**
 * Pixel luminance maths, shared by the contrast audits.
 *
 * Decoding happens in the browser via canvas rather than with a native image
 * library, which keeps the suite free of binary dependencies — one less thing
 * to break on a different machine or in CI.
 */

const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

export const lum = (r: number, g: number, b: number) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

export const ratio = (a: number, b: number) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

/** Luminance of the text colour as the browser computed it. */
export function textLuminance(cssColor: string): number {
  const [r, g, b] = cssColor.match(/\d+/g)!.slice(0, 3).map(Number);
  return lum(r!, g!, b!);
}

export interface Extremes {
  min: number;
  max: number;
}

/** 10th/90th percentile luminance of a PNG: tolerant of a few stray pixels,
 *  strict about a genuinely light or dark region sitting behind the text. */
export async function extremes(page: Page, png: Buffer): Promise<Extremes> {
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
        0.2126 * toLinear(data[i]!) + 0.7152 * toLinear(data[i + 1]!) + 0.0722 * toLinear(data[i + 2]!),
      );
    }
    lums.sort((a, b) => a - b);
    const at = (p: number) => lums[Math.min(lums.length - 1, Math.floor(lums.length * p))]!;
    return { min: at(0.1), max: at(0.9) };
  }, `data:image/png;base64,${png.toString("base64")}`);
}
