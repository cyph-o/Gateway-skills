import type { Proposition, SectionHeader } from "./types";

export const homeHero = {
  eyebrow: "Gateway Skills Network Ltd",
  headline: "Connecting Business to Future Skills",
  standfirst:
    "We connect UK employers to fully funded, higher-level qualifications in " +
    "strategic leadership, service transformation, and AI & automation, delivered " +
    "through our authorised college network and ESFA registered training partners.",
  primaryCta: { href: "/programmes/leadership", label: "Explore programmes" },
  secondaryCta: { href: "/contact", label: "Check your funding" },
} as const;

export const capabilityHeader: SectionHeader = {
  index: "Section 01",
  heading: "Three capabilities, one funded route",
  standfirst:
    "Each programme is built for the operational reality of a regulated " +
    "organisation, not a generic classroom.",
};

export const capabilities: readonly (Proposition & { href: string })[] = [
  {
    title: "Strategic Leadership",
    body:
      "CMI Level 7 Diploma in Strategic Management and Leadership Practice, with " +
      "progression to Chartered Manager status.",
    icon: "award",
    href: "/programmes/leadership",
  },
  {
    title: "Service Transformation",
    body:
      "Level 6 Service Designer, aligning governance and continuous improvement to the " +
      "CQC Single Assessment Framework.",
    icon: "workflow",
    href: "/programmes/leadership",
  },
  {
    title: "AI & Automation",
    body:
      "Level 4 AI & Automation Practitioner, training your existing staff to build " +
      "live assistants and remove administrative overhead.",
    icon: "cpu",
    href: "/programmes/ai-automation",
  },
] as const;

export const connectorHeader: SectionHeader = {
  index: "Section 02",
  heading: "Gateway's role is the connection",
  standfirst:
    "We are not a college. We sit between employers and accredited delivery, so the " +
    "funding route, the candidate fit and the qualification all line up before " +
    "anyone enrols.",
};

export const connectorPoints: readonly Proposition[] = [
  {
    title: "Funding assessed first",
    body:
      "We establish your levy position and eligible co-investment route before any " +
      "commitment is made.",
    icon: "receipt",
  },
  {
    title: "Delivered by accredited partners",
    body:
      "All higher-level qualifications are delivered via our authorised, " +
      "government-funded college network and ESFA registered training providers.",
    icon: "building",
  },
  {
    title: "Applied inside your organisation",
    body:
      "Learning is applied to live operational problems in your own service, during " +
      "the programme.",
    icon: "user-cog",
  },
] as const;
