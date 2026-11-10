import type { IconName, Proposition, SectionHeader } from "./types";

export const homeHero = {
  eyebrow: "Gateway Skills Network Ltd · Connecting Business to Future Skills",
  headline: "AI, Leadership & Workforce Development for Care Providers and Businesses",
  standfirst:
    "Gateway Skills Network specialises in adult social care workforce development and " +
    "also supports employers across other sectors. We connect organisations with " +
    "training partners offering AI & Automation, Leadership & Management, Care, IT, " +
    "Marketing and Customer Service apprenticeship opportunities. Funding options are " +
    "subject to eligibility.",
} as const;

export const trustBanner =
  "Specialists in Adult Social Care | Supporting Employers Across Other Sectors";

export const capabilityHeader: SectionHeader = {
  eyebrow: "Programmes",
  heading: "Apprenticeships & Workforce Development — Funding Options Available",
  standfirst:
    "Our specialist care pathways remain central to Gateway, alongside AI, leadership " +
    "and business skills programmes available through our training partners.",
};

export interface ProgrammeCard {
  readonly title: string;
  readonly body: string;
  readonly icon: IconName;
  readonly href: string;
  readonly fundingTag?: string;
  readonly roles?: readonly string[];
}

export const programmeCards: readonly ProgrammeCard[] = [
  {
    title: "Frontline Care Worker & Operational Manager Programmes",
    body:
      "Fully funded workforce development pathways designed for frontline care staff, " +
      "senior assistants, and team leads to embed clinical excellence, safe medication " +
      "handling, and localised service management. Includes Level 2, Level 3 and Level 5 " +
      "frameworks.",
    icon: "heart-handshake",
    href: "/programmes/frontline",
    fundingTag: "Fully funded programmes",
  },
  {
    title: "Strategic Care Leadership & Service Design Pathway",
    body:
      "Exclusive dual-qualification track built specifically for healthcare executives, " +
      "owners, and senior managers. Combines a Level 6 Service Designer framework with an " +
      "embedded Level 7 Diploma in Strategic Management & Leadership Practice. Focuses " +
      "heavily on auditing care delivery, maximising workforce retention, and fully " +
      "mastering operational service design.",
    icon: "award",
    href: "/programmes/leadership",
    roles: [
      "Directors, Owners & Nominated Individuals",
      "Care Quality Leads & Registered Home Managers",
      "Service & Quality Improvement Leads",
      "Transformation & Innovation Leads",
      "Digital Transformation & Operations Managers",
      "Programme, Project & Future Service Leaders",
    ],
  },
  {
    title: "Care AI & Automation Practitioner Programme",
    body:
      "A Level 4 AI toolkit and automation programme that equips and teaches your " +
      "Managers, Coordinators, Administrators and Senior Care staff how to automate " +
      "repetitive tasks and digitise records and procedures. It frees up 5 to 10 hours a " +
      "week of admin bottlenecks across care logs, rotas, scheduling, compliance and " +
      "mandatory tasks, and equips your business to help meet new Digital and CQC service " +
      "regulations coming into effect very soon.",
    icon: "cpu",
    href: "/programmes/ai-automation",
  },
] as const;

export const connectorHeader: SectionHeader = {
  eyebrow: "Our role",
  heading: "Gateway's role is the connection",
  standfirst:
    "We are an independent B2B managing agent and broker, not a training provider. We " +
    "analyse your workforce needs and connect you to the right accredited delivery.",
};

export const whyGateway = {
  heading: "Why Gateway",
  body:
    "We operate as an independent consultancy, not a training provider. Employers choose " +
    "Gateway because we remove the complexity of funding, accreditation and programme " +
    "selection. Our managed network ensures every pathway is delivered by authorised, " +
    "government-funded partners, while our advisory team aligns each programme to your " +
    "operational, regulatory and workforce priorities.",
} as const;

export const connectorPoints: readonly Proposition[] = [
  {
    title: "Funding Assessed First",
    body:
      "We establish your levy or non-levy position, grant eligibility, or localised " +
      "funding routes before any operational commitment is made.",
    icon: "receipt",
  },
  {
    title: "Elite Managed Network",
    body:
      "All higher-level qualifications are delivered exclusively via our authorised " +
      "network of ESFA registered training providers and Ofsted-approved colleges.",
    icon: "building",
  },
  {
    title: "Seamless Integration",
    body:
      "Learning is applied directly to live operational and compliance problems inside " +
      "your own care service during the active programme duration.",
    icon: "user-cog",
  },
] as const;
