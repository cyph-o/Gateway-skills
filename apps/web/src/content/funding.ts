import type { RoleItem, SectionHeader } from "./types";

/**
 * Funding, stated without commercial detail.
 *
 * Gateway asked for all pricing, percentages, levy/DAS mechanics and partner
 * names to come off the public site: those are commercial terms that belong in
 * an eligibility conversation, not on a page a competitor can read. The copy
 * still tells an employer the three things they need — funding exists, more
 * than one route applies, and the exact position is confirmed for them.
 */
export const fundingHeader: SectionHeader = {
  eyebrow: "Government funding",
  heading: "Substantial government funding is available for eligible employers",
  standfirst:
    "Government funding is available through established apprenticeship and workforce " +
    "development frameworks. Levy, non-levy and LDSS-supported organisations can all " +
    "access funding across approved programmes.",
};

export const fundingPoints: readonly RoleItem[] = [
  {
    label: "Multiple funding routes apply, depending on how your organisation is structured",
    icon: "workflow",
  },
  {
    label: "We handle the complexity of eligibility, accreditation and programme selection",
    icon: "shield-check",
  },
  {
    label: "Your exact funding level is confirmed during a short eligibility check",
    icon: "badge-check",
  },
  {
    label: "No commitment is made before your funding position is clear",
    icon: "receipt",
  },
] as const;

export const fundingNote =
  "Exact funding levels are confirmed during a short eligibility check and depend on " +
  "your organisation's circumstances and the programme selected.";

/** Primary call to action, used site-wide. */
export const PRIMARY_CTA = "Review My Funding Position";
