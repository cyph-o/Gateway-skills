import { z } from "zod";
import { CAMPAIGN_IDS } from "./campaigns";
import { collapseWhitespace, normaliseMobile } from "./normalise";

/** A bot filling every field, including the hidden one, is the cheapest signal
 *  available. Humans never see or fill this. */
export const HONEYPOT_FIELD = "company_website";

/** Submissions faster than this are mechanical, not typed by a person. */
export const MIN_FILL_MS = 2_000;

/** Guards against a stale tab being replayed hours later. */
export const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 6;

const name = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(120, "That name is too long")
  .transform(collapseWhitespace);

const organisation = z
  .string()
  .trim()
  .min(2, "Please enter your company or care group name")
  .max(160, "That name is too long")
  .transform(collapseWhitespace);

/** Validates and normalises in one step so the rest of the system only ever
 *  sees E.164. */
const mobile = z
  .string()
  .trim()
  .min(7, "Please enter a direct mobile number")
  .max(32, "That number is too long")
  .transform((value, ctx) => {
    const normalised = normaliseMobile(value);
    if (!normalised) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid UK or international mobile number",
      });
      return z.NEVER;
    }
    return normalised;
  });

const email = z
  .email("Enter a valid corporate email address")
  .max(254, "That email address is too long")
  .trim();

export const leadFormSchema = z.object({
  fullName: name,
  companyName: organisation,
  mobileNumber: mobile,
  email,
  campaign: z.enum(CAMPAIGN_IDS),
  /** Epoch ms stamped on mount. Absent without JavaScript, which disables the
   *  timing heuristic but not the honeypot or the rate limits. */
  renderedAt: z.coerce.number().int().positive().optional().catch(undefined),
  /** An unchecked checkbox is simply absent from the payload. Anything other
   *  than an explicit "on" resolves to false, so consent fails closed. */
  marketingConsent: z
    .string()
    .optional()
    .transform((v) => v === "on" || v === "true"),
  [HONEYPOT_FIELD]: z
    .string()
    .max(0, "Submission rejected")
    .optional()
    .transform(() => undefined),
});

export type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadFormValues = z.output<typeof leadFormSchema>;

/** Field-level errors keyed by form field name, for re-rendering the form. */
export type LeadFieldErrors = Partial<Record<keyof LeadFormValues | "form", string>>;
