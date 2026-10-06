
/** Background plates for the full-bleed overlay sections. */
export const overlayImages = {
  leadership: {
    src: "/images/photos/bg-leadership-w1800.webp",
    alt: "A manager leading a discussion with colleagues in a bright meeting room",
  },
  care: {
    src: "/images/photos/bg-care-w1800.webp",
    alt: "An older person's hand resting in the hands of a supporting carer",
  },
  automation: {
    src: "/images/photos/bg-automation-w1800.webp",
    alt: "An administrator working at a laptop in a care office",
  },
  funding: {
    src: "/images/photos/bg-funding-w1800.webp",
    alt: "Colleagues reviewing documents together around a meeting table",
  },
} as const;

export const heroOverlay = {
  eyebrow: "Gateway Skills Network Ltd",
  heading: "Connecting Business to Future Skills",
  body:
    "Fully funded, higher-level qualifications for UK care organisations, delivered " +
    "through our authorised college network and ESFA registered training partners.",
} as const;

export const leadershipOverlay = {
  eyebrow: "Strategic leadership",
  heading: "Develop the leaders your care organisation needs",
  body:
    "A CMI Level 7 Diploma paired with a Level 6 Service Designer qualification, built " +
    "for managers who stay in post while they study.",
} as const;

export const automationOverlay = {
  eyebrow: "AI & automation",
  heading: "Build internal AI capability with the staff you already have",
  body:
    "A Level 4 framework that trains your coordinators and administrators to automate " +
    "the parts of their own job that consume the most time.",
} as const;

export const fundingOverlay = {
  eyebrow: "Government funding",
  heading: "Substantial government funding for eligible employers",
  body:
    "Funding is available through established apprenticeship and workforce development " +
    "frameworks. We confirm exactly what your organisation qualifies for before any " +
    "commitment is made.",
} as const;


export const careOverlay = {
  eyebrow: "Why it matters",
  heading: "Better-led services are felt by residents and families",
  body:
    "Governance, retention and resource decisions determine how much time staff spend " +
    "with residents, and how consistently a service performs under inspection.",
} as const;

/** Cross-fading hero plates. Decorative — the heading carries the meaning. */
export const heroPlates = [
  { src: "/images/photos/hero-1-w2000.webp", alt: "" },
  { src: "/images/photos/hero-2-w2000.webp", alt: "" },
  { src: "/images/photos/hero-3-w2000.webp", alt: "" },
] as const;

export const careShowPlates = [
  { src: "/images/photos/hero-2-w2000.webp", alt: "" },
  { src: "/images/photos/hero-1-w2000.webp", alt: "" },
] as const;

export const bandImages = {
  admin: {
    src: "/images/photos/bg-admin-w1800.webp",
    alt: "A care administrator working at a laptop",
  },
  desk: {
    src: "/images/photos/bg-desk-w1800.webp",
    alt: "An administrator working through documents at a desk",
  },
  support: {
    src: "/images/photos/bg-support-w1800.webp",
    alt: "A carer steadying a walking frame for an older person",
  },
  advisers: {
    src: "/images/photos/bg-advisers-w1800.webp",
    alt: "Advisers in discussion around a laptop",
  },
} as const;
