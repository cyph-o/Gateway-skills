import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { FlowStep, SectionHeader } from "@/content/types";

interface TransformationFlowProps {
  header: SectionHeader;
  steps: readonly FlowStep[];
  targets: readonly string[];
  /** Responsible-use statement, rendered as a standing qualification. */
  oversightNote?: string;
}

/**
 * The five-stage project sequence, drawn with a connecting rule rather than
 * arrow graphics so it stays legible at 390px and needs no images.
 */
export function TransformationFlow({
  header,
  steps,
  targets,
  oversightNote,
}: TransformationFlowProps) {
  return (
    <section data-surface="forest" className="bg-forest py-20 md:py-28">
      <Container>
        <SectionHeading {...header} />

        <ol className="reveal-stagger mt-14 grid grid-cols-1 gap-px bg-on-forest-line/50 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <li key={step.label} className="bg-forest p-6">
              <span aria-hidden="true" className="block h-0.5 w-8 bg-emerald-lift" />
              <h3 className="mt-4 font-sans text-base font-semibold text-on-forest">
                {step.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-forest-muted">{step.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
          <div>
            <h3 className="label-mono text-emerald-lift">Typical care project targets</h3>
            <ul className="mt-6 space-y-4">
              {targets.map((target) => (
                <li key={target} className="flex gap-3">
                  <Icon name="badge-check" className="h-5 w-5 shrink-0 text-emerald-lift" />
                  <span className="leading-relaxed text-on-forest-muted">{target}</span>
                </li>
              ))}
            </ul>
          </div>

          {oversightNote ? (
            <aside className="border-l-2 border-emerald-lift/50 pl-6">
              <h3 className="label-mono text-emerald-lift">Human oversight</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-on-forest-muted">
                {oversightNote}
              </p>
            </aside>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
