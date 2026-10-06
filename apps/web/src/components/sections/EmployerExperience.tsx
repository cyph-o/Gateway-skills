import { Container } from "@/components/layout/Container";
import { CountUp } from "@/components/primitives/CountUp";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import {
  employerExperienceBody,
  employerExperienceHeader,
  experienceFigures,
} from "@/content/employer-experience";

/**
 * Gateway's credibility section. The figures are the point, so they are set at
 * display scale and count up as they arrive — the one place on the site where
 * an animated number earns its keep.
 */
export function EmployerExperience({ id = "experience" }: { id?: string }) {
  return (
    <section id={id} data-surface="forest" className="scroll-mt-24 bg-forest py-20 md:py-28">
      <Container>
        <div className="reveal max-w-3xl">
          <Eyebrow className="text-emerald-lift">{employerExperienceHeader.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-display-md text-white">{employerExperienceHeader.heading}</h2>
          <p className="mt-6 text-lg leading-relaxed text-mist md:text-xl">
            {employerExperienceHeader.standfirst}
          </p>
        </div>

        <dl className="reveal-stagger mt-14 grid gap-px bg-on-forest-line/50 sm:grid-cols-3">
          {experienceFigures.map((figure) => (
            <div key={figure.label} className="bg-forest px-2 py-8 text-center sm:px-6">
              <dt className="sr-only">{figure.label}</dt>
              <dd>
                <span className="block font-display text-5xl text-white md:text-6xl">
                  <CountUp value={figure.value} suffix={figure.suffix} />
                </span>
                <span className="mt-3 block text-sm leading-snug text-on-forest-muted">
                  {figure.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="reveal mt-14 grid gap-6 md:grid-cols-2 md:gap-12">
          {employerExperienceBody.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-on-forest-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
