import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { CountUp } from "@/components/primitives/CountUp";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import {
  employerExperienceBody,
  employerExperienceHeader,
  experienceFigures,
} from "@/content/employer-experience";
import { bandImages } from "@/content/overlays";

/**
 * Gateway's credibility section, over photography like the other chapter
 * bands. The figures are the point, so they are set at display scale and count
 * up as they arrive — the one place on the site where an animated number earns
 * its keep.
 *
 * Marked data-overlay so the pixel-sampling contrast audit covers it: text
 * here sits on an image, which the DOM-based check cannot measure.
 */
export function EmployerExperience({ id = "experience" }: { id?: string }) {
  return (
    <section
      id={id}
      data-overlay="dark"
      data-surface="forest"
      className="relative isolate scroll-mt-24 overflow-hidden py-20 md:py-28"
    >
      <Image
        src={bandImages.advisers.src}
        alt={bandImages.advisers.alt}
        fill
        sizes="100vw"
        unoptimized
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/96 via-forest/90 to-forest/72"
      />

      <Container className="relative">
        <div className="reveal max-w-3xl">
          <Eyebrow className="text-emerald-lift">{employerExperienceHeader.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-display-md text-white">{employerExperienceHeader.heading}</h2>
          <p className="mt-6 text-lg leading-relaxed text-mist md:text-xl">
            {employerExperienceHeader.standfirst}
          </p>
        </div>

        {/* Transparent tiles with hairline rules, so the photograph still reads
            behind the figures instead of being boxed out by solid panels. */}
        <dl className="reveal-stagger mt-14 grid gap-8 border-t border-emerald-lift/35 pt-10 sm:grid-cols-3 sm:gap-6">
          {experienceFigures.map((figure) => (
            <div key={figure.label} className="text-center">
              <dt className="sr-only">{figure.label}</dt>
              <dd>
                <span className="block font-display text-5xl text-white md:text-6xl">
                  <CountUp value={figure.value} suffix={figure.suffix} />
                </span>
                <span className="mt-3 block text-sm leading-snug text-mist">{figure.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="reveal mt-14 grid gap-6 border-t border-emerald-lift/35 pt-10 md:grid-cols-2 md:gap-12">
          {employerExperienceBody.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-mist">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
