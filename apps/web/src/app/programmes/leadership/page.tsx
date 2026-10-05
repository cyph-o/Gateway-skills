import { ButtonLink } from "@/components/primitives/Button";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { CqcOutcomes } from "@/components/sections/CqcOutcomes";
import { EligibilityPanel } from "@/components/sections/EligibilityPanel";
import { FundingSection } from "@/components/sections/FundingSection";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { ImageSection } from "@/components/sections/ImageSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProgrammeJourney } from "@/components/sections/ProgrammeJourney";
import { PropositionRows } from "@/components/sections/PropositionRows";
import { QualificationBadges } from "@/components/sections/QualificationBadges";
import { RoleGrid } from "@/components/sections/RoleGrid";
import { TwinLists } from "@/components/sections/TwinLists";
import {
  leadershipBadges,
  leadershipFunding,
  leadershipFundingHeader,
} from "@/content/leadership";
import {
  cqcOutcomes,
  cqcOutcomesHeader,
  leadershipPressureConclusion,
  leadershipPressureHeader,
  leadershipPressures,
  leadershipRoi,
  leadershipRoiHeader,
} from "@/content/leadership-evidence";
import {
  leadershipEligibility,
  leadershipEligibilityHeader,
  leadershipImpactAreas,
  leadershipImpactHeader,
  leadershipJourney,
  leadershipJourneyHeader,
  leadershipLearningHeader,
  leadershipLearningOutcomes,
  leadershipProgrammeHero,
  leadershipProjectExamples,
} from "@/content/leadership-programme";
import { careImageSection, leadershipImageSection, photos } from "@/content/imagery";
import { careShowPlates } from "@/content/overlays";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Strategic Leadership & Service Design for Social Care",
  description:
    "CMI Level 7 Diploma in Strategic Management and Leadership Practice with a Level 6 " +
    "Service Designer qualification, fully funded for eligible UK care employers.",
  path: "/programmes/leadership",
});

export default function LeadershipProgrammePage() {
  return (
    <>
      <PageHero
        plates={careShowPlates}
        eyebrow={leadershipProgrammeHero.eyebrow}
        headline={leadershipProgrammeHero.headline}
        standfirst={leadershipProgrammeHero.standfirst}
        actions={
          <ButtonLink href="#register" size="lg" variant="on-forest">
            Check your funding eligibility
          </ButtonLink>
        }
        footer={<QualificationBadges items={leadershipBadges} />}
      />

      <RoleGrid header={leadershipPressureHeader} items={leadershipPressures} />
      <ImageSection
        eyebrow={careImageSection.eyebrow}
        heading={careImageSection.heading}
        body={careImageSection.body}
        points={careImageSection.points}
        image={photos.careDignity}
      />

      <CqcOutcomes header={cqcOutcomesHeader} items={cqcOutcomes} />

      <PropositionRows
        header={leadershipImpactHeader}
        items={leadershipImpactAreas}
        tone="surface"
      />

      <TwinLists
        header={leadershipLearningHeader}
        left={{ title: "Participants learn how to", items: leadershipLearningOutcomes }}
        right={{ title: "Typical workplace projects", items: leadershipProjectExamples }}
      />

      <ProgrammeJourney header={leadershipJourneyHeader} steps={leadershipJourney} />

      <ImageSection
        eyebrow={leadershipImageSection.eyebrow}
        heading={leadershipImageSection.heading}
        body={leadershipImageSection.body}
        points={leadershipImageSection.points}
        image={photos.leadershipTeam}
        reverse
        tone="ground"
      />

      <RoleGrid header={leadershipRoiHeader} items={leadershipRoi} />

      <EligibilityPanel
        heading={leadershipEligibilityHeader.heading}
        standfirst={leadershipEligibilityHeader.standfirst}
        criteria={leadershipEligibility}
        note={leadershipPressureConclusion}
      />

      <FundingSection header={leadershipFundingHeader} routes={leadershipFunding} />

      <LeadCaptureSection
        index="Enrolment"
        heading="Book a funding audit"
        standfirst="We confirm your levy position and the cohorts your organisation qualifies for."
        submitLabel="Secure My Funding Audit"
        campaign="programme_leadership"
      />

      <ClosingCta
        heading="Build the leaders behind outstanding care"
        body="Identify high-potential leaders across your homes and services today, and we will handle the funding route."
        ctaHref="#register"
        ctaLabel="Secure My Funding Audit"
      />
    </>
  );
}
