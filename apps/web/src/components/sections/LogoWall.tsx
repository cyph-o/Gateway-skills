import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { clientLogos, logoWallHeader, logoWallNote } from "@/content/logos";

/**
 * Client logo grid in uniform greyscale. Logos are supplied by Gateway; the
 * note below keeps the claim accurate about what the relationship was.
 */
export function LogoWall() {
  return (
    <section className="border-t border-line bg-surface py-14 md:py-20">
      <Container>
        <SectionHeading {...logoWallHeader} />
        <ul className="mt-12 reveal-stagger grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {clientLogos.map((logo) => (
            <li key={logo.name} className="flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.name}
                width={210}
                height={80}
                unoptimized
                className="h-12 w-auto object-contain opacity-55 transition-opacity hover:opacity-85 md:h-14"
              />
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-xs leading-relaxed text-ink-muted">{logoWallNote}</p>
      </Container>
    </section>
  );
}
