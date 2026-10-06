import type { ImageSectionPoint } from "@/components/sections/ImageSection";

/**
 * Photography is CC0 (public domain), colour-graded to one treatment so the
 * set reads as a single commissioned shoot. See docs/image-credits.md for
 * provenance and the recommendation to replace these with real photography of
 * Gateway's partner settings.
 *
 * Alt text is descriptive and dignified: it says what is happening, never
 * implies the people shown are Gateway clients or service users.
 */
export const photos = {
  careDignity: {
    src: "/images/photos/care-dignity-w960.webp",
    alt: "An older person's hand resting in the hands of a supporting carer",
  },
  careSupport: {
    src: "/images/photos/care-support-w960.webp",
    alt: "A carer steadying a walking frame for an older person in a bright room",
  },
  leadershipTeam: {
    src: "/images/photos/leadership-team-w960.webp",
    alt: "A manager leading a discussion with colleagues around a table in a bright meeting room",
  },
  leadershipReview: {
    src: "/images/photos/leadership-review-w960.webp",
    alt: "Colleagues reviewing documents and laptops together around a meeting table",
  },
  automationDesk: {
    src: "/images/photos/automation-desk-w960.webp",
    alt: "An administrator working at a laptop with notes beside them",
  },
  automationAdmin: {
    src: "/images/photos/automation-admin-w960.webp",
    alt: "A care administrator smiling while working at a laptop in an office",
  },
} as const;

export const leadershipImageSection = {
  eyebrow: "Delivered around the day job",
  heading: "Capability built inside the service, not away from it",
  body:
    "Managers stay in post throughout. Learning is scheduled around shifts and applied " +
    "directly to the service they already run, so the organisation sees the benefit " +
    "while the programme is still running.",
  points: [
    { text: "Monthly 1:1 executive coaching scheduled around shifts", icon: "calendar-clock" },
    { text: "A live improvement project inside your own service", icon: "workflow" },
    { text: "Employer reviews every 10–12 weeks with leadership sponsors", icon: "users" },
  ] satisfies readonly ImageSectionPoint[],
} as const;

export const careImageSection = {
  eyebrow: "Why it matters",
  heading: "Better-led services are felt by residents and families",
  body:
    "Governance, retention and resource decisions are not back-office concerns. They " +
    "determine how much time staff can spend with residents, and how consistently a " +
    "service performs under inspection.",
  points: [
    { text: "Recover hours of direct care time from administration", icon: "heart-handshake" },
    { text: "Evidence continuous improvement against the CQC framework", icon: "shield-check" },
    { text: "Reduce turnover by building accountable, supported teams", icon: "users" },
  ] satisfies readonly ImageSectionPoint[],
} as const;

export const automationImageSection = {
  eyebrow: "Who does the work",
  heading: "Your existing coordinators and administrators, upskilled",
  body:
    "No new technical hire. The framework trains the people already running your " +
    "rotas, admissions and compliance records to automate the parts of their own job " +
    "that consume the most time.",
  points: [
    { text: "Automate rostering, data entry and document processing", icon: "workflow" },
    { text: "Build live compliance dashboards for multi-site oversight", icon: "layout-dashboard" },
    { text: "Keep the capability, and the knowledge, in-house", icon: "cpu" },
  ] satisfies readonly ImageSectionPoint[],
} as const;

export const automationProjectImageSection = {
  eyebrow: "The live project",
  heading: "A working assistant, built inside your facility",
  body:
    "Every apprentice delivers a practical automation assistant addressing a real " +
    "bottleneck in your service during their training, not a classroom exercise " +
    "written up afterwards.",
  points: [
    { text: "Care plan updates and review alerts", icon: "clipboard-list" },
    { text: "Resident admissions and onboarding documentation", icon: "file-stack" },
    { text: "Automated CQC Single Assessment audit logs", icon: "shield-check" },
  ] satisfies readonly ImageSectionPoint[],
} as const;
