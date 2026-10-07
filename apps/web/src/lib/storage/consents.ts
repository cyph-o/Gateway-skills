import { PRIVACY_NOTICE_VERSION } from "@/content/legal/notice";
import type { ConsentRecord } from "./types";

/**
 * The consent pair recorded with every enquiry, built once so both drivers
 * record the same thing.
 *
 * Responding to a requested funding review rests on legitimate interest and is
 * always granted; marketing is a separate, independently recorded permission
 * that an enquiry does not imply. Storing the notice version and the capture
 * source with each is what lets Gateway show, later, exactly what someone was
 * told when they agreed.
 */
export function buildConsents(
  leadId: string,
  campaign: string,
  marketingConsent: boolean,
  createdAt = new Date().toISOString(),
): ConsentRecord[] {
  const base = { leadId, noticeVersion: PRIVACY_NOTICE_VERSION, source: campaign, createdAt };
  return [
    { ...base, purpose: "enquiry_response", granted: true },
    { ...base, purpose: "marketing", granted: marketingConsent },
  ];
}
