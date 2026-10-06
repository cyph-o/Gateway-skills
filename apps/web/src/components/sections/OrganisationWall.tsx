import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import {
  organisations,
  organisationsDisclaimer,
  organisationsHeader,
} from "@/content/employer-experience";

/**
 * Organisations the team has engaged with, set as typeset names.
 *
 * Deliberately NOT a logo wall: these marks belong to their owners, most carry
 * brand guidelines restricting third-party use, and a grid of logos reads as a
 * client roster — implying a commercial relationship with Gateway that does not
 * exist. Named in type, with the disclaimer, the claim stays true and the
 * section still does its job.
 */
export function OrganisationWall({ id = "track-record" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line bg-ground py-20 md:py-28">
      <Container>
        <SectionHeading {...organisationsHeader} />

        <ul className="reveal-stagger mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {organisations.map((name) => (
            <li
              key={name}
              className="flex min-h-24 items-center justify-center bg-ground px-6 py-7 text-center"
            >
              <span className="font-display text-xl leading-snug text-ink-strong md:text-2xl">
                {name}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-muted">
          {organisationsDisclaimer}
        </p>
      </Container>
    </section>
  );
}
