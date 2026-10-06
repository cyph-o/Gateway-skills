import { expect, test } from "@playwright/test";

const INDEXABLE = [
  "/",
  "/programmes/frontline",
  "/programmes/leadership",
  "/programmes/ai-automation",
  "/care-show",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
  "/accessibility",
];

/** Campaign routes canonicalise to their evergreen programme page. */
const CANONICALISED: Record<string, string> = {
  "/care-show/leadership": "/programmes/leadership",
  "/care-show/ai-automation": "/programmes/ai-automation",
};

test.describe("every page carries the metadata search engines need", () => {
  for (const route of INDEXABLE) {
    test(`${route} has a unique title, description and canonical`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const title = await page.title();
      expect(title.length, `${route} title length`).toBeGreaterThan(15);
      expect(title.length, `${route} title should not be truncated in SERPs`).toBeLessThan(75);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `${route} needs a description`).toBeTruthy();
      expect(description!.length).toBeGreaterThan(60);
      expect(description!.length).toBeLessThan(185);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, `${route} needs a canonical`).toContain(route === "/" ? "/" : route);

      // Open Graph, or the link preview is a blank card.
      for (const prop of ["og:title", "og:description", "og:image", "og:url"]) {
        const value = await page.locator(`meta[property="${prop}"]`).first().getAttribute("content");
        expect(value, `${route} missing ${prop}`).toBeTruthy();
      }

      // Exactly one h1 per page.
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }

  test("titles and descriptions are not duplicated across pages", async ({ page }) => {
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();

    for (const route of INDEXABLE) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const title = await page.title();
      const description =
        (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";

      const titleClash = [...titles.entries()].find(([, t]) => t === title);
      expect(titleClash, `${route} duplicates the title of ${titleClash?.[0]}`).toBeUndefined();
      const descClash = [...descriptions.entries()].find(([, d]) => d === description);
      expect(descClash, `${route} duplicates the description of ${descClash?.[0]}`).toBeUndefined();

      titles.set(route, title);
      descriptions.set(route, description);
    }
  });

  for (const [campaign, target] of Object.entries(CANONICALISED)) {
    test(`${campaign} canonicalises to ${target}`, async ({ page }) => {
      await page.goto(campaign, { waitUntil: "domcontentloaded" });
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toContain(target);
    });
  }

  test("the confirmation page is excluded from search", async ({ page }) => {
    await page.goto("/enquiry-received?ref=GSN-TEST01", { waitUntil: "domcontentloaded" });
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toContain("noindex");
  });
});

test.describe("structured data", () => {
  test("the organisation schema is valid and carries real contact details", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);

    const parsed = blocks.map((b) => JSON.parse(b));
    const org = parsed.find((d) => d["@type"] === "Organization");
    expect(org, "homepage needs Organization schema").toBeTruthy();
    expect(org.name).toContain("Gateway Skills Network");
    expect(org.address.postalCode).toBe("WC2H 9JQ");
    expect(org.telephone).toBeTruthy();
    expect(org.email).toContain("@gatewayskillsnetwork.co.uk");

    // No invented social proof: review markup on a site with no reviews is
    // both false and a documented search penalty.
    expect(org.aggregateRating, "must not fabricate ratings").toBeUndefined();
    expect(org.review, "must not fabricate reviews").toBeUndefined();
  });

  test("programme pages declare a programme and a breadcrumb", async ({ page }) => {
    for (const route of [
      "/programmes/frontline",
      "/programmes/leadership",
      "/programmes/ai-automation",
    ]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const parsed = (
        await page.locator('script[type="application/ld+json"]').allTextContents()
      ).map((b) => JSON.parse(b));

      expect(
        parsed.find((d) => d["@type"] === "EducationalOccupationalProgram"),
        `${route} needs programme schema`,
      ).toBeTruthy();
      expect(
        parsed.find((d) => d["@type"] === "BreadcrumbList"),
        `${route} needs a breadcrumb`,
      ).toBeTruthy();
    }
  });
});

test.describe("crawlability", () => {
  test("robots.txt points at the sitemap and shields private routes", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("/enquiry-received");
    expect(body).toContain("/api/");
  });

  test("the sitemap lists every indexable page and no campaign duplicates", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();

    for (const route of INDEXABLE) {
      expect(xml, `sitemap missing ${route}`).toContain(route === "/" ? "<loc>" : route);
    }
    // Campaign routes canonicalise elsewhere, so listing them would split signals.
    for (const campaign of Object.keys(CANONICALISED)) {
      expect(xml, `sitemap must not list ${campaign}`).not.toContain(campaign);
    }
  });

  test("the browser tab icon and touch icon both resolve", async ({ request }) => {
    for (const path of ["/icon.svg", "/apple-icon"]) {
      const res = await request.get(path);
      expect(res.status(), `${path} must resolve`).toBe(200);
      expect(res.headers()["content-type"]).toMatch(/image\/(svg\+xml|png)/);
    }
  });
});
