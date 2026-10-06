# Claims register

Every regulated marketing claim on this site renders through
`apps/web/src/content/claims.ts`. A claim marked `pending-signoff` returns `null`
from `publishedClaim()` and **cannot reach a page** — the surrounding section is
built to read correctly without it.

Gateway's own funding disclaimer (taken verbatim from the programme flyers) is
rendered beneath every funding block, so no funding figure on this site stands
without its qualifier.

## Status

| Claim | Where it appears | Status | Notes |
| --- | --- | --- | --- |
| "Fully funded executive pathway" | Leadership hero | **Approved** | Gateway's own wording. Qualified by the funding disclaimer. |
| "100% covered through existing DAS levy accounts" | Both funding blocks | **Approved** | Gateway's own commercial terms. |
| "95% government funded" | Both funding blocks | **Approved** | Matches both flyers. |
| £15,000 / £750 + VAT | Leadership funding | **Approved** | Supplied by Gateway. |
| £18,000 / £900 + VAT | AI funding | **Approved** | Matches the AI flyer's "£18,000 programme / funding rate, 95% government funded, 5% employer contribution". |
| Levy transfer | Both funding blocks | **Approved** | Wording matched to the flyer's hedged "Transfers **may be** available for eligible employers" rather than the stronger "now available". |
| Chartered Manager pathway, CMgr MCMI / FCMI | Leadership badges | **Approved** | Flyer states "Chartered Manager (CMgr FCMI / MCMI) — fast-track pathway". Entitlement remains subject to CMI assessment. |
| **DSIT "75% of UK businesses using AI…" productivity statistic** | AI funding section | **PENDING — not published** | Attributed only to "DSIT Research" with no publication, date, sample size or exact wording. Switched off in `claims.ts`; the section reads correctly without it. |

## Resolved during the build

**The "£900 + VAT (5%)" ambiguity.** As written in the brief this reads as a 5%
VAT rate, which would be wrong (UK VAT is 20%). The AI flyer confirms the
intended meaning: £18,000 programme value, **95% government funded, 5% employer
contribution** — £900 being that 5%. The site renders "Employer contribution:
£900 + VAT" with the explanatory line "The employer contribution is a 5%
co-investment of the programme value, plus VAT."

**Qualification title.** The brief says "Level 6 Service Design"; the flyer shows
the apprenticeship is **Level 6 Service Designer**. The site uses the precise
awarding title for the qualification, and keeps "Service Design & Transformation
in Social Care" as the section heading, which describes the discipline.

**Spelling.** "Recognized" in the brief is rendered "Recognised" for UK consistency.

## To release the DSIT statistic

Supply the exact publication title, date, sample and wording, then change
`claims.dsitProductivity.status` to `"approved"` in
`apps/web/src/content/claims.ts`. No other change is needed.

## Taken from flyer pages 3-4

Added to the leadership pages from the pathway flyer, and therefore Gateway's own
approved copy: the six sector pressures, the five CQC key-question mappings, the
seven organisational ROI outcomes, the six-stage delivery journey, and the four
**eligibility criteria** (30+ hours in England, 3 years UK/EEA residency with
right to work, operational care role, not already on another funded
apprenticeship). Eligibility is stated as criteria confirmed during the funding
audit, not as a guarantee.

## Testimonials — ATTRIBUTION OUTSTANDING

Five client quotes are published on the homepage at Gateway's instruction.
They were supplied labelled by programme area, not by named client, so they
render with the programme as context and **no invented attribution**.

Under the CAP Code a testimonial must be genuine and the advertiser must hold
documentary evidence of it. Two things are outstanding:

1. **Written permission** from each client to publish their feedback.
2. **Named attribution** (person, role, organisation). `Testimonial` in
   `src/content/testimonials.ts` already carries optional `name` and
   `organisation` fields; filling them in is the only change needed.

Until then the quotes are unattributed, which is weaker evidentially and less
persuasive to a reader. Note this reverses the earlier instruction that Gateway
does not use customer reviews.

## Still to confirm before launch

- Company registration number, registered address and ICO registration number
  (needed for the footer and the privacy notice).
- Data retention period for enquiry records — marked `[Gateway to confirm]` in
  the privacy notice.
- Whether the mobile number will be used for marketing calls or texts, or only
  to respond to the enquiry. This changes the PECR consent wording.
- Whether delivery partners (e.g. The Prime College, named on the leadership
  flyer) should be named on the public site. They currently are not; the
  corporate statement refers to "authorised college network partners" instead.
