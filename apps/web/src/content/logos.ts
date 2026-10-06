export interface ClientLogo {
  readonly name: string;
  readonly src: string;
}

/**
 * Supplied by Gateway and rendered in uniform greyscale.
 *
 * Still outstanding from the client's list: Wakefield Council, Nationwide,
 * Thames Water, Bechtel Corporation, Peace Pharmacy. Drop a file into
 * public/images/logos and add an entry here.
 */
export const clientLogos: readonly ClientLogo[] = [
  { name: "Fern Leaf Care Home", src: "/images/logos/fern-leaf.webp" },
  { name: "Guy's and St Thomas' NHS Foundation Trust", src: "/images/logos/guys-st-thomas.webp" },
  { name: "Barclays", src: "/images/logos/barclays.webp" },
  { name: "London Borough of Newham", src: "/images/logos/newham.webp" },
  { name: "Southwark Council", src: "/images/logos/southwark.webp" },
  { name: "EY", src: "/images/logos/ey.webp" },
  { name: "Chartered Management Institute", src: "/images/logos/cmi.webp" },
  { name: "Skills for Care", src: "/images/logos/skills-for-care.webp" },
] as const;

export const logoWallHeader = {
  eyebrow: "Track record",
  heading: "Where our leadership team has worked",
  standfirst:
    "Experience across care, the NHS, local government, global consulting and regulated " +
    "training providers.",
} as const;

export const logoWallNote =
  "Organisations our leadership team has engaged with across their professional " +
  "careers. Inclusion does not imply partnership with, or endorsement of, Gateway " +
  "Skills Network Ltd.";
