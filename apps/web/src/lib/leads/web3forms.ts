import { ATTRIBUTION_KEYS, type Attribution } from "@/lib/attribution";
import { campaignLabel } from "./campaigns";
import { PROGRAMME_INTERESTS, type LeadFormValues } from "./schema";

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Public by design: Web3Forms access keys only allow submitting to the inbox
 * configured on the Web3Forms account, so it is safe in the page source.
 */
export const WEB3FORMS_ACCESS_KEY = "c9b68c8c-d111-4a14-92df-bc0cfe78ff86";

export const WEB3FORMS_FROM_NAME = "Gateway Skills Network Website";

/** Used when the subject cannot be personalised (no JavaScript). */
export const WEB3FORMS_DEFAULT_SUBJECT =
  "New Funding Eligibility Enquiry - Gateway Skills Network";

const EMPLOYEE_BAND_LABELS: Record<LeadFormValues["employeeBand"], string> = {
  "1-49": "1 to 49",
  "50-249": "50 to 249",
  "250+": "250 or more",
};

const LEVY_LABELS: Record<LeadFormValues["levyPayer"], string> = {
  yes: "Yes",
  no: "No",
  unsure: "Unsure",
};

/**
 * Builds the Web3Forms payload. Keys double as the labels in the notification
 * email, so they are written for the reader rather than as field names.
 * `replyto` makes Reply in the inbox go straight to the visitor.
 */
export function web3formsPayload(
  values: LeadFormValues,
  context: { attribution: Attribution; pageUrl: string },
): Record<string, string> {
  const interests = values.interests.map((key) => PROGRAMME_INTERESTS[key]);
  const tracking = ATTRIBUTION_KEYS.flatMap((key) => {
    const value = context.attribution[key];
    return value ? [`${key}: ${value}`] : [];
  });

  return {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `New Enquiry from ${values.fullName} - Gateway Skills Network`,
    from_name: WEB3FORMS_FROM_NAME,
    replyto: values.email,
    botcheck: "",
    Name: values.fullName,
    "Job Title": values.jobTitle,
    Company: values.companyName,
    Mobile: values.mobileNumber,
    "Work Email": values.email,
    "Number of UK Employees": EMPLOYEE_BAND_LABELS[values.employeeBand],
    "Apprenticeship Levy": LEVY_LABELS[values.levyPayer],
    "Programme Interest":
      interests.length > 0 ? interests.join("\n") : "None selected",
    "Marketing Consent": values.marketingConsent
      ? "Yes: may contact by email, call or text about other programmes"
      : "No: respond to this enquiry only",
    "Enquiry Source": campaignLabel(values.campaign),
    Page: context.pageUrl,
    ...(tracking.length > 0
      ? { "Campaign Tracking": tracking.join("\n") }
      : {}),
  };
}
