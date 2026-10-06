/** The positioning flow Govind described: need → Gateway → the right partner. */
export const pathwayHeader = {
  eyebrow: "How Gateway works",
  heading: "From a business need to the right training partner",
  standfirst:
    "Gateway is an employer-facing skills connector, not a training provider. We sit " +
    "between the need and the accredited delivery that meets it.",
} as const;

export interface PathwayStage {
  readonly label: string;
  readonly detail: string;
}

export const pathwayStages: readonly PathwayStage[] = [
  { label: "Business need", detail: "A capability gap, a regulatory pressure, a retention problem." },
  { label: "Gateway Skills Network", detail: "We scope the need and establish the funding route." },
  { label: "The right training partner", detail: "Matched to an authorised, ESFA registered provider." },
  { label: "Skills, apprenticeships, transformation", detail: "Delivered and applied inside your organisation." },
] as const;

/** The four core areas Gateway connects employers to. */
export const coreAreas: readonly string[] = [
  "AI & Automation",
  "Service Transformation",
  "Leadership & Management",
  "Professional Business Skills",
] as const;
