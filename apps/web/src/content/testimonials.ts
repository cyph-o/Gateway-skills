import type { IconName, SectionHeader } from "./types";

/**
 * Client feedback, supplied by Gateway.
 *
 * ATTRIBUTION OUTSTANDING. These arrived labelled by programme area rather
 * than by person and organisation, so they render with the programme as
 * context and no invented names — fabricating an attribution would be a far
 * worse problem than publishing without one.
 *
 * Under the CAP Code a testimonial must be genuine and the advertiser must
 * hold documentary evidence of it. Before a long campaign, add `name` and
 * `organisation` here once Gateway has written permission from each client,
 * and keep the evidence on file. See docs/claims-register.md.
 */
export interface Testimonial {
  readonly quote: string;
  readonly programme: string;
  readonly icon: IconName;
  /** Filled in once Gateway supplies a named, permissioned attribution. */
  readonly name?: string;
  readonly organisation?: string;
}

export const testimonialsHeader: SectionHeader = {
  eyebrow: "Client feedback",
  heading: "What care providers say about working with Gateway",
  standfirst:
    "Feedback from organisations we have supported across leadership, automation and " +
    "workforce development.",
};

export const testimonials: readonly Testimonial[] = [
  {
    programme: "Leadership & Service Design",
    icon: "award",
    quote:
      "The leadership pathway helped us reshape how we run the service. Our managers " +
      "became more confident, more structured, and far better at making decisions under " +
      "pressure. It has genuinely improved how our teams work day to day.",
  },
  {
    programme: "AI & Automation",
    icon: "cpu",
    quote:
      "The automation programme freed up hours of admin time every week. Our coordinators " +
      "now spend more time supporting staff and less time chasing paperwork. It's been one " +
      "of the most practical changes we've made.",
  },
  {
    programme: "Workforce Development",
    icon: "users",
    quote:
      "Gateway helped us understand our funding position clearly and connected us to " +
      "accredited delivery that actually fits the realities of adult social care. The " +
      "process was simple, and the impact on staff morale has been noticeable.",
  },
  {
    programme: "Funding & Support",
    icon: "shield-check",
    quote:
      "The team guided us through our funding options with complete clarity. We knew " +
      "exactly what we qualified for before any commitment was made, which made the whole " +
      "process feel safe and straightforward.",
  },
  {
    programme: "Overall Experience",
    icon: "heart-handshake",
    quote:
      "Professional, responsive and genuinely knowledgeable about the sector. Gateway's " +
      "support has helped us strengthen our service, improve consistency and invest in our " +
      "people in a way we couldn't have done alone.",
  },
] as const;
