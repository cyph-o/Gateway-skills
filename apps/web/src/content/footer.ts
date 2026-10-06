import { brand } from "./brand";

/**
 * Reproduced verbatim as supplied by Gateway. Do not paraphrase, reflow or
 * abridge this statement — it is a compliance disclosure, not marketing copy.
 */
export const corporateStatement =
  "Gateway Skills Network Ltd is a registered UK company providing independent workforce " +
  "and education consultancy. All programmes are delivered through authorised and " +
  "government-funded training partners operating within the UK's regulated " +
  "apprenticeship and higher-education frameworks.";

export const footerContact = {
  heading: "Speak to a senior adviser",
  body:
    "Assess your levy eligibility and book an introductory audit and funding check.",
  email: brand.email,
  webLabel: brand.webLabel,
} as const;
