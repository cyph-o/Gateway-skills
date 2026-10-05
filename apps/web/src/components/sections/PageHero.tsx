import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { NetworkField } from "@/components/visuals/NetworkField";

interface PageHeroProps {
  eyebrow: string;
  headline: string;
  standfirst: string;
  actions?: ReactNode;
  /** Rendered beneath the copy block, full width of the hero. */
  footer?: ReactNode;
  tone?: "light" | "forest";
}

/**
 * Asymmetric two-column hero. Copy leads on desktop with the node field held
 * to the right; on mobile the visual is dropped entirely rather than stacked,
 * so the headline and call to action stay above the fold.
 */
export function PageHero({
  eyebrow,
  headline,
  standfirst,
  actions,
  footer,
  tone = "light",
}: PageHeroProps) {
  const forest = tone === "forest";
  return (
    <section
      data-surface={forest ? "forest" : undefined}
      className={forest ? "bg-forest" : "bg-ground"}
    >
      <Container className="pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <div className="hero-enter">
            <Eyebrow className={forest ? "text-emerald-lift" : ""}>{eyebrow}</Eyebrow>
            <h1 className="mt-6 text-display-xl">
              {headline}
            </h1>
            <p
              className={`mt-7 max-w-2xl text-lg leading-relaxed md:text-xl ${
                forest ? "text-on-forest-muted" : "text-ink-muted"
              }`}
            >
              {standfirst}
            </p>
            {actions ? <div className="mt-9 flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          <NetworkField
            className={`hero-visual hidden h-auto w-full max-w-sm lg:block ${
              forest ? "text-emerald-lift" : "text-emerald"
            }`}
          />
        </div>

        {footer ? <div className="reveal mt-14 md:mt-20">{footer}</div> : null}
      </Container>
    </section>
  );
}
