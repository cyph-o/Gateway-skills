import type {
  FundingRoute,
  Proposition,
  QualificationBadge,
  SectionHeader,
} from "./types";

/** Strategic Leadership & Service Design — shared by the Care Show landing
 *  page and the permanent programme page. */

export const leadershipHero = {
  eyebrow: "CMI Level 7 · Level 6 Service Designer",
  headline:
    "Elevating Strategic Leadership & Operational Transformation Across Your Care Organisation",
  standfirst:
    "A fully funded executive pathway combining a CMI Level 7 Diploma and Level 6 " +
    "Service Designer qualification, tailored specifically to build operational " +
    "capability, regulatory confidence, and long-term care excellence.",
} as const;

export const leadershipBadges: readonly QualificationBadge[] = [
  {
    label: "Level 6 Service Designer",
    detail: "Service transformation in regulated care settings",
    icon: "workflow",
  },
  {
    label: "CMI Level 7 Diploma",
    detail: "Strategic Management and Leadership Practice",
    icon: "scroll",
  },
  {
    label: "Chartered Manager Pathway",
    detail: "Progression to Chartered Manager (CMgr) status",
    icon: "award",
  },
  {
    label: "Executive Post-Nominals",
    detail: "Recognised letters: CMgr MCMI or CMgr FCMI",
    icon: "badge-check",
  },
] as const;

export const leadershipFormCopy = {
  label: "Register",
  heading: "Scan & Register for Q4 Funding Cohorts",
  standfirst:
    "Four details are all we need to assess your levy position and confirm " +
    "which funded cohort your organisation qualifies for.",
  submitLabel: "Secure My Funding Audit",
} as const;

export const leadershipPropositionsHeader: SectionHeader = {
  eyebrow: "What it changes",
  heading: "Service Design & Transformation in Social Care",
  standfirst:
    "Three operational problems the programme is built to resolve inside your organisation.",
};

export const leadershipPropositions: readonly Proposition[] = [
  {
    title: "Well-Led & CQC Regulatory Excellence",
    body:
      "Aligning continuous improvement, oversight, and internal governance models " +
      "directly to the CQC Single Assessment Framework.",
    icon: "shield-check",
  },
  {
    title: "Workforce Experience & Staff Retention",
    body:
      "Cultivating compassionate, accountable workplace cultures with " +
      "transformational leadership to lower high employee turnover rates.",
    icon: "users",
  },
  {
    title: "Operational Performance & Resource Efficiency",
    body:
      "Developing mastery over financial metrics, KPI tracking, and resource " +
      "allocation to protect long-term commercial sustainability.",
    icon: "gauge",
  },
] as const;

export const leadershipFundingHeader: SectionHeader = {
  eyebrow: "Funding",
  heading: "Government Co-Investment & Enrolment",
  standfirst:
    "How the programme is funded depends on whether your organisation pays the " +
    "Apprenticeship Levy. Both routes are assessed during your funding audit.",
};

export const leadershipFunding: readonly FundingRoute[] = [
  {
    label: "Apprenticeship Levy Payers",
    headline: "100% covered",
    detail:
      "Fully covered through your organisation's existing digital Apprenticeship " +
      "Service (DAS) levy accounts.",
  },
  {
    label: "Non-Levy Employers (SMEs)",
    headline: "95% government funded",
    detail:
      "The balance is a one-off employer co-investment, invoiced on enrolment.",
    figures: [
      { label: "Full programme value", value: "£15,000" },
      { label: "Employer contribution", value: "£750 + VAT" },
    ],
  },
] as const;
