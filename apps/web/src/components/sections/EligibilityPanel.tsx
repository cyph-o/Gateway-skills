import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";

interface EligibilityPanelProps {
  heading: string;
  standfirst: string;
  criteria: readonly string[];
  /** Optional closing line, e.g. the flyer's systemic-challenges statement. */
  note?: string;
}

/**
 * Eligibility stated plainly and early. At a trade stand this does real work:
 * it stops an adviser spending ten minutes on a candidate who was never going
 * to qualify, and it signals that Gateway checks before it sells.
 */
export function EligibilityPanel({
  heading,
  standfirst,
  criteria,
  note,
}: EligibilityPanelProps) {
  return (
    <section className="border-t border-line bg-surface py-16 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
          <div>
            <h2 className="text-display-sm">{heading}</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">{standfirst}</p>
          </div>
          <ul className="space-y-4">
            {criteria.map((item) => (
              <li key={item} className="flex gap-3 border-b border-line pb-4 last:border-0">
                <Icon name="badge-check" className="h-5 w-5 shrink-0 text-emerald" />
                <span className="leading-relaxed text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {note ? (
          <p className="mt-10 border-l-2 border-emerald pl-5 text-lg leading-relaxed text-ink">
            {note}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
