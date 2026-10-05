import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { ImageSection } from "@/components/sections/ImageSection";
import { PageHero } from "@/components/sections/PageHero";
import { PropositionRows } from "@/components/sections/PropositionRows";
import { brand } from "@/content/brand";
import { capabilities, capabilityHeader, connectorHeader, connectorPoints, homeHero } from "@/content/home";
import { careImageSection, photos } from "@/content/imagery";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: brand.strapline,
  description:
    "Gateway Skills Network connects UK employers to fully funded higher-level " +
    "qualifications in leadership, service transformation, and AI & automation.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow={homeHero.eyebrow}
        headline={homeHero.headline}
        standfirst={homeHero.standfirst}
        actions={
          <>
            <ButtonLink href={homeHero.primaryCta.href} size="lg">
              {homeHero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={homeHero.secondaryCta.href} size="lg" variant="outline">
              {homeHero.secondaryCta.label}
            </ButtonLink>
          </>
        }
        footer={<p className="label-mono text-ink-muted">{brand.disciplines}</p>}
      />

      <section className="border-t border-line bg-surface py-20 md:py-28">
        <Container>
          <SectionHeading {...capabilityHeader} />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <li key={item.title} className="bg-surface">
                <Link
                  href={item.href}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-ground md:p-9"
                >
                  <Icon name={item.icon} className="h-7 w-7 text-emerald" />
                  <h3 className="mt-6 text-2xl">{item.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{item.body}</p>
                  <span className="label-mono mt-7 inline-flex items-center gap-2 text-emerald">
                    View programme
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ImageSection
        eyebrow={careImageSection.eyebrow}
        heading={careImageSection.heading}
        body={careImageSection.body}
        points={careImageSection.points}
        image={photos.careDignity}
        tone="ground"
      />

      <PropositionRows header={connectorHeader} items={connectorPoints} />
    </>
  );
}
