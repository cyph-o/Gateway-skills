import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { coreAreas, pathwayHeader, pathwayStages } from "@/content/pathway";

/**
 * The positioning diagram: business need → Gateway → the right partner →
 * delivery. Built from real elements rather than an image, so it reflows to a
 * vertical sequence on a phone and the connector animates as it enters view.
 */
export function PathwayFlow({ id = "approach" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading {...pathwayHeader} />

        <ol className="reveal-stagger mt-14 grid gap-4 lg:grid-cols-4 lg:gap-0">
          {pathwayStages.map((stage, i) => {
            const isGateway = i === 1;
            return (
              <li key={stage.label} className="relative flex lg:block">
                <div
                  className={`flex-1 rounded-md border p-6 lg:mr-5 ${
                    isGateway
                      ? "border-emerald bg-emerald text-white"
                      : "border-line bg-ground"
                  }`}
                >
                  <span
                    className={`label-mono ${isGateway ? "text-white" : "text-emerald"}`}
                  >
                    Stage {i + 1}
                  </span>
                  <h3
                    className={`mt-3 text-lg leading-snug ${isGateway ? "text-white" : ""}`}
                  >
                    {stage.label}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isGateway ? "text-mist" : "text-ink-muted"
                    }`}
                  >
                    {stage.detail}
                  </p>
                </div>

                {i < pathwayStages.length - 1 ? (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute top-1/2 right-0 hidden h-5 w-5 -translate-y-1/2 text-emerald lg:block"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>

        <ul className="reveal mt-12 flex flex-wrap justify-center gap-x-3 gap-y-3 border-t border-line pt-10">
          {coreAreas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-emerald/30 bg-mist/50 px-5 py-2 text-sm font-medium text-ink-strong"
            >
              {area}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
