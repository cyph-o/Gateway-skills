import Image from "next/image";
import type { ClientLogo } from "@/content/logos";

/**
 * One drifting row of logos. The children are rendered twice: the track
 * animates by exactly -50%, so the duplicate arrives precisely where the
 * original started and the loop never visibly jumps.
 *
 * The duplicate is aria-hidden — a screen reader should hear each organisation
 * once, not twice.
 */
export function LogoMarquee({
  logos,
  direction = "left",
}: {
  logos: readonly ClientLogo[];
  direction?: "left" | "right";
}) {
  const row = (clone: boolean) =>
    logos.map((logo) => (
      <li
        key={`${clone ? "clone" : "row"}-${logo.name}`}
        data-marquee-clone={clone ? "true" : undefined}
        aria-hidden={clone ? "true" : undefined}
        className="flex shrink-0 items-center justify-center px-8 py-4 md:px-12"
      >
        <Image
          src={logo.src}
          alt={clone ? "" : logo.name}
          width={210}
          height={80}
          unoptimized
          className="h-10 w-auto max-w-[9rem] object-contain opacity-55 transition-opacity hover:opacity-90 md:h-12 md:max-w-[11rem]"
        />
      </li>
    ));

  return (
    <div className="marquee">
      <ul className="marquee-track" data-direction={direction}>
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}
