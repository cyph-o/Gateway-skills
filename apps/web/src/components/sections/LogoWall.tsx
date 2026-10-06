import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { clientLogos, logoWallHeader, logoWallNote } from "@/content/logos";
import { LogoMarquee } from "./LogoMarquee";

/**
 * Two marquee rows drifting in opposite directions. The counter-motion reads
 * as a network in movement and, practically, shows twice as many logos in the
 * same vertical space as a static grid.
 */
export function LogoWall() {
  const half = Math.ceil(clientLogos.length / 2);
  const topRow = clientLogos.slice(0, half);
  const bottomRow = clientLogos.slice(half);

  return (
    <section className="border-t border-line bg-surface py-14 md:py-20">
      <Container>
        <SectionHeading {...logoWallHeader} />
      </Container>

      <div className="reveal mt-12 space-y-4">
        <LogoMarquee logos={topRow} direction="right" />
        <LogoMarquee logos={bottomRow} direction="left" />
      </div>

      <Container>
        <p className="mt-10 text-center text-xs leading-relaxed text-ink-muted">{logoWallNote}</p>
      </Container>
    </section>
  );
}
