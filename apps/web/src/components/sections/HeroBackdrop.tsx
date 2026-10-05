import Image from "next/image";

export interface BackdropPlate {
  readonly src: string;
  readonly alt: string;
}

/**
 * Cross-fading hero backdrop. The first plate carries `priority` because it is
 * the LCP element; the rest load lazily since they are not seen for seconds.
 *
 * Images are decorative here — the heading carries the meaning — so they are
 * marked empty-alt rather than describing three photographs a screen reader
 * user would hear in sequence for no benefit.
 */
export function HeroBackdrop({ plates }: { plates: readonly BackdropPlate[] }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
      {plates.map((plate, i) => (
        <Image
          key={plate.src}
          src={plate.src}
          alt=""
          fill
          priority={i === 0}
          loading={i === 0 ? "eager" : "lazy"}
          sizes="100vw"
          unoptimized
          className="hero-slide object-cover"
        />
      ))}
    </div>
  );
}
