import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export interface OverlayStat {
  readonly value: string;
  readonly label: string;
}

interface OverlaySectionProps {
  id?: string;
  eyebrow: string;
  heading: string;
  body: string;
  image: { src: string; alt: string };
  stats?: readonly OverlayStat[];
  actions?: ReactNode;
  /** Vertical weight. "tall" for chapter openers, "band" for dividers. */
  height?: "band" | "tall";
  /** "light" scrims the photograph toward the page ground with dark text —
   *  alternating the two keeps a long page from going heavy. */
  tone?: "dark" | "light";
}

/**
 * Full-bleed photograph with overlaid copy — the cinematic device the page was
 * missing. The scrim is a forest gradient dense enough on the text side to
 * clear WCAG AA regardless of what the photograph is doing underneath, which
 * is why it is a gradient rather than a flat tint: flat enough to read, open
 * enough that the image still shows.
 */
export function OverlaySection({
  id,
  eyebrow,
  heading,
  body,
  image,
  stats,
  actions,
  height = "band",
  tone = "dark",
}: OverlaySectionProps) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      data-overlay={tone}
      data-surface={dark ? "forest" : undefined}
      className={`relative isolate flex scroll-mt-24 items-center overflow-hidden ${
        height === "tall" ? "min-h-[32rem] py-24 md:min-h-[38rem]" : "min-h-[22rem] py-20"
      }`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        unoptimized
        className="-z-20 object-cover"
      />
      {/* Dense where the copy sits, opening up to the far side so the
          photograph still reads as an image rather than a texture. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${
          dark
            ? "bg-gradient-to-r from-forest-deep/97 via-forest/92 to-forest/78"
            : "bg-gradient-to-r from-ground/98 via-ground/95 to-ground/82"
        }`}
      />

      <Container className="relative">
        <div className="max-w-2xl">
          <Eyebrow className={dark ? "text-emerald-lift" : "text-emerald"}>{eyebrow}</Eyebrow>
          <h2 className={`mt-5 text-display-md ${dark ? "text-white" : "text-ink-strong"}`}>
            {heading}
          </h2>
          <p
            className={`mt-5 text-lg leading-relaxed md:text-xl ${
              dark ? "text-on-forest-muted" : "text-ink-muted"
            }`}
          >
            {body}
          </p>

          {stats ? (
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`border-t pt-4 ${dark ? "border-emerald-lift/40" : "border-emerald/40"}`}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span
                      className={`block font-display text-3xl tabular-nums md:text-4xl ${
                        dark ? "text-white" : "text-ink-strong"
                      }`}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={`mt-1 block text-sm ${
                        dark ? "text-on-forest-muted" : "text-ink-muted"
                      }`}
                    >
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {actions ? <div className="mt-9 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </Container>
    </section>
  );
}
