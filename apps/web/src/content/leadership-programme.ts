import type { FlowStep, Proposition, SectionHeader } from "./types";

/**
 * Evergreen depth for the permanent leadership programme page, drawn from
 * Gateway's Level 6 / Level 7 pathway flyer. The Care Show page stays short
 * and conversion-led; this page is what a director reads before committing.
 */

export const leadershipProgrammeHero = {
  eyebrow: "CMI Level 7 · Level 6 Service Designer",
  headline: "Develop the strategic leaders your care organisation needs",
  standfirst:
    "From operational management to strategic service design: an executive pathway " +
    "built to elevate leadership capability, regulatory confidence, and long-term care " +
    "quality. Delivered flexibly around active care roles.",
} as const;

export const leadershipImpactHeader: SectionHeader = {
  eyebrow: "Organisational impact",
  heading: "Five areas of organisational impact",
  standfirst:
    "Each area maps to assessed programme modules, so capability is evidenced rather " +
    "than assumed.",
};

export const leadershipImpactAreas: readonly Proposition[] = [
  {
    title: "Well-Led & CQC Regulatory Excellence",
    body:
      "Demonstrate evidence of continuous improvement, governance, outcomes and " +
      "leadership aligned to the CQC Single Assessment Framework.",
    icon: "shield-check",
  },
  {
    title: "Strategic Service Design & Innovation",
    body:
      "Transform care models through human-centred service design, co-designing with " +
      "families, residents and multidisciplinary teams to reduce service bottlenecks.",
    icon: "workflow",
  },
  {
    title: "Resilient Culture & Workforce Retention",
    body:
      "Build compassionate, accountable workplace cultures that combat high turnover, " +
      "leading organisational change with emotional intelligence and clear accountability.",
    icon: "users",
  },
  {
    title: "Integrated Partnerships & System Influence",
    body:
      "Strengthen cross-sector collaboration with local authorities, ICBs and NHS trusts, " +
      "positioning your service as a preferred, trusted partner.",
    icon: "heart-handshake",
  },
  {
    title: "Operational Performance & Resource Optimisation",
    body:
      "Develop mastery over financial metrics, KPI tracking and resource allocation to " +
      "ensure long-term sustainability without compromising care ethics.",
    icon: "gauge",
  },
] as const;

export const leadershipLearningHeader: SectionHeader = {
  eyebrow: "In practice",
  heading: "Service design and transformation in action",
  standfirst:
    "The Level 6 Service Designer apprenticeship complements the CMI Level 7 Diploma " +
    "with practical tools to identify opportunities, redesign services and deliver " +
    "measurable improvements across care services.",
};

export const leadershipLearningOutcomes: readonly string[] = [
  "Understand resident, family and staff needs",
  "Analyse services and care journeys",
  "Identify opportunities for improvement",
  "Design and implement practical solutions",
  "Use evidence and insight to support decision-making",
  "Lead service improvement and digital transformation initiatives",
] as const;

export const leadershipProjectExamples: readonly string[] = [
  "Improving resident admissions and onboarding",
  "Enhancing family communication and engagement",
  "Strengthening governance and quality assurance processes",
  "Improving staff retention and workforce experience",
  "Supporting digital transformation initiatives",
  "Streamlining care planning and review processes",
] as const;

export const leadershipJourneyHeader: SectionHeader = {
  eyebrow: "Delivery",
  heading: "How the programme runs",
  standfirst:
    "Delivered flexibly around active care roles, with structured employer checkpoints " +
    "so the organisation can see the return while the programme is still running.",
};

export const leadershipJourney: readonly FlowStep[] = [
  {
    label: "Enrolment & diagnostic scan",
    detail:
      "Tailoring the learning plan to your organisation's strategic priorities and the " +
      "learner's existing experience.",
  },
  {
    label: "Monthly 1:1 executive coaching",
    detail:
      "Dedicated monthly remote sessions, scheduled flexibly around shifts and " +
      "management responsibilities.",
  },
  {
    label: "Workplace transformation project",
    detail:
      "A live, high-impact improvement project addressing a real challenge within your " +
      "care service.",
  },
  {
    label: "Employer tripartite reviews",
    detail:
      "Structured reviews every 10–12 weeks with leadership sponsors, to track " +
      "measurable return on investment.",
  },
  {
    label: "End-point assessment & gateway",
    detail:
      "Portfolio consolidation, mock panel interviews and executive presentation coaching.",
  },
  {
    label: "Chartered professional progression",
    detail:
      "Graduation with dual Level 6 and 7 credentials, and eligibility for full Chartered " +
      "Manager (CMgr) recognition.",
  },
] as const;

export const leadershipEligibilityHeader = {
  heading: "Who is eligible",
  standfirst:
    "Checking these before you enquire saves a conversation. We confirm eligibility " +
    "during the funding audit.",
} as const;

/** Reproduced from Gateway's flyer. Eligibility is confirmed with the training
 *  provider, so these are stated as criteria rather than guarantees. */
export const leadershipEligibility: readonly string[] = [
  "Ambitious managers, clinical leads or senior leaders in an operational care role",
  "Contracted for 30+ hours per week in England",
  "UK/EEA resident for the past 3 years, with the right to work",
  "Not actively enrolled on another government-funded apprenticeship",
] as const;
