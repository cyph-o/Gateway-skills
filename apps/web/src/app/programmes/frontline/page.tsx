import { ButtonLink } from "@/components/primitives/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { OverlaySection } from "@/components/sections/OverlaySection";
import { PageHero } from "@/components/sections/PageHero";
import { ProgrammeJourney } from "@/components/sections/ProgrammeJourney";
import { QualificationTiers } from "@/components/sections/QualificationTiers";
import { RoleGrid } from "@/components/sections/RoleGrid";
import {
  frontlineClosing,
  frontlineDelivery,
  frontlineDeliveryHeader,
  frontlineFundingHeader,
  frontlineFundingPoints,
  frontlineHero,
  frontlineOverview,
  frontlineTiers,
  frontlineTiersHeader,
} from "@/content/frontline";
import { bandImages, careShowPlates } from "@/content/overlays";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, programmeSchema } from "@/lib/structured-data";

const DESCRIPTION =
  "Fully funded Level 2, 3 and 5 adult social care qualifications for frontline staff, " +
  "senior carers and registered managers. Delivered remotely, around active shift rotas.";

export const metadata = pageMetadata({
  title: "Funded Care Qualifications, Levels 2 to 5",
  description: DESCRIPTION,
  path: "/programmes/frontline",
});

export default function FrontlineProgrammePage() {
  return (
    <>
      <JsonLd
        data={programmeSchema({
          name: "Frontline Care Worker & Operational Manager Programmes",
          description: DESCRIPTION,
          path: "/programmes/frontline",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Programmes", path: "/#programmes" },
          { name: "Frontline Care Worker & Operational Manager", path: "/programmes/frontline" },
        ])}
      />

      <PageHero
        plates={careShowPlates}
        eyebrow={frontlineHero.eyebrow}
        headline={frontlineHero.headline}
        standfirst={frontlineHero.standfirst}
        actions={
          <ButtonLink href="#register" size="lg" variant="on-forest">
            {frontlineClosing.cta}
          </ButtonLink>
        }
      />

      <OverlaySection
        eyebrow="Programme overview"
        heading="Training that fits around active shift patterns"
        body={frontlineOverview}
        image={bandImages.support}
        tone="light"
      />

      <QualificationTiers header={frontlineTiersHeader} tiers={frontlineTiers} />

      <ProgrammeJourney header={frontlineDeliveryHeader} steps={frontlineDelivery} />

      <RoleGrid header={frontlineFundingHeader} items={frontlineFundingPoints} />

      <LeadCaptureSection
        index="Eligibility"
        heading="Check funding and registration eligibility"
        standfirst="Tell us about your service and we will confirm which funded places your staff qualify for."
        submitLabel="Review My Funding Position"
        campaign="programme_frontline"
      />

      <ClosingCta
        heading={frontlineClosing.heading}
        body={frontlineClosing.body}
        ctaHref="#register"
        ctaLabel={frontlineClosing.cta}
      />
    </>
  );
}
