import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { SectionHeader, UseCase } from "@/content/types";

const PARTS = [
  { key: "bottleneck", label: "The bottleneck" },
  { key: "application", label: "The AI application" },
  { key: "impact", label: "The commercial impact" },
] as const;

/** Each operator type as a three-column argument: problem, intervention,
 *  result. The parallel structure is what makes the three comparable. */
export function UseCaseRows({
  header,
  items,
}: {
  header: SectionHeader;
  items: readonly UseCase[];
}) {
  return (
    <section className="border-t border-line bg-ground py-20 md:py-28">
      <Container>
        <SectionHeading {...header} />
        <div className="reveal-stagger mt-14 space-y-px bg-line">
          {items.map((item) => (
            <article key={item.title} className="bg-ground py-9 md:py-11">
              <div className="flex items-start gap-4">
                <Icon name={item.icon} className="mt-1 h-7 w-7 shrink-0 text-emerald" />
                <h3 className="text-xl leading-snug sm:text-2xl md:text-3xl">{item.title}</h3>
              </div>
              <dl className="mt-7 grid gap-8 lg:grid-cols-3 lg:gap-10">
                {PARTS.map((part) => (
                  <div key={part.key} className="border-t border-line pt-5">
                    <dt className="label-mono text-ink-muted">{part.label}</dt>
                    <dd className="mt-3 leading-relaxed text-ink">{item[part.key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
