import { ButtonLink } from "@/components/primitives/Button";
import { LogoWall } from "@/components/sections/LogoWall";
import { ProgrammeCards } from "@/components/sections/ProgrammeCards";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustBanner } from "@/components/sections/TrustBanner";
import { EmployerExperience } from "@/components/sections/EmployerExperience";
import { PathwayFlow } from "@/components/sections/PathwayFlow";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { OverlaySection } from "@/components/sections/OverlaySection";
import { PageHero } from "@/components/sections/PageHero";
import { FundingOverview } from "@/components/sections/FundingOverview";
import { PropositionRows } from "@/components/sections/PropositionRows";
import { ProgrammeSummary } from "@/components/sections/ProgrammeSummary";
import { brand } from "@/content/brand";
import {
  capabilityHeader,
  connectorHeader,
  connectorPoints,
  homeHero,
  programmeCards,
  whyGateway,
} from "@/content/home";
import { aiPillars } from "@/content/ai-automation";
import { leadershipPropositions } from "@/content/leadership";
import {
  automationOverlay,
  careOverlay,
  heroPlates,
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
        plates={heroPlates}
        eyebrow={homeHero.eyebrow}
        headline={homeHero.headline}
        standfirst={homeHero.standfirst}
        actions={
          <>
            <ButtonLink href="#enquire" size="lg" variant="on-forest">
              Talk to Gateway
            </ButtonLink>
            <ButtonLink href="#leadership" size="lg" variant="outline-light">
              Explore programmes
            </ButtonLink>
          </>
        }
      />

      <TrustBanner />

      <ProgrammeCards header={capabilityHeader} items={programmeCards} />

      <EmployerExperience />

      <LogoWall />

      <PropositionRows
        header={connectorHeader}
        items={connectorPoints}
        tone="surface"
        intro={
          <div className="reveal mt-10 max-w-3xl border-l-2 border-emerald pl-6">
            <h3 className="text-2xl">{whyGateway.heading}</h3>
            <p className="mt-3 leading-relaxed text-ink-muted">{whyGateway.body}</p>
          </div>
        }
      />

      <PathwayFlow />

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

      <FundingOverview />

      <OverlaySection
        id="why"
        eyebrow={careOverlay.eyebrow}
        heading={careOverlay.heading}
        body={careOverlay.body}
        image={overlayImages.care}
        tone="light"
      />

      <Testimonials />

      <LeadCaptureSection
        id="enquire"
        index="Enquiry"
        heading="Check your funding eligibility"
        standfirst="A few details are all we need to confirm your funding position and the pathways your organisation qualifies for."
        submitLabel="Review My Funding Position"
        campaign="general_contact"
      />
    </>
  );
}
