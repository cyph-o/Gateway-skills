import { expect, test } from "@playwright/test";

/**
 * The resilience claim that matters at a trade stand: a visitor scanning a QR
 * code on weak event wifi may never get the JavaScript bundle. The form posts
 * natively to Web3Forms, which redirects to the confirmation page. The
 * endpoint is stubbed so no real email is sent.
 */
test.use({ javaScriptEnabled: false });

const WEB3FORMS = "https://api.web3forms.com/submit";

test("submits an enquiry with JavaScript disabled", async ({
  page,
  baseURL,
}) => {
  let posted = "";
  await page.route(WEB3FORMS, async (route) => {
    posted = route.request().postData() ?? "";
    await route.fulfill({
      status: 303,
      headers: { location: `${baseURL}/enquiry-received` },
    });
  });

  await page.goto("/care-show/leadership");
  await page.fill("#fullName", "Jordan Blake");
  await page.fill("#jobTitle", "Operations Director");
  await page.fill("#companyName", "Northwood Care Homes");
  await page.fill("#mobileNumber", "07912 345678");
  await page.fill("#email", "jordan@northwood.example");
  await page.selectOption("#employeeBand", "1-49");
  await page.selectOption("#levyPayer", "no");
  await page.locator('form button[type="submit"]').click();

  await expect(page).toHaveURL(/\/enquiry-received/);
  const fields = new URLSearchParams(posted);
  expect(fields.get("access_key")).toBe("c9b68c8c-d111-4a14-92df-bc0cfe78ff86");
  expect(fields.get("email")).toBe("jordan@northwood.example");
  expect(fields.get("redirect")).toMatch(/\/enquiry-received$/);
  expect(fields.get("botcheck")).toBe("");
});

test("the browser blocks an incomplete form without JavaScript", async ({
  page,
}) => {
  let posts = 0;
  await page.route(WEB3FORMS, async (route) => {
    posts += 1;
    await route.abort();
  });

  await page.goto("/care-show/leadership");
  await page.fill("#email", "not-an-email");
  await page.locator('form button[type="submit"]').click();

  await expect(page).toHaveURL(/\/care-show\/leadership/);
  expect(
    await page
      .locator("#fullName")
      .evaluate((el: HTMLInputElement) => el.validity.valueMissing),
  ).toBe(true);
  expect(
    await page
      .locator("#email")
      .evaluate((el: HTMLInputElement) => el.validity.typeMismatch),
  ).toBe(true);
  expect(posts).toBe(0);
});
