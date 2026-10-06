import { describe, expect, it } from "vitest";
import { leadFormSchema } from "@/lib/leads/schema";
import { HONEYPOT_FIELD } from "@/lib/leads/schema";

/** Mirrors exactly what Object.fromEntries(formData) yields from the rendered
 *  form: every value is a string, and unchecked checkboxes are absent. */
function formPayload(overrides: Record<string, string> = {}) {
  return {
    campaign: "care_show_leadership",
    renderedAt: String(Date.now()),
    [HONEYPOT_FIELD]: "",
    fullName: "Alex Morgan",
    jobTitle: "Registered Manager",
    employeeBand: "50-249",
    levyPayer: "no",
    companyName: "Example Care Group Ltd",
    mobileNumber: "07700 900123",
    email: "alex@example.co.uk",
    ...overrides,
  };
}

describe("leadFormSchema", () => {
  it("accepts a realistic submission from the rendered form", () => {
    const result = leadFormSchema.safeParse(formPayload());
    if (!result.success) {
      throw new Error(
        "Expected success, got issues: " +
          JSON.stringify(result.error.issues.map((i) => ({ path: i.path, message: i.message }))),
      );
    }
    expect(result.data.mobileNumber).toBe("+447700900123");
    expect(result.data.marketingConsent).toBe(false);
  });

  it("treats a ticked marketing checkbox as consent", () => {
    const result = leadFormSchema.safeParse(formPayload({ marketingConsent: "on" }));
    expect(result.success).toBe(true);
    expect(result.success && result.data.marketingConsent).toBe(true);
  });

  it("normalises international and spaced numbers", () => {
    for (const [input, expected] of [
      ["+44 7912 345678", "+447912345678"],
      ["0791 234 5678", "+447912345678"],
      ["+1 415 555 2671", "+14155552671"],
    ] as const) {
      const result = leadFormSchema.safeParse(formPayload({ mobileNumber: input }));
      expect(result.success, `${input} should parse`).toBe(true);
      expect(result.success && result.data.mobileNumber).toBe(expected);
    }
  });

  it("rejects unparseable numbers and bad emails with field paths", () => {
    const result = leadFormSchema.safeParse(
      formPayload({ mobileNumber: "not-a-number", email: "nope" }),
    );
    expect(result.success).toBe(false);
    const paths = result.success ? [] : result.error.issues.map((i) => i.path[0]);
    expect(paths).toContain("mobileNumber");
    expect(paths).toContain("email");
  });

  it("keeps only recognised programme interests", () => {
    const result = leadFormSchema.safeParse({
      ...formPayload(),
      interests: ["frontline", "not_a_programme", "dual_pathway"],
    });
    expect(result.success).toBe(true);
    expect(result.success && result.data.interests).toEqual(["frontline", "dual_pathway"]);
  });

  it("treats no ticked interest as an empty list, not a failure", () => {
    const result = leadFormSchema.safeParse(formPayload());
    expect(result.success).toBe(true);
    expect(result.success && result.data.interests).toEqual([]);
  });

  it("rejects an employer size or levy answer outside the allowed set", () => {
    expect(leadFormSchema.safeParse(formPayload({ employeeBand: "900" })).success).toBe(false);
    expect(leadFormSchema.safeParse(formPayload({ levyPayer: "maybe" })).success).toBe(false);
  });

  it("rejects an unknown campaign rather than trusting the client", () => {
    const result = leadFormSchema.safeParse(formPayload({ campaign: "evil_campaign" }));
    expect(result.success).toBe(false);
  });

  it("survives a missing renderedAt (the no-JavaScript path)", () => {
    const payload = formPayload();
    delete (payload as Record<string, unknown>).renderedAt;
    const result = leadFormSchema.safeParse(payload);
    expect(result.success).toBe(true);
    expect(result.success && result.data.renderedAt).toBeUndefined();
  });

  it("survives an empty renderedAt string (pre-hydration)", () => {
    const result = leadFormSchema.safeParse(formPayload({ renderedAt: "" }));
    expect(result.success).toBe(true);
    expect(result.success && result.data.renderedAt).toBeUndefined();
  });
});
