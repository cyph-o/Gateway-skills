/**
 * Claims register.
 *
 * Every regulated marketing claim renders through this module so an unapproved
 * claim physically cannot reach a page. `pending-signoff` claims return null
 * from `publishedClaim()` and the surrounding section is built to read
 * correctly without them.
 *
 * Status meanings:
 *  - "approved": Gateway's own commercial terms, supplied directly by the client.
 *  - "pending-signoff": a third-party or regulatory assertion that needs a
 *    verifiable citation before publication. See docs/claims-register.md.
 */

export type ClaimStatus = "approved" | "pending-signoff";

export interface Claim {
  readonly id: string;
  readonly text: string;
  readonly status: ClaimStatus;
  /** Why it is pending, or where an approved claim came from. */
  readonly note?: string;
}

export const claims = {
  dsitProductivity: {
    id: "dsit-productivity",
    text:
      "75% of UK businesses using AI reported an immediate increase in baseline " +
      "workforce productivity.",
    status: "pending-signoff",
    note:
      "Attributed to 'DSIT Research' with no publication, sample size, date or " +
      "exact wording supplied. Withheld until the primary source is verified.",
  },
  levyTransfer: {
    id: "levy-transfer",
    // Wording matched to Gateway's own flyer ("Transfers may be available for
    // eligible employers") rather than the stronger "now available" phrasing,
    // which would overstate a conditional arrangement.
    text:
      "Levy transfer: 100% government funded. Transfers may be available for eligible " +
      "employers.",
    status: "pending-signoff",
    note:
      "Withdrawn from the public site at Gateway's request: levy mechanics, percentages " +
      "and employer contributions are commercial detail for the eligibility conversation, " +
      "not the website.",
  },
  charteredPathway: {
    id: "chartered-pathway",
    text: "Chartered Manager (CMgr) pathway with CMgr MCMI or CMgr FCMI post-nominals.",
    status: "approved",
    note: "Supplied by Gateway. Entitlement is subject to CMI assessment criteria.",
  },
} as const satisfies Record<string, Claim>;

/**
 * Gateway's own qualifier, reproduced from their programme flyers. Shown
 * wherever funding figures appear, so no funding statement on this site stands
 * without it.
 */
export const fundingDisclaimer =
  "Funding levels, eligibility and levy transfer arrangements are subject to applicable " +
  "apprenticeship funding rules and employer eligibility. Confirm the current funding " +
  "position with the training provider before enrolment.";

/** Returns the claim text only when it is cleared for publication. */
export function publishedClaim(claim: Claim): string | null {
  return claim.status === "approved" ? claim.text : null;
}
