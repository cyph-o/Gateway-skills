import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { NetworkField } from "@/components/visuals/NetworkField";
import { HeroBackdrop, type BackdropPlate } from "./HeroBackdrop";

interface PageHeroProps {
  eyebrow: string;
  headline: string;
  standfirst: string;
  actions?: ReactNode;
  /** Rendered beneath the copy block, full width of the hero. */
  footer?: ReactNode;
  tone?: "light" | "forest";
  /** Supplying plates switches the hero to a photographic backdrop. */
  plates?: readonly BackdropPlate[];
}

/**
 * Hero in two modes: a quiet editorial one for inner pages, and a
 * photographic one for campaign and landing pages. The copy column keeps the
 * same measure in both so the brand voice does not shift between them.
 */
export function PageHero({
  eyebrow,
  headline,
  standfirst,
  actions,
  footer,
  tone = "light",
  plates,
}: PageHeroProps) {
  const photographic = Boolean(plates?.length);
  const dark = photographic || tone === "forest";

  return (
    <section
      data-surface={dark ? "forest" : undefined}
      className={`relative isolate overflow-hidden ${
        photographic ? "bg-forest-deep" : tone === "forest" ? "bg-forest" : "bg-ground"
      }`}
    >
      {photographic ? (
        <>
          <HeroBackdrop plates={plates!} />
          {/* Two scrims: a horizontal one to anchor the copy column, and a
              vertical one so the header and the section below both have
              something solid to sit against as the plates change. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/93 via-forest-deep/78 to-forest/45"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/55 via-transparent to-forest-deep/75"
          />
        </>
      ) : null}

      <Container
        className={photographic ? "pt-12 pb-12 md:pt-16 md:pb-16" : "pt-16 pb-14 md:pt-24 md:pb-20"}
      >
        <div
          className={
            photographic
              ? "max-w-4xl"
              : "grid items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16"
          }
        >
          <div className="hero-enter">
            <Eyebrow className={dark ? "text-emerald-lift" : ""}>{eyebrow}</Eyebrow>
            <h1
              className={`mt-5 text-display-xl text-balance ${photographic ? "text-white" : ""}`}
            >
              {headline}
            </h1>
            <p
              // Brighter than the usual muted tone on photographic heroes: at
              // phone width the scrim gradient compresses and the copy reaches
              // its lighter end, which drops the muted tone just below AA.
              className={`mt-5 max-w-2xl leading-relaxed md:text-lg ${
                photographic ? "text-mist" : dark ? "text-on-forest-muted" : "text-ink-muted"
              }`}
            >
              {standfirst}
            </p>
            {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          {photographic ? null : (
            <NetworkField
              className={`hero-visual hidden h-auto w-full max-w-sm lg:block ${
                dark ? "text-emerald-lift" : "text-emerald"
              }`}
            />
          )}
        </div>

        {footer ? <div className="reveal mt-10 md:mt-12">{footer}</div> : null}
      </Container>
    </section>
  );
}
