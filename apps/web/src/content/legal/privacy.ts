import { brand } from "../brand";
import { PRIVACY_NOTICE_VERSION } from "./notice";
import type { LegalDocument } from "./types";

/**
 * DRAFT pending Gateway's approval. The company registration number, registered
 * address, ICO registration number and retention period are marked below and
 * must be supplied before launch — see docs/launch-checklist.md.
 */
export const privacyNotice: LegalDocument = {
  title: "Privacy notice",
  version: PRIVACY_NOTICE_VERSION,
  updated: "2026-10-01",
  standfirst:
    `How ${brand.legalName} collects and uses the details you give us when you enquire ` +
    "about a funded programme.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        `${brand.legalName} is a registered UK company operating as an independent B2B ` +
          "workforce recruitment and strategic educational consultancy framework. We are " +
          "the data controller for the details you submit through this website.",
        `You can contact us about anything in this notice at ${brand.email}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "When you submit a funding audit enquiry we collect only what we need to respond:",
      ],
      bullets: [
        "Your full name",
        "Your company or care group name",
        "Your direct mobile number",
        "Your corporate email address",
        "Which programme you enquired about, and the campaign link you arrived through",
      ],
    },
    {
      heading: "Why we use it, and our lawful basis",
      paragraphs: [
        "We use these details to respond to the enquiry you made — to assess your " +
          "organisation's funding eligibility and to contact you about it. Our lawful " +
          "basis is legitimate interests: you asked us to look into funding for your " +
          "organisation, and responding is what you would reasonably expect.",
        "We will only send you marketing about other programmes if you separately opted " +
          "in on the form. Making an enquiry is never treated as consent to marketing, " +
          "and you can withdraw an opt-in at any time by emailing us.",
      ],
    },
    {
      heading: "Who we share it with",
      paragraphs: [
        "To arrange a funded programme we may share your enquiry with the authorised " +
          "college network partner or ESFA registered training provider delivering it. " +
          "We also use service providers who host our website, database and email on our " +
          "behalf, under contract and only on our instructions.",
        "We do not sell your details, and we do not share them for anyone else's marketing.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep enquiry records for as long as needed to respond and to evidence the " +
          "funding arrangements that follow, then delete them. [Gateway to confirm the " +
          "retention period before launch.]",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You have the right to ask for a copy of the details we hold about you, to have " +
          "them corrected or deleted, to object to or restrict how we use them, and to " +
          "ask us to transfer them. To exercise any of these, email " +
          `${brand.email} and we will respond within one month.`,
        "If you are unhappy with how we have handled your details you can complain to " +
          "the Information Commissioner's Office at ico.org.uk.",
      ],
    },
    {
      heading: "Cookies and analytics",
      paragraphs: [
        "This site uses privacy-preserving, cookieless analytics that count page views " +
          "without identifying you or tracking you across other sites. We do not send " +
          "your name, email address or phone number to any analytics service.",
      ],
    },
  ],
};
