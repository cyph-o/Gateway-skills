import { brand } from "./brand";

/**
 * Reproduced verbatim as supplied by Gateway. Do not paraphrase, reflow or
 * abridge this statement — it is a compliance disclosure, not marketing copy.
 */
export const corporateStatement =
  "Gateway Skills Network Ltd is a registered UK company operating as an " +
  "independent B2B workforce recruitment and strategic educational consultancy " +
  "framework. All higher-level qualifications are delivered exclusively via our " +
  "authorised, government-funded college network partners and ESFA registered " +
  "training providers.";

export const footerContact = {
  heading: "Speak to a senior adviser",
  body:
    "Assess your levy eligibility and book an introductory audit and funding check.",
  email: brand.email,
  webLabel: brand.webLabel,
} as const;
