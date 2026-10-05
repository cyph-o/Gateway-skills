import { ButtonLink } from "@/components/primitives/Button";
import { CapabilityCards } from "@/components/sections/CapabilityCards";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { OverlaySection } from "@/components/sections/OverlaySection";
import { PageHero } from "@/components/sections/PageHero";
import { ProgrammeSummary } from "@/components/sections/ProgrammeSummary";
import { PropositionRows } from "@/components/sections/PropositionRows";
import { brand } from "@/content/brand";
import { capabilities, capabilityHeader, connectorHeader, connectorPoints, homeHero } from "@/content/home";
import { aiPillars } from "@/content/ai-automation";
import { leadershipPropositions } from "@/content/leadership";
import {
  automationOverlay,
  careOverlay,
  fundingOverlay,
  fundingStats,
  leadershipOverlay,
  overlayImages,
} from "@/content/overlays";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: brand.strapline,
  description:
    "Gateway Skills Network connects UK care employers to fully funded higher-level " +
    "qualifications in leadership, service transformation, and AI & automation.",
  path: "/",
});

/** One scrolling narrative. Navigation points at these section ids rather than
 *  separate routes, so exploring the offer never reloads the page. */
export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow={homeHero.eyebrow}
        headline={homeHero.headline}
        standfirst={homeHero.standfirst}
        actions={
          <>
            <ButtonLink href="#enquire" size="lg">
              Check your funding
            </ButtonLink>
            <ButtonLink href="#leadership" size="lg" variant="outline">
              Explore programmes
            </ButtonLink>
          </>
        }
      />

      <CapabilityCards header={capabilityHeader} items={capabilities} />

      <OverlaySection
        id="leadership"
        height="tall"
        eyebrow={leadershipOverlay.eyebrow}
        heading={leadershipOverlay.heading}
        body={leadershipOverlay.body}
        image={overlayImages.leadership}
        actions={
          <ButtonLink href="/programmes/leadership" size="lg" variant="on-forest">
            View the leadership programme
          </ButtonLink>
        }
      />

      <ProgrammeSummary
        eyebrow="What it changes"
        heading="Service design and transformation in social care"
        items={leadershipPropositions}
        href="/programmes/leadership"
        linkLabel="Full programme detail"
      />

      <OverlaySection
        id="ai-automation"
        height="tall"
        eyebrow={automationOverlay.eyebrow}
        heading={automationOverlay.heading}
        body={automationOverlay.body}
        image={overlayImages.automation}
        actions={
          <ButtonLink href="/programmes/ai-automation" size="lg" variant="on-forest">
            View the AI &amp; automation programme
          </ButtonLink>
        }
      />

      <ProgrammeSummary
        eyebrow="Operational outcomes"
        heading="Turning everyday care tasks into smarter workflows"
        items={aiPillars}
        href="/programmes/ai-automation"
        linkLabel="Full programme detail"
        tone="ground"
      />

      <OverlaySection
        id="funding"
        eyebrow={fundingOverlay.eyebrow}
        heading={fundingOverlay.heading}
        body={fundingOverlay.body}
        image={overlayImages.funding}
        stats={fundingStats}
        tone="light"
      />

      <PropositionRows header={connectorHeader} items={connectorPoints} tone="surface" />

      <OverlaySection
        id="approach"
        eyebrow={careOverlay.eyebrow}
        heading={careOverlay.heading}
        body={careOverlay.body}
        image={overlayImages.care}
        tone="light"
      />

      <LeadCaptureSection
        id="enquire"
        index="Enquiry"
        heading="Check your funding eligibility"
        standfirst="Four details are all we need to assess your levy position and the cohorts your organisation qualifies for."
        submitLabel="Secure My Funding Audit"
        campaign="general_contact"
      />
    </>
  );
}
