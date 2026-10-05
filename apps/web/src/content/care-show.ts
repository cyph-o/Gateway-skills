import type { SectionHeader } from "./types";

/** Event framing, kept separate from programme copy so dates and venue can be
 *  changed for the next show without touching either landing page. */
export const careShowEvent = {
  name: "Care Show",
  venue: "NEC Birmingham",
  eyebrow: "Care Show · NEC Birmingham",
} as const;

export const careShowHubHero = {
  eyebrow: careShowEvent.eyebrow,
  headline: "Fully funded leadership and AI capability for care providers",
  standfirst:
    "Two funded pathways for adult social care employers. Choose the programme that " +
    "matches your priority, and register for a funding audit in under a minute.",
} as const;

export const careShowRoutesHeader: SectionHeader = {
  index: "Choose your pathway",
  heading: "Two programmes, both government funded",
  standfirst:
    "Levy payers are fully covered through existing DAS accounts. Non-levy employers " +
    "pay a 5% co-investment.",
};

export interface CareShowRoute {
  href: string;
  label: string;
  title: string;
  body: string;
  figure: string;
  figureLabel: string;
}

export const careShowRoutes: readonly CareShowRoute[] = [
  {
    href: "/care-show/leadership",
    label: "CMI Level 7 · Level 6 Service Designer",
    title: "Strategic Leadership & Operational Transformation",
    body:
      "An executive pathway combining a CMI Level 7 Diploma and Level 6 Service Designer " +
      "qualification, aligned to the CQC Single Assessment Framework.",
    figure: "£750 + VAT",
    figureLabel: "Employer contribution (non-levy)",
  },
  {
    href: "/care-show/ai-automation",
    label: "Level 4 · AI & Automation Practitioner",
    title: "Build Internal AI & Automation Capability",
    body:
      "Train your existing coordinators, administrators and team leaders to automate " +
      "care administration and build live compliance dashboards.",
    figure: "£900 + VAT",
    figureLabel: "Employer contribution (non-levy)",
  },
] as const;
