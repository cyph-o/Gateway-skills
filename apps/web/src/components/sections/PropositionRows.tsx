import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { ReactNode } from "react";
import type { Proposition, SectionHeader } from "@/content/types";

interface PropositionRowsProps {
  header: SectionHeader;
  items: readonly Proposition[];
  tone?: "ground" | "surface";
  /** Rendered between the heading and the rows. */
  intro?: ReactNode;
}

/**
 * The workhorse content section: numbered, hairline-separated editorial rows.
 * Deliberately not three stacked cards — the rule-and-number rhythm is what
 * gives the page its institutional register.
 */
export function PropositionRows({ header, items, tone = "ground", intro }: PropositionRowsProps) {
  return (
    <section
      className={`border-t border-line py-20 md:py-28 ${
        tone === "surface" ? "bg-surface" : "bg-ground"
      }`}
    >
      <Container>
        <SectionHeading {...header} />
        {intro}
        <ol className="reveal-stagger mt-14">
          {items.map((item) => (
            <li
              key={item.title}
              className="grid gap-5 border-t border-line py-9 md:grid-cols-[1fr_minmax(0,1.6fr)] md:gap-12 md:py-11"
            >
              <div className="flex items-start gap-4 md:block">
                <Icon name={item.icon} className="h-7 w-7 shrink-0 text-emerald" />
                <h3 className="text-xl leading-snug md:mt-5 md:text-2xl">{item.title}</h3>
              </div>
              <p className="leading-relaxed text-ink-muted md:pt-1 md:text-lg">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
