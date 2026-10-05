import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Icon } from "@/components/primitives/Icon";
import type { IconName } from "@/content/types";

export interface ImageSectionPoint {
  readonly text: string;
  readonly icon?: IconName;
}

interface ImageSectionProps {
  eyebrow: string;
  heading: string;
  body: string;
  points?: readonly ImageSectionPoint[];
  image: { src: string; alt: string };
  /** Flips the image to the right. Alternate down the page. */
  reverse?: boolean;
  tone?: "ground" | "surface";
  children?: ReactNode;
}

/**
 * Alternating image/text band. The image is framed by a hairline and offset
 * emerald rule rather than a drop shadow, so photography sits inside the same
 * editorial system as the rest of the page instead of looking pasted on.
 */
export function ImageSection({
  eyebrow,
  heading,
  body,
  points,
  image,
  reverse = false,
  tone = "surface",
  children,
}: ImageSectionProps) {
  return (
    <section
      className={`border-t border-line py-20 md:py-28 ${
        tone === "surface" ? "bg-surface" : "bg-ground"
      }`}
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Geometry is entirely positive — padding on the frame rather than
              negative offsets on the rule — so the decoration can never push
              the page sideways at a narrow width. The scale animation is
              clipped by an inner wrapper, which keeps the offset rule outside
              the clip where it stays visible. */}
          <div
            className={`relative pt-3 ${reverse ? "pr-3 lg:order-2" : "pl-3"}`}
          >
            <span
              aria-hidden="true"
              className={`absolute top-0 h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] border-t-2 border-emerald ${
                reverse ? "right-0 border-r-2" : "left-0 border-l-2"
              }`}
            />
            <div className="relative overflow-hidden border border-line">
              <Image
                src={image.src}
                alt={image.alt}
                width={960}
                height={720}
                sizes="(min-width: 1024px) 46vw, 100vw"
                // These assets are pre-generated at the exact sizes used,
                // already colour-graded and already WebP. Re-optimising them
                // costs server CPU and cache storage to produce a *larger*
                // file (a 22KB WebP came back as a 35KB JPEG), so they are
                // served as authored. Lazy loading and layout reservation from
                // next/image are still wanted, hence not a bare <img>.
                unoptimized
                className="reveal-image block h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className={`${reverse ? "reveal-left lg:order-1" : "reveal-right"}`}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-5 text-display-sm">{heading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">{body}</p>

            {points ? (
              <ul className="mt-8 space-y-4">
                {points.map((point) => (
                  <li key={point.text} className="flex gap-3 border-t border-line pt-4">
                    <Icon
                      name={point.icon ?? "badge-check"}
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald"
                    />
                    <span className="leading-relaxed text-ink">{point.text}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
