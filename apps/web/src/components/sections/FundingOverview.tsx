import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { ButtonLink } from "@/components/primitives/Button";
import { PRIMARY_CTA, fundingHeader, fundingNote, fundingPoints } from "@/content/funding";

/**
 * Funding, as a scannable list rather than a paragraph. No figures: Gateway
 * asked for pricing, percentages and levy mechanics to stay out of public copy
 * and inside the eligibility conversation.
 */
export function FundingOverview({ id = "funding" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line bg-ground py-20 md:py-28">
      <Container>
        <SectionHeading {...fundingHeader} />

        <ul className="reveal-stagger mt-12 grid gap-px bg-line sm:grid-cols-2">
          {fundingPoints.map((point) => (
            <li key={point.label} className="flex gap-4 bg-ground p-6 md:p-7">
              <Icon name={point.icon} className="mt-0.5 h-6 w-6 shrink-0 text-emerald" />
              <span className="leading-relaxed text-ink">{point.label}</span>
            </li>
          ))}
        </ul>

        <div className="reveal mt-10 flex flex-wrap items-center gap-6">
          <ButtonLink href="#enquire" size="lg">
            {PRIMARY_CTA}
          </ButtonLink>
          <p className="max-w-xl text-sm leading-relaxed text-ink-muted">{fundingNote}</p>
        </div>
      </Container>
    </section>
  );
}
