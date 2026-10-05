import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { FlowStep, SectionHeader } from "@/content/types";

/** Numbered delivery sequence. Scales to any number of stages, unlike a fixed
 *  five-column flow, so the content drives the layout rather than the reverse. */
export function ProgrammeJourney({
  header,
  steps,
}: {
  header: SectionHeader;
  steps: readonly FlowStep[];
}) {
  return (
    <section className="border-t border-line bg-ground py-20 md:py-28">
      <Container>
        <SectionHeading {...header} />
        <ol className="reveal-stagger mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.label} className="bg-ground p-6 md:p-8">
              <span aria-hidden="true" className="block h-0.5 w-8 bg-emerald" />
              <h3 className="mt-4 text-xl leading-snug">{step.label}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
