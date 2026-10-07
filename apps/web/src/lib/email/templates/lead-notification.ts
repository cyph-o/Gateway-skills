import { campaignLabel, type CampaignId } from "@/lib/leads/campaigns";

export interface LeadNotificationData {
  reference: string;
  campaign: CampaignId;
  fullName: string;
  companyName: string;
  mobileNumber: string;
  email: string;
  marketingConsent: boolean;
  attribution: Record<string, string>;
  submittedAt: Date;
}

/** Every interpolated value is lead-supplied, so all of it is escaped. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strips CR/LF so a crafted company name cannot inject mail headers. */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 120);
}

export function leadNotificationSubject(data: LeadNotificationData): string {
  return headerSafe(`New enquiry: ${data.companyName} (${data.reference})`);
}

function rows(data: LeadNotificationData): [string, string][] {
  const utm = Object.entries(data.attribution)
    .map(([k, v]) => `${k}=${v}`)
    .join(" · ");
  return [
    ["Reference", data.reference],
    ["Programme", campaignLabel(data.campaign)],
    ["Full name", data.fullName],
    ["Company / care group", data.companyName],
    ["Direct mobile", data.mobileNumber],
    ["Corporate email", data.email],
    ["Marketing consent", data.marketingConsent ? "Given" : "Not given"],
    ["Submitted", data.submittedAt.toISOString()],
    ["Attribution", utm || "None"],
  ];
}

export function leadNotificationText(data: LeadNotificationData): string {
  const body = rows(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  return [
    "A new funding audit enquiry has been submitted.",
    "",
    body,
    "",
    data.marketingConsent
      ? "Marketing consent was given for this contact."
      : "Marketing consent was NOT given. Respond to this enquiry only. Do not add this contact to marketing lists.",
  ].join("\n");
}

export function leadNotificationHtml(data: LeadNotificationData): string {
  const cells = rows(data)
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:8px 16px 8px 0;color:#4b5d7a;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td>` +
        `<td style="padding:8px 0;color:#0d2f7c;font-size:14px;font-weight:600">${esc(value)}</td>` +
        `</tr>`,
    )
    .join("");

  const consentNote = data.marketingConsent
    ? "Marketing consent was given for this contact."
    : "Marketing consent was <strong>not</strong> given. Respond to this enquiry only. Do not add this contact to marketing lists.";

  return [
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#f3f6fb;padding:24px">`,
    `<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #c8d5e8;padding:28px">`,
    `<p style="margin:0 0 4px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#1747a6">Gateway Skills Network</p>`,
    `<h1 style="margin:0 0 20px;font-size:20px;color:#0d2f7c">New funding audit enquiry</h1>`,
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${cells}</table>`,
    `<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #c8d5e8;font-size:12px;color:#4b5d7a">${consentNote}</p>`,
    `</div></div>`,
  ].join("");
}
