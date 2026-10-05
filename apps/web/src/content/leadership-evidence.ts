import type { Proposition, RoleItem, SectionHeader } from "./types";

/**
 * The commercial case, taken from pages 3–4 of Gateway's Level 6 / Level 7
 * pathway flyer. This is the material that answers a care owner's real
 * question — not "what is the qualification" but "why would I fund it".
 */

export const leadershipPressureHeader: SectionHeader = {
  heading: "Why care providers are investing in leadership development",
  standfirst: "Care providers face increasing pressure to:",
};

export const leadershipPressures: readonly RoleItem[] = [
  { label: "Demonstrate continuous improvement", icon: "trending-up" },
  { label: "Retain and develop managers", icon: "users" },
  { label: "Strengthen governance and oversight", icon: "shield-check" },
  { label: "Use digital systems and data effectively", icon: "layout-dashboard" },
  { label: "Improve inspection outcomes", icon: "badge-check" },
  { label: "Build succession plans for future Registered Managers", icon: "user-cog" },
] as const;

export const leadershipPressureConclusion =
  "This programme develops the strategic capability needed to address these systemic challenges.";

export const cqcOutcomesHeader: SectionHeader = {
  index: "CQC alignment",
  heading: "Supporting better CQC outcomes",
  standfirst:
    "Capability mapped to all five key questions of the Single Assessment Framework, " +
    "not just Well-Led.",
};

/** The five CQC key questions, each with what the programme contributes. */
export const cqcOutcomes: readonly Proposition[] = [
  {
    title: "Safe",
    body: "Governance, risk management and accountability.",
    icon: "shield-check",
  },
  { title: "Effective", body: "Data, performance and outcomes.", icon: "gauge" },
  { title: "Caring", body: "Human-centred service design.", icon: "heart-handshake" },
  { title: "Responsive", body: "Improvement and transformation.", icon: "workflow" },
  {
    title: "Well-Led",
    body: "Strategic leadership and continuous improvement.",
    icon: "award",
  },
] as const;

export const leadershipRoiHeader: SectionHeader = {
  index: "Return on investment",
  heading: "Organisational return on investment",
  standfirst: "What the organisation gets back, beyond the individual's qualification.",
};

export const leadershipRoi: readonly RoleItem[] = [
  { label: "Stronger inspection readiness", icon: "shield-check" },
  { label: "Better strategic decision-making", icon: "award" },
  { label: "Reduced process inefficiencies", icon: "workflow" },
  { label: "Improved governance and accountability", icon: "scroll" },
  { label: "Increased staff engagement and retention", icon: "users" },
  { label: "Stronger succession planning for future Registered Managers", icon: "user-cog" },
  { label: "Improved resident and family outcomes", icon: "heart-handshake" },
] as const;
