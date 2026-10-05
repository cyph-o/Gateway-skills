import { brand } from "../brand";
import type { LegalDocument } from "./types";

export const accessibilityStatement: LegalDocument = {
  title: "Accessibility",
  updated: "2026-10-01",
  standfirst:
    "We want every care provider to be able to read these programmes and submit an " +
    "enquiry, whatever device or assistive technology they use.",
  sections: [
    {
      heading: "What we aim for",
      paragraphs: [
        "This site is built to meet WCAG 2.2 level AA. In practice that means:",
      ],
      bullets: [
        "Text contrast is measured, not assumed — body text sits well above the 4.5:1 minimum",
        "Every control can be reached and operated by keyboard, with a visible focus ring",
        "Form fields have real labels, and errors are announced and linked to their field",
        "Headings follow a logical order, so screen reader navigation makes sense",
        "Animation is suppressed entirely when your system requests reduced motion",
        "Layouts reflow to 320px without horizontal scrolling",
      ],
    },
    {
      heading: "Known limitations",
      paragraphs: [
        "We test with automated tooling and by keyboard on every release. We have not yet " +
          "completed a formal audit with a third-party accessibility specialist.",
      ],
    },
    {
      heading: "Tell us if something does not work",
      paragraphs: [
        `If any part of this site is difficult to use, email ${brand.email} and tell us ` +
          "what you were trying to do. We will fix it, and in the meantime we will take " +
          "your enquiry by email or phone instead.",
      ],
    },
  ],
};
