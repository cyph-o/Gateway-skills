import { Mail, Globe } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { PageHero } from "@/components/sections/PageHero";
import { brand } from "@/content/brand";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Gateway Skills Network to assess your apprenticeship levy eligibility and " +
    "book an introductory funding check.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        headline="Assess your levy eligibility and book a funding check"
        standfirst={
          "Tell us who you are and which organisation you represent. A senior adviser " +
          "will come back to you directly — there is no automated sequence and no " +
          "obligation."
        }
        footer={
          <Container className="px-0">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <a
                href={`mailto:${brand.email}`}
                className="inline-flex items-center gap-2 text-emerald underline decoration-emerald/30 underline-offset-4 hover:decoration-emerald"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {brand.email}
              </a>
              <span className="inline-flex items-center gap-2 text-ink-muted">
                <Globe className="h-4 w-4" aria-hidden="true" />
                {brand.webLabel}
              </span>
            </div>
          </Container>
        }
      />

      <LeadCaptureSection
        index="Enquiry"
        heading="Send us your details"
        standfirst="We use these details to respond to your enquiry and assess your funding position."
        submitLabel="Send enquiry"
        campaign="general_contact"
      />
    </>
  );
}
