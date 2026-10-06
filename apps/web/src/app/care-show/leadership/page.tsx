import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/primitives/Button";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { EligibilityPanel } from "@/components/sections/EligibilityPanel";
import { FundingSection } from "@/components/sections/FundingSection";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { ImageSection } from "@/components/sections/ImageSection";
import { PageHero } from "@/components/sections/PageHero";
import { PropositionRows } from "@/components/sections/PropositionRows";
import { QualificationBadges } from "@/components/sections/QualificationBadges";
import {
  leadershipBadges,
  leadershipFormCopy,
  leadershipFunding,
  leadershipFundingHeader,
  leadershipHero,
  leadershipPropositions,
  leadershipPropositionsHeader,
} from "@/content/leadership";
import {
  leadershipEligibility,
  leadershipEligibilityHeader,
} from "@/content/leadership-programme";
import { careImageSection, photos } from "@/content/imagery";
import { OverlaySection } from "@/components/sections/OverlaySection";
import { bandImages, careShowPlates } from "@/content/overlays";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Care Leadership Pathway, 95-100% Funded",
  description:
    "A fully funded executive pathway combining a CMI Level 7 Diploma and Level 6 " +
    "Service Design qualification for UK care organisations.",
  path: "/care-show/leadership",
  // Campaign page; the evergreen programme page is the indexable canonical.
  canonicalPath: "/programmes/leadership",
});

export default function CareShowLeadershipPage() {
  return (
    <>
      <PageHero
        plates={careShowPlates}
        eyebrow={leadershipHero.eyebrow}
        headline={leadershipHero.headline}
        standfirst={leadershipHero.standfirst}
        actions={
          <ButtonLink href="#register" size="lg" variant="on-forest">
            {leadershipFormCopy.submitLabel}
          </ButtonLink>
        }
        footer={<QualificationBadges items={leadershipBadges} />}
      />

      <LeadCaptureSection
        index={leadershipFormCopy.label}
        heading={leadershipFormCopy.heading}
        standfirst={leadershipFormCopy.standfirst}
        submitLabel={leadershipFormCopy.submitLabel}
        campaign="care_show_leadership"
      />

      <PropositionRows
        header={leadershipPropositionsHeader}
        items={leadershipPropositions}
        tone="surface"
      />

      <ImageSection
        eyebrow={careImageSection.eyebrow}
        heading={careImageSection.heading}
        body={careImageSection.body}
        points={careImageSection.points}
        image={photos.careDignity}
        tone="ground"
      />

      <OverlaySection
        eyebrow="Delivered around the day job"
        heading="Managers stay in post while they qualify"
        body="Learning is scheduled around shifts and applied to the service they already run, so the organisation sees the benefit while the programme is still running."
        image={bandImages.advisers}
        tone="light"
      />

      <EligibilityPanel
        heading={leadershipEligibilityHeader.heading}
        standfirst={leadershipEligibilityHeader.standfirst}
        criteria={leadershipEligibility}
      />

      <FundingSection header={leadershipFundingHeader} routes={leadershipFunding} />

      <ClosingCta
        heading="Confirm your Q4 funding position"
        body="A senior adviser will confirm the funding your organisation qualifies for and which cohort fits your service."
        ctaHref="#register"
        ctaLabel={leadershipFormCopy.submitLabel}
      />

      <Container className="pb-4">
        <p className="label-mono text-ink-muted">Care Show · NEC Birmingham</p>
      </Container>
    </>
  );
}
