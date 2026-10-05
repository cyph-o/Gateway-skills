import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/sections/PageHero";
import {
  careShowHubHero,
  careShowRoutes,
  careShowRoutesHeader,
} from "@/content/care-show";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Care Show — funded programmes for care providers",
  description:
    "Two fully funded pathways for UK adult social care employers: strategic leadership " +
    "and service design, or AI & automation capability.",
  path: "/care-show",
});

/** Shareable hub for the event: one link that offers both programmes, so a
 *  single QR code or spoken URL still routes a visitor to the right pathway. */
export default function CareShowHubPage() {
  return (
    <>
      <PageHero
        eyebrow={careShowHubHero.eyebrow}
        headline={careShowHubHero.headline}
        standfirst={careShowHubHero.standfirst}
      />

      <section className="border-t border-line bg-surface py-20 md:py-28">
        <Container>
          <SectionHeading {...careShowRoutesHeader} />
          <ul className="mt-14 grid gap-px bg-line lg:grid-cols-2">
            {careShowRoutes.map((route) => (
              <li key={route.href} className="bg-surface">
                <Link
                  href={route.href}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-ground md:p-10"
                >
                  <span className="label-mono text-emerald">{route.label}</span>
                  <h3 className="mt-5 text-2xl leading-snug md:text-3xl">{route.title}</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-ink-muted">{route.body}</p>
                  <dl className="mt-7 border-t border-line pt-5">
                    <dt className="text-sm text-ink-muted">{route.figureLabel}</dt>
                    <dd className="mt-1 font-display text-3xl text-ink-strong">{route.figure}</dd>
                  </dl>
                  <span className="label-mono mt-6 inline-flex items-center gap-2 text-emerald">
                    View programme
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ClosingCta
        heading="Not sure which pathway fits?"
        body="Speak to a senior adviser at the stand, or send us your details and we will assess your levy position across both programmes."
        ctaHref="/care-show/leadership#register"
        ctaLabel="Secure My Funding Audit"
      />
    </>
  );
}
