import { Quote } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { testimonials, testimonialsHeader } from "@/content/testimonials";

/**
 * Client feedback. Set in the display serif at a readable measure so the
 * quotes carry weight, with the programme area as the attribution line —
 * these were supplied by programme rather than by named client.
 */
export function Testimonials({ id = "feedback" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line bg-ground py-20 md:py-28">
      <Container>
        <SectionHeading {...testimonialsHeader} />

        <ul className="reveal-stagger mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.programme} className="flex">
              <figure className="flex flex-1 flex-col rounded-md border border-line bg-surface p-7 md:p-8">
                <Quote
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 text-emerald/30"
                  strokeWidth={1.5}
                />
                <blockquote className="mt-5 flex-1">
                  <p className="font-display text-lg leading-relaxed text-ink-strong">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <Icon name={item.icon} className="h-5 w-5 shrink-0 text-emerald" />
                  <span className="text-sm leading-snug">
                    {item.name ? (
                      <>
                        <span className="font-semibold text-ink-strong">{item.name}</span>
                        {item.organisation ? (
                          <span className="block text-ink-muted">{item.organisation}</span>
                        ) : null}
                        <span className="block text-ink-muted">{item.programme}</span>
                      </>
                    ) : (
                      <span className="text-ink-muted">{item.programme}</span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
