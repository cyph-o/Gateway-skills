import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/primitives/Button";
import { FundingSection } from "@/components/sections/FundingSection";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { ImageSection } from "@/components/sections/ImageSection";
import { PageHero } from "@/components/sections/PageHero";
import { PropositionRows } from "@/components/sections/PropositionRows";
import { RoleGrid } from "@/components/sections/RoleGrid";
import { TransformationFlow } from "@/components/sections/TransformationFlow";
import { UseCaseRows } from "@/components/sections/UseCaseRows";
import {
  aiClosing,
  aiFormCopy,
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
import { automationImageSection, photos } from "@/content/imagery";
import { OverlaySection } from "@/components/sections/OverlaySection";
import { bandImages, careShowPlates } from "@/content/overlays";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "AI & Automation for Care, Fully Funded",
  description:
    "A Level 4 AI & Automation Practitioner framework that trains your existing care " +
    "staff to automate administration and build live compliance dashboards.",
  path: "/care-show/ai-automation",
  canonicalPath: "/programmes/ai-automation",
});

const pillarHeader = {
  index: "Section 01",
  heading: "Three operational outcomes",
  standfirst: "What the framework is built to change inside your service.",
} as const;

export default function CareShowAiAutomationPage() {
  return (
    <>
      <PageHero
        plates={careShowPlates}
        eyebrow={aiHero.eyebrow}
        headline={aiHero.headline}
        standfirst={aiHero.standfirst}
        actions={
          <ButtonLink href="#register" size="lg" variant="on-forest">
            {aiFormCopy.submitLabel}
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

      <ImageSection
        eyebrow={automationImageSection.eyebrow}
        heading={automationImageSection.heading}
        body={automationImageSection.body}
        points={automationImageSection.points}
        image={photos.automationAdmin}
        reverse
      />

      <OverlaySection
        eyebrow="The live project"
        heading="A working assistant, built inside your facility"
        body="Every apprentice delivers a practical automation assistant addressing a real bottleneck in your service during their training, not a classroom exercise written up afterwards."
        image={bandImages.desk}
      />

      <RoleGrid header={aiRolesHeader} items={aiRoles} />

      <FundingSection header={aiFundingHeader} routes={aiFunding} />

      <LeadCaptureSection
        index={aiFormCopy.label}
        heading={aiFormCopy.heading}
        standfirst={aiFormCopy.standfirst}
        submitLabel={aiFormCopy.submitLabel}
        campaign="care_show_ai_automation"
      />

      <Container className="py-14 text-center">
        <h2 className="text-display-md">{aiClosing.heading}</h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-muted">{aiClosing.body}</p>
        <p className="label-mono mt-8 text-ink-muted">Care Show · NEC Birmingham</p>
      </Container>
    </>
  );
}
