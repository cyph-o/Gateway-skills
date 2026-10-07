import { expect, test, type Page, type Request } from "@playwright/test";

/**
 * Enquiries go to the Gateway inbox through Web3Forms. Every spec here stubs
 * the Web3Forms endpoint, so the suite never sends a real email; the stub
 * records what the form posted so the email's contents can be asserted.
 */
const WEB3FORMS = "https://api.web3forms.com/submit";

async function stubWeb3Forms(
  page: Page,
  reply: { status?: number; body?: unknown; delayMs?: number } = {},
): Promise<Request[]> {
  const requests: Request[] = [];
  await page.route(WEB3FORMS, async (route) => {
    requests.push(route.request());
    if (reply.delayMs) await new Promise((r) => setTimeout(r, reply.delayMs));
    await route.fulfill({
      status: reply.status ?? 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(
        reply.body ?? { success: true, message: "Email sent successfully!" },
      ),
    });
  });
  return requests;
}

/** Decodes the multipart body the form posted into label → value(s). */
function postedFields(request: Request): Record<string, string> {
  const body = request.postData() ?? "";
  const out: Record<string, string> = {};
  for (const part of body.split(/------\S+/)) {
    const match = part.match(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/);
    if (match) out[match[1]!] = match[2]!;
  }
  return out;
}

async function fillForm(page: Page, email = "sarah@abc-care.co.uk") {
  await page.fill("#fullName", "Sarah Johnson");
  await page.fill("#jobTitle", "Registered Home Manager");
  await page.fill("#companyName", "ABC Care Home");
  await page.fill("#mobileNumber", "07123 456789");
  await page.fill("#email", email);
  await page.selectOption("#employeeBand", "50-249");
  await page.selectOption("#levyPayer", "no");
}

const submit = (page: Page) => page.locator('form button[type="submit"]');

test("sends a labelled enquiry to Web3Forms, confirms in place and resets", async ({
  page,
}) => {
  const requests = await stubWeb3Forms(page, { delayMs: 600 });
  await page.goto("/care-show/leadership?utm_source=care_show&utm_medium=qr");
  await fillForm(page);
  await page.check("#interest-ai_automation");
  await page.check("#interest-dual_pathway");
  await page.check("#marketingConsent");

  await submit(page).click();

  // In flight: a loading label, and disabled so a second tap cannot resend.
  await expect(submit(page)).toHaveText(/Submitting/);
  await expect(submit(page)).toBeDisabled();

  await expect(page.locator("form").getByRole("status")).toContainText(
    "Your enquiry has been submitted successfully",
  );
  await expect(page).toHaveURL(/\/care-show\/leadership/);
  expect(requests).toHaveLength(1);

  const fields = postedFields(requests[0]!);
  expect(fields).toMatchObject({
    access_key: "c9b68c8c-d111-4a14-92df-bc0cfe78ff86",
    subject: "New Enquiry from Sarah Johnson - Gateway Skills Network",
    replyto: "sarah@abc-care.co.uk",
    Name: "Sarah Johnson",
    "Job Title": "Registered Home Manager",
    Company: "ABC Care Home",
    Mobile: "+447123456789",
    "Work Email": "sarah@abc-care.co.uk",
    "Number of UK Employees": "50 to 249",
    "Apprenticeship Levy": "No",
    "Programme Interest":
      "Level 4 AI Automation Track\r\nLevel 6 & Level 7 Combined Pathway",
    "Campaign Tracking": "utm_source: care_show\r\nutm_medium: qr",
  });
  expect(fields["Marketing Consent"]).toMatch(/^Yes/);

  // Reset for the next visitor at the stand, with the button back to normal.
  await expect(page.locator("#fullName")).toHaveValue("");
  await expect(page.locator("#interest-ai_automation")).not.toBeChecked();
  await expect(submit(page)).toBeEnabled();
});

test("blocks an empty form with inline errors and sends nothing", async ({
  page,
}) => {
  const requests = await stubWeb3Forms(page);
  await page.goto("/care-show/leadership");
  await submit(page).click();

  await expect(page.locator("#fullName-error")).toBeVisible();
  await expect(page.locator("#email-error")).toBeVisible();
  await expect(page.locator("#employeeBand-error")).toBeVisible();
  await expect(page.locator("#fullName")).toBeFocused();
  expect(requests).toHaveLength(0);
});

test("rejects an invalid email and mobile, keeping what was typed", async ({
  page,
}) => {
  const requests = await stubWeb3Forms(page);
  await page.goto("/care-show/leadership");
  await fillForm(page, "not-an-email");
  await page.fill("#mobileNumber", "not-a-number");
  await submit(page).click();

  await expect(page.locator("#email-error")).toBeVisible();
  await expect(page.locator("#mobileNumber-error")).toBeVisible();
  await expect(page.locator("#companyName")).toHaveValue("ABC Care Home");
  expect(requests).toHaveLength(0);
});

test("shows a friendly error when Web3Forms fails, and keeps the answers", async ({
  page,
}) => {
  await stubWeb3Forms(page, {
    status: 500,
    body: { success: false, message: "Internal" },
  });
  await page.goto("/care-show/leadership");
  await fillForm(page);
  await submit(page).click();

  await expect(page.locator("form").getByRole("alert")).toHaveText(
    "Something went wrong while submitting your enquiry. Please try again or contact us directly.",
  );
  await expect(page.locator("#fullName")).toHaveValue("Sarah Johnson");
  await expect(submit(page)).toBeEnabled();
});

test("a bot that fills the honeypot is shown success but nothing is sent", async ({
  page,
}) => {
  const requests = await stubWeb3Forms(page);
  await page.goto("/care-show/leadership");
  await fillForm(page);
  await page.evaluate(() => {
    const field = document.querySelector<HTMLInputElement>("#botcheck");
    if (field) field.value = "https://spam.example";
  });
  await submit(page).click();

  await expect(page.locator("form").getByRole("status")).toBeVisible();
  expect(requests).toHaveLength(0);
});
