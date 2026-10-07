import { describe, expect, it } from "vitest";
import { leadFormSchema } from "@/lib/leads/schema";
import { WEB3FORMS_ACCESS_KEY, web3formsPayload } from "@/lib/leads/web3forms";

const values = leadFormSchema.parse({
  campaign: "programme_ai_automation",
  botcheck: "",
  fullName: "Sarah  Johnson",
  jobTitle: "Registered Home Manager",
  companyName: "ABC Care Home",
  mobileNumber: "07123 456789",
  email: "sarah@abc-care.co.uk",
  employeeBand: "50-249",
  levyPayer: "no",
  interests: ["ai_automation", "dual_pathway"],
});

describe("web3formsPayload", () => {
  const payload = web3formsPayload(values, {
    attribution: { utm_source: "care_show" },
    pageUrl: "https://example.test/programmes/ai-automation",
  });

  it("authenticates, personalises the subject and replies to the visitor", () => {
    expect(payload.access_key).toBe(WEB3FORMS_ACCESS_KEY);
    expect(payload.subject).toBe(
      "New Enquiry from Sarah Johnson - Gateway Skills Network",
    );
    expect(payload.replyto).toBe("sarah@abc-care.co.uk");
    expect(payload.botcheck).toBe("");
  });

  it("labels every answer for the reader, including each ticked programme", () => {
    expect(payload).toMatchObject({
      Name: "Sarah Johnson",
      "Job Title": "Registered Home Manager",
      Company: "ABC Care Home",
      Mobile: "+447123456789",
      "Work Email": "sarah@abc-care.co.uk",
      "Number of UK Employees": "50 to 249",
      "Apprenticeship Levy": "No",
      "Programme Interest":
        "Level 4 AI Automation Track\nLevel 6 & Level 7 Combined Pathway",
      "Campaign Tracking": "utm_source: care_show",
    });
    expect(payload["Marketing Consent"]).toMatch(/^No/);
  });
});
