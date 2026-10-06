import type { FlowStep, RoleItem, SectionHeader } from "./types";

/** Frontline Care Worker & Operational Manager Programmes. Copy supplied by
 *  Gateway; funding mechanism is LDSS, not the apprenticeship levy. */

export const frontlineHero = {
  eyebrow: "Levels 2, 3 & 5 · Fully funded",
  headline: "Frontline Care Worker & Operational Manager Programmes",
  standfirst:
    "A fully funded development matrix engineered specifically for the adult social care " +
    "sector, providing structured qualification pathways across your entire workforce, " +
    "from newly appointed care assistants to future CQC Registered Managers.",
} as const;

export const frontlineOverview =
  "Because these programmes are delivered via direct vocational grant routes (LDSS), they " +
  "do not require standard apprenticeship daytime release, allowing your team to train " +
  "entirely alongside their active shift patterns with zero rota disruption.";

export interface QualificationTier {
  readonly level: string;
  readonly title: string;
  readonly staff: string;
  readonly focus: string;
}

export const frontlineTiersHeader: SectionHeader = {
  eyebrow: "Framework tiers",
  heading: "Available qualifications and framework tiers",
  standfirst: "Three levels covering the full progression from care assistant to registered manager.",
};

export const frontlineTiers: readonly QualificationTier[] = [
  {
    level: "Level 2",
    title: "Adult Social Care Certificate",
    staff: "Care Assistants, Support Workers, and Frontline Care Teams.",
    focus:
      "Essential care duties, duty of care, safeguarding, standard operational procedures, " +
      "and person-centred care delivery.",
  },
  {
    level: "Level 3",
    title: "Diploma in Adult Care",
    staff: "Senior Care Assistants, Team Leaders, and Support Coordinators.",
    focus:
      "Leading care teams, advanced clinical care tracking, complex medication " +
      "administration management, and daily service logging.",
  },
  {
    level: "Level 5",
    title: "Diploma in Leadership & Management for Adult Care",
    staff: "CQC Registered Managers, Deputy Managers, and Care Home Leaders.",
    focus:
      "Governance, regulatory compliance management, workforce deployment strategies, and " +
      "overall care facility leadership.",
  },
] as const;

export const frontlineDeliveryHeader: SectionHeader = {
  eyebrow: "Delivery model",
  heading: "Flexible virtual delivery, built around safe staffing ratios",
  standfirst:
    "We understand that maintaining safe staffing ratios is your number one priority. The " +
    "learning model is designed to safeguard your daily operations.",
};

export const frontlineDelivery: readonly FlowStep[] = [
  {
    label: "Fully remote learning",
    detail: "Delivered entirely online via interactive Microsoft Teams sessions.",
  },
  {
    label: "Minimal time commitment",
    detail: "Requires only one or two virtual sessions per month.",
  },
  {
    label: "Hyper-flexible scheduling",
    detail:
      "Sessions are booked at times suitable to your home's schedule, fitting around active " +
      "shift rotas.",
  },
] as const;

export const frontlineFundingHeader: SectionHeader = {
  eyebrow: "Funding",
  heading: "How the funding matrix works",
  standfirst:
    "All qualifications in this framework are fully funded via the national Learning and " +
    "Development Support Scheme (LDSS), a non-apprenticeship route.",
};

export const frontlineFundingPoints: readonly RoleItem[] = [
  { label: "Open to both independent care providers and large care groups", icon: "building" },
  {
    label: "Funded separately from apprenticeship routes, with no payroll deductions",
    icon: "receipt",
  },
  {
    label: "No mandatory off-the-job daytime release: staff remain active on the floor",
    icon: "calendar-clock",
  },
] as const;

export const frontlineClosing = {
  heading: "Next steps to secure funding allocations",
  body:
    "Due to regional budget allocations for this funding cohort, places are registered " +
    "ahead of the upcoming entry deadlines.",
  cta: "Check funding & registration eligibility",
} as const;
