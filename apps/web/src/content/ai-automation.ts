import type {
  FlowStep,
  FundingRoute,
  Proposition,
  RoleItem,
  SectionHeader,
  UseCase,
} from "./types";

/** AI & Automation Practitioner in Care (Level 4) — shared by the Care Show
 *  landing page and the permanent programme page. */

export const aiHero = {
  eyebrow: "Level 4 · AI & Automation Practitioner",
  headline: "Build Internal AI & Automation Capability Inside Your Care Organisation",
  standfirst:
    "A Level 4 AI & Automation Practitioner framework designed specifically to train " +
    "your existing care coordinators, administrators, and team leaders to build live " +
    "digital assistants, automate routine tasks, and eliminate operational overheads.",
} as const;

export const aiPillars: readonly Proposition[] = [
  {
    title: "Slash Care Administration",
    body:
      "Automate repetitive scheduling, staff rostering, data entry, document " +
      "processing, and routine care logging workflows.",
    icon: "workflow",
  },
  {
    title: "Improve CQC Visibility",
    body:
      "Build secure, live compliance dashboards to track medication auditing, stock " +
      "levels, purchasing, and multi-site safety records.",
    icon: "layout-dashboard",
  },
  {
    title: "Cultivate Internal Tech Skill",
    body:
      "Develop practical AI, digital agent, and secure low-code capability within " +
      "your active workforce.",
    icon: "cpu",
  },
] as const;

export const aiUseCasesHeader: SectionHeader = {
  eyebrow: "Where it applies",
  heading: "Turning Everyday Care Tasks Into Smarter Workflows",
  standfirst: "Where care operators apply the capability, and what it returns.",
};

export const aiUseCases: readonly UseCase[] = [
  {
    title: "Residential & Dementia Care Homes",
    icon: "building",
    bottleneck:
      "Too many hours lost by care staff to manual paperwork, shift handovers, and " +
      "compliance forms.",
    application:
      "Secure data workflows, automated document processing, and standardised " +
      "compliance templates.",
    impact: "Recover hours of direct care time and improve operational consistency.",
  },
  {
    title: "Multi-Site & Growing Care Groups",
    icon: "layout-dashboard",
    bottleneck:
      "Inconsistent reporting structures, delayed compliance visibility, and " +
      "fragmented multi-site tracking.",
    application:
      "Integrated manager dashboards, unified cross-site reporting, and automated " +
      "stock monitoring.",
    impact:
      "Complete executive control over regional performance metrics and quality assurance.",
  },
  {
    title: "Dignity & Regulated Care Settings",
    icon: "heart-handshake",
    bottleneck:
      "Heavy administrative overhead, data tracking friction, and strict regulatory " +
      "auditing requirements.",
    application:
      "Document automation and secure, compliant data routing that meets CQC " +
      "oversight standards.",
    impact: "Reduced audit errors and clear readiness for inspection scrutiny.",
  },
] as const;

export const aiProjectHeader: SectionHeader = {
  eyebrow: "The live project",
  heading: "Training Becomes Practical Workplace Capability",
  standfirst:
    "The core differentiator of this apprenticeship is the Live Workplace " +
    "Transformation Project. Your enrolled employee applies 100% of their learning to " +
    "build a practical automation assistant directly inside your care facility during " +
    "their training.",
};

export const aiProjectFlow: readonly FlowStep[] = [
  { label: "Identify", detail: "Choose a workflow that costs real staff hours." },
  { label: "Map", detail: "Document the existing process end to end." },
  { label: "Build", detail: "Develop the assistant inside your own systems." },
  { label: "Validate", detail: "Test with human oversight before it goes live." },
  { label: "Measure", detail: "Evidence the hours and errors recovered." },
] as const;

export const aiProjectTargets: readonly string[] = [
  "Automating care plan updates and review alerts",
  "Streamlining resident admissions and onboarding documentation",
  "Tracking live staff agency usage and rostering data",
  "Building automated CQC Single Assessment audit logs",
] as const;

export const aiRolesHeader: SectionHeader = {
  eyebrow: "Who qualifies",
  heading: "Who Could Become Your AI & Automation Practitioner?",
  standfirst:
    "The framework trains people already inside your service. No new technical hire required.",
};

export const aiRoles: readonly RoleItem[] = [
  { label: "Care Coordinators & Schedulers", icon: "calendar-clock" },
  { label: "Care Home Administrators & Receptionists", icon: "clipboard-list" },
  { label: "Compliance & Quality Assurance Officers", icon: "shield-check" },
  { label: "Deputy Managers & Team Leaders", icon: "users" },
  { label: "Finance & Payroll Administrators", icon: "receipt" },
] as const;

export const aiFundingHeader: SectionHeader = {
  eyebrow: "Funding",
  heading: "Institutional Funding & Executive Value",
  standfirst:
    "Both funding routes are assessed during your introductory audit and funding check.",
};

export const aiFunding: readonly FundingRoute[] = [
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
      "The remaining 5% is a one-off employer co-investment, invoiced on enrolment.",
    figures: [
      { label: "Full programme value", value: "£18,000" },
      { label: "Employer contribution", value: "£900 + VAT" },
    ],
  },
] as const;

export const aiFormCopy = {
  label: "Register",
  heading: "Book Your Automation & Funding Check",
  standfirst:
    "Identify your high-potential administrators, team leaders, or operations staff " +
    "today. Our senior automation advisers will assess your levy eligibility.",
  submitLabel: "Secure My Funding Audit",
} as const;

export const aiClosing = {
  heading: "The Future of Care is Automated. Build Capability Now.",
  body:
    "Contact our senior automation advisers to assess your levy eligibility and book " +
    "an introductory audit and funding check.",
} as const;

/** Responsible-use statement. The programme builds assistive automation; it does
 *  not place AI in clinical decision-making. Rendered on both AI pages. */
export const aiOversightNote =
  "Automation built during the programme supports your team. It does not make " +
  "clinical decisions or replace professional care staff. Care records, " +
  "medication-related workflows and resident information remain under human " +
  "oversight, with appropriate access controls and data-protection safeguards.";
