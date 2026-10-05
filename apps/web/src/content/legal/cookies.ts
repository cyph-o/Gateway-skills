import { brand } from "../brand";
import type { LegalDocument } from "./types";

export const cookiePolicy: LegalDocument = {
  title: "Cookies",
  updated: "2026-10-01",
  standfirst:
    "This site is deliberately built to work without tracking you, so there is no " +
    "cookie banner to dismiss.",
  sections: [
    {
      heading: "What we use",
      paragraphs: [
        "We do not set advertising or cross-site tracking cookies, and we do not use " +
          "cookies to build a profile of you.",
        "Our analytics are cookieless: they count page views and aggregate interactions " +
          "without storing an identifier on your device or following you to other sites. " +
          "Because nothing non-essential is stored, no consent banner is required, which " +
          "also means nothing blocks the enquiry form when you scan a QR code at an event.",
      ],
    },
    {
      heading: "Strictly necessary storage",
      paragraphs: [
        "Your browser may hold short-lived technical data needed to serve the page and " +
          "to submit the enquiry form securely. This is exempt from consent requirements " +
          "because the site cannot function without it.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: [`Email ${brand.email} if you would like more detail.`],
    },
  ],
};
