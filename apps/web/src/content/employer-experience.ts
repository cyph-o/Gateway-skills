import type { SectionHeader } from "./types";

/**
 * Employer credibility — Gateway's differentiator against a traditional
 * training provider. Supplied by Govind.
 *
 * NOTE ON THE FIGURES: 21+ / 1,000+ / 10,000+ describe the team's career
 * experience, not Gateway Skills Network Ltd's trading history as a company.
 * The copy says "during our professional careers" for exactly that reason —
 * stated otherwise it would overclaim the company's own track record.
 */
export const employerExperienceHeader = {
  eyebrow: "Our employer experience",
  heading: "21+ years of employer experience. 1,000+ employers. One future-focused network.",
  standfirst:
    "Gateway Skills Network is built on more than 21 years of direct employer engagement " +
    "and workforce development experience.",
} as const;

export const employerExperienceBody = [
  "During our professional careers, we have secured and developed relationships with " +
    "1,000+ employers across a wide range of sectors, helping organisations identify " +
    "skills needs and access apprenticeships, professional training and workforce " +
    "development opportunities.",
  "That experience is now brought together through Gateway Skills Network, connecting " +
    "businesses with the future skills, programmes and specialist training partners they " +
    "need to develop their people and transform their organisations.",
] as const;

export interface ExperienceFigure {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
}

export const experienceFigures: readonly ExperienceFigure[] = [
  { value: 21, suffix: "+", label: "Years of employer experience" },
  { value: 1000, suffix: "+", label: "Employers engaged & secured" },
  { value: 10000, suffix: "+", label: "Workforce opportunities developed" },
] as const;

export const organisationsHeader: SectionHeader = {
  eyebrow: "Track record",
  heading: "A network built through 21+ years of real employer engagement",
  standfirst:
    "Selected organisations our team has previously worked with, engaged with or " +
    "developed workforce opportunities with.",
};

/**
 * Rendered as typeset names rather than trademarked logos.
 *
 * This is deliberate. These marks belong to their owners, most have brand
 * guidelines restricting third-party use, and a wall of logos reads as a
 * client roster — implying a commercial relationship with Gateway Skills
 * Network Ltd rather than career history. The disclaimer below keeps the claim
 * accurate. See docs/claims-register.md before switching to image logos.
 */
export const organisations: readonly string[] = [
  "Thames Water",
  "Barclays",
  "Ernst & Young",
  "Nationwide",
  "Bechtel",
  "Guy's & St Thomas' Hospital",
  "London Borough of Newham",
  "Southwark Council",
  "University of Westminster",
  "Fifty5blue (formerly Kantar)",
  "Peace Pharmacy",
] as const;

export const organisationsDisclaimer =
  "Organisations listed reflect our team's professional engagement history across " +
  "previous roles. Their inclusion does not imply partnership with, or endorsement of, " +
  "Gateway Skills Network Ltd.";
