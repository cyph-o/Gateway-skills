import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/primitives/Button";
import { PageHero } from "@/components/sections/PageHero";
import { PropositionRows } from "@/components/sections/PropositionRows";
import { brand } from "@/content/brand";
import { connectorHeader, connectorPoints } from "@/content/home";
import { corporateStatement } from "@/content/footer";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About Gateway Skills Network",
  description:
    "Gateway Skills Network connects UK employers to funded higher-level qualifications " +
    "through authorised college network partners and ESFA registered training providers.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Gateway"
        headline={brand.strapline}
        standfirst={
          "Gateway Skills Network is the connection between employers who need " +
          "higher-level capability and the accredited providers funded to deliver it. " +
          "We assess the funding route first, so nobody enrols on a programme that does " +
          "not fit their organisation."
        }
        actions={
          <ButtonLink href="/contact" size="lg">
            Speak to an adviser
          </ButtonLink>
        }
        footer={<p className="label-mono text-ink-muted">{brand.disciplines}</p>}
      />

      <PropositionRows header={connectorHeader} items={connectorPoints} tone="surface" />

      <section className="border-t border-line bg-ground py-20 md:py-24">
        <Container width="text">
          <h2 className="text-display-sm">How we operate</h2>
          <p className="mt-6 leading-relaxed text-ink">{corporateStatement}</p>
        </Container>
      </section>
    </>
  );
}
