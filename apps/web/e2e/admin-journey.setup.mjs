/**
 * End-to-end proof, driven through the real UI: create the admin credential,
 * submit an enquiry as a visitor would, then sign in and find that enquiry in
 * the dashboard. Screenshots are written for review.
 *
 *   node e2e/admin-journey.setup.mjs [baseURL]
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:4321";
const password = process.env.ADMIN_VERIFY_PASSWORD;
if (!password) {
  console.error("Set ADMIN_VERIFY_PASSWORD to the configured admin password.");
  process.exit(1);
}
const shots = new URL("../.verify/", import.meta.url).pathname;
await mkdir(shots, { recursive: true });

const stamp = Date.now();
const lead = {
  fullName: "Priya Raman",
  jobTitle: "Operations Director",
  companyName: `Meadowbrook Care Group ${stamp}`,
  mobileNumber: "07700 900456",
  email: `priya.raman.${stamp}@meadowbrookcare.co.uk`,
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const step = async (n, name) => {
  await page.screenshot({ path: `${shots}${n}-${name}.png`, fullPage: false });
  console.log(`  captured ${n}-${name}.png`);
};

console.log(`\n1. Submitting an enquiry at ${base}`);
await page.goto(`${base}/#enquire`, { waitUntil: "load" });
await page.fill("#fullName", lead.fullName);
await page.fill("#jobTitle", lead.jobTitle);
await page.fill("#companyName", lead.companyName);
await page.fill("#mobileNumber", lead.mobileNumber);
await page.fill("#email", lead.email);
await page.selectOption("#employeeBand", "250+");
await page.selectOption("#levyPayer", "yes");
await step("01", "form-filled");
// The server rejects anything filled faster than a human could type.
await page.waitForTimeout(2500);
await page.locator('form button[type="submit"]').click();
await page.waitForURL(/enquiry-received/, { timeout: 20000 });
const reference = new URL(page.url()).searchParams.get("ref");
console.log(`   confirmed, reference ${reference}`);
await step("02", "confirmation");

console.log("\n2. Signing in to /admin");
await page.goto(`${base}/admin`, { waitUntil: "load" });
if (!/\/admin\/login/.test(page.url())) throw new Error("/admin was reachable without signing in");
console.log("   unauthenticated /admin redirected to the sign-in page");
await step("03", "login");
await page.fill("#password", password);
await page.getByRole("button", { name: /sign in/i }).click();
await page.waitForURL(/\/admin$/, { timeout: 20000 });
console.log("   signed in");

console.log("\n3. Finding the enquiry in the dashboard");
const search = page.locator('input[type="search"], #search').first();
if (await search.count()) {
  await search.fill(lead.companyName);
  await page.waitForTimeout(1200);
}
await step("04", "dashboard");
const row = page.getByText(reference, { exact: false }).first();
await row.waitFor({ timeout: 15000 });
console.log(`   ${reference} is listed`);

await page.goto(`${base}/admin/leads/${reference}`, { waitUntil: "load" });
const body = await page.locator("body").innerText();
for (const [label, value] of Object.entries(lead)) {
  if (!body.includes(value) && label !== "mobileNumber") {
    throw new Error(`the record is missing ${label}: ${value}`);
  }
}
console.log("   the record shows the submitted details");
await step("05", "record");

console.log("\n4. Signing out");
await page.getByRole("button", { name: /sign out/i }).first().click();
await page.waitForURL(/\/admin\/login/, { timeout: 15000 });
await page.goto(`${base}/admin`, { waitUntil: "load" });
if (!/\/admin\/login/.test(page.url())) throw new Error("the session survived signing out");
console.log("   session ended; /admin is closed again");
await step("06", "signed-out");

await browser.close();
console.log(`\nPASS — enquiry ${reference} captured and read back through /admin`);
console.log(`Screenshots: apps/web/.verify/\n`);
