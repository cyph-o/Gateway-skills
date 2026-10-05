import { ButtonLink } from "@/components/primitives/Button";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { FundingSection } from "@/components/sections/FundingSection";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { PageHero } from "@/components/sections/PageHero";
import { PropositionRows } from "@/components/sections/PropositionRows";
import { RoleGrid } from "@/components/sections/RoleGrid";
import { TransformationFlow } from "@/components/sections/TransformationFlow";
import { UseCaseRows } from "@/components/sections/UseCaseRows";
import {
  aiFunding,
  aiFundingHeader,
  aiHero,
  aiOversightNote,
  aiPillars,
  aiProjectFlow,
  aiProjectHeader,
  aiProjectTargets,
  aiRoles,
  aiRolesHeader,
  aiUseCases,
  aiUseCasesHeader,
} from "@/content/ai-automation";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "AI & Automation Practitioner for Care Organisations",
  description:
    "A Level 4 AI & Automation Practitioner apprenticeship that trains your existing " +
    "care staff to automate administration and build live compliance dashboards.",
  path: "/programmes/ai-automation",
});

const pillarHeader = {
  index: "Section 01",
  heading: "Three operational outcomes",
  standfirst: "What the framework is built to change inside your service.",
} as const;

export default function AiAutomationProgrammePage() {
  return (
    <>
      <PageHero
        tone="forest"
        eyebrow={aiHero.eyebrow}
        headline={aiHero.headline}
        standfirst={aiHero.standfirst}
        actions={
          <ButtonLink href="#register" size="lg" variant="on-forest">
            Check your funding eligibility
          </ButtonLink>
        }
      />

      <PropositionRows header={pillarHeader} items={aiPillars} tone="surface" />
      <UseCaseRows header={aiUseCasesHeader} items={aiUseCases} />

      <TransformationFlow
        header={aiProjectHeader}
        steps={aiProjectFlow}
        targets={aiProjectTargets}
        oversightNote={aiOversightNote}
      />

      <RoleGrid header={aiRolesHeader} items={aiRoles} />
      <FundingSection header={aiFundingHeader} routes={aiFunding} />

      <LeadCaptureSection
        index="Enrolment"
        heading="Book an automation and funding check"
        standfirst="Identify your high-potential administrators, team leaders or operations staff, and we will assess your levy eligibility."
        submitLabel="Secure My Funding Audit"
        campaign="programme_ai_automation"
      />

      <ClosingCta
        heading="The future of care is automated. Build capability now."
        body="Speak to a senior automation adviser about which of your staff could become your first AI & Automation Practitioner."
        ctaHref="#register"
        ctaLabel="Secure My Funding Audit"
      />
    </>
  );
}
