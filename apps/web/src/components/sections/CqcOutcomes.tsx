import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { Proposition, SectionHeader } from "@/content/types";

/**
 * The five CQC key questions. Rendered on forest so it reads as the regulatory
 * anchor of the page — this is the framework every care operator is measured
 * against, and the one section a director will look for.
 */
export function CqcOutcomes({
  header,
  items,
}: {
  header: SectionHeader;
  items: readonly Proposition[];
}) {
  return (
    <section data-surface="forest" className="bg-forest py-20 md:py-28">
      <Container>
        <SectionHeading {...header} />
        <ol className="mt-14 grid gap-px bg-on-forest-line/50 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <li key={item.title} className="bg-forest p-6">
              <Icon name={item.icon} className="h-6 w-6 text-emerald-lift" />
              <h3 className="mt-5 font-sans text-lg font-semibold text-on-forest">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-forest-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
