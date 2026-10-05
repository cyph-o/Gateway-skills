/**
 * Campaign allowlist. A submission's campaign is matched against this map and
 * never trusted as free text — it drives the notification subject line and the
 * consent source record.
 */
export const CAMPAIGNS = {
  care_show_leadership: {
    label: "Care Show — Strategic Leadership & Service Design",
    programme: "Leadership",
  },
  care_show_ai_automation: {
    label: "Care Show — AI & Automation Practitioner",
    programme: "AI & Automation",
  },
  programme_leadership: {
    label: "Website — Strategic Leadership & Service Design",
    programme: "Leadership",
  },
  programme_ai_automation: {
    label: "Website — AI & Automation Practitioner",
    programme: "AI & Automation",
  },
  general_contact: { label: "Website — General enquiry", programme: "General" },
} as const;

export type CampaignId = keyof typeof CAMPAIGNS;

export const CAMPAIGN_IDS = Object.keys(CAMPAIGNS) as [CampaignId, ...CampaignId[]];

export function isCampaignId(value: unknown): value is CampaignId {
  return typeof value === "string" && value in CAMPAIGNS;
}

export function campaignLabel(id: CampaignId): string {
  return CAMPAIGNS[id].label;
}
