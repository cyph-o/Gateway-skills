import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { claims, fundingDisclaimer, publishedClaim } from "@/content/claims";
import type { FundingRoute, SectionHeader } from "@/content/types";

interface FundingSectionProps {
  header: SectionHeader;
  routes: readonly FundingRoute[];
}

/**
 * Funding figures are the most consequential numbers on the page, so they are
 * set as display type and labelled unambiguously. The employer contribution is
 * stated as a co-investment percentage to avoid it reading as a VAT rate.
 */
export function FundingSection({ header, routes }: FundingSectionProps) {
  const transfer = publishedClaim(claims.levyTransfer);

  return (
    <section className="border-t border-line bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading {...header} />

        <div className="reveal-stagger mt-14 grid gap-px bg-line md:grid-cols-2">
          {routes.map((route) => (
            <div key={route.label} className="bg-surface p-7 md:p-10">
              <h3 className="label-mono text-emerald">{route.label}</h3>
              <p className="mt-5 font-display text-4xl text-ink-strong md:text-5xl">
                {route.headline}
              </p>
              <p className="mt-4 leading-relaxed text-ink-muted">{route.detail}</p>

              {route.figures ? (
                <dl className="mt-7 border-t border-line pt-6">
                  {route.figures.map((figure) => (
                    <div
                      key={figure.label}
                      className="flex items-baseline justify-between gap-4 py-2"
                    >
                      <dt className="text-sm text-ink-muted">{figure.label}</dt>
                      <dd className="font-display text-2xl text-ink-strong">{figure.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {/* Outside the <dl>: a definition list may only directly contain
                  dt/dd groups, so this note cannot live inside it. */}
              {route.figures ? (
                <p className="mt-3 text-xs text-ink-muted">
                  The employer contribution is a 5% co-investment of the programme value,
                  plus VAT.
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {transfer ? (
          <p className="mt-8 border-l-2 border-emerald pl-5 text-ink-muted">{transfer}</p>
        ) : null}

        <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-ink-muted">
          {fundingDisclaimer}
        </p>
      </Container>
    </section>
  );
}
