import { Mail } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/primitives/Button";
import { brand } from "@/content/brand";

interface ClosingCtaProps {
  heading: string;
  body: string;
  /** In-page anchor to the capture form, e.g. "#register". */
  ctaHref: string;
  ctaLabel: string;
}

export function ClosingCta({ heading, body, ctaHref, ctaLabel }: ClosingCtaProps) {
  return (
    <section className="border-t border-line bg-ground py-20 md:py-24">
      <Container width="text" className="text-center">
        <h2 className="text-display-md">{heading}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href={ctaHref} size="lg">
            {ctaLabel}
          </ButtonLink>
          <a
            href={`mailto:${brand.email}`}
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm border border-line-strong px-7 text-base text-ink-strong transition-colors hover:border-emerald hover:text-emerald"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {brand.email}
          </a>
        </div>
      </Container>
    </section>
  );
}
