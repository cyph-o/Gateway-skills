import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { QualificationTier } from "@/content/frontline";
import type { SectionHeader } from "@/content/types";

/** The three framework tiers, as an editorial table: level, who it is for,
 *  and what it covers. */
export function QualificationTiers({
  header,
  tiers,
}: {
  header: SectionHeader;
  tiers: readonly QualificationTier[];
}) {
  return (
    <section className="border-t border-line bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading {...header} />
        <ol className="reveal-stagger mt-14">
          {tiers.map((tier) => (
            <li
              key={tier.level}
              className="grid gap-5 border-t border-line py-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] md:gap-12 md:py-11"
            >
              <div>
                <span className="label-mono text-emerald">{tier.level}</span>
                <h3 className="mt-3 text-xl leading-snug md:text-2xl">{tier.title}</h3>
              </div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-semibold text-ink-strong">Target staff</dt>
                  <dd className="mt-1 leading-relaxed text-ink-muted">{tier.staff}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink-strong">Core focus</dt>
                  <dd className="mt-1 leading-relaxed text-ink-muted">{tier.focus}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
