# Launch checklist

Tick these against the **deployed** site, not localhost.

## Blocking — must be done before the Care Show

- [ ] Neon database created, `DATABASE_URL` set, `pnpm db:migrate` applied
- [ ] Resend domain verified (SPF/DKIM/DMARC on `gatewayskillsnetwork.co.uk`)
- [ ] `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM`, `RESEND_WEBHOOK_SECRET` set
- [ ] `CRON_SECRET` set — **without it, retries never run**
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live origin
- [ ] **A real end-to-end enquiry traced from the form to the `info@` inbox**
- [ ] QR codes generated and physically tested on a phone, on mobile data:
      - `/care-show/leadership?utm_source=care_show&utm_medium=qr&utm_campaign=q4_2026`
      - `/care-show/ai-automation?utm_source=care_show&utm_medium=qr&utm_campaign=q4_2026`
      - `/care-show` if a single combined code is preferred
- [ ] Confirm the lead row records the UTM attribution after a QR scan

## Content sign-off (see `claims-register.md`)

- [ ] Funding figures and percentages confirmed
- [ ] Qualification titles and CMgr post-nominal wording confirmed
- [ ] DSIT statistic: supply the source, or leave it switched off
- [ ] Privacy notice approved; retention period supplied
- [ ] Company registration number, registered address, ICO number added
- [ ] PECR decision: is the mobile number used for marketing, or enquiry only?
- [ ] Confirmed there is no testimonials section anywhere (there is not)
- [ ] Corporate statement reproduced verbatim in the footer

## Verified in this build

- [x] 119 automated tests passing (13 unit/integration, 106 end-to-end)
- [x] No horizontal scroll on any route at 320/390/430/768/1024/1280/1536px
- [x] Form controls ≥44px tall with 16px text (no iOS zoom-on-focus)
- [x] Lead + consents + outbox event commit in one transaction
- [x] A repeated enquiry creates one lead and one notification
- [x] Honeypot and sub-2-second submissions rejected, nothing stored
- [x] Email outage: lead survives, retry scheduled, bounded, then dead-lettered
- [x] Invalid input returns field errors and preserves what was typed
- [x] Mobile numbers normalised to E.164 from any common format
- [x] WCAG AA text contrast audited programmatically — every rendered text node
      measured against its true background
- [x] axe WCAG 2.2 A/AA sweep clean on all 11 routes, both engines
- [x] Enquiry form fully operable by keyboard; one h1 and a skip link per page
- [x] **No-JavaScript submission verified** — persists, normalises, dedupes and
      shows validation errors with JS disabled
- [x] Open Graph share image renders
- [x] In-page links glide to their section and clear the sticky header
- [x] No reveal animation can leave on-screen content invisible — asserted in both
      motion branches and under print emulation
- [x] Photography licensed CC0 with provenance recorded
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm build` all clean

## Not yet done

- [ ] Lighthouse against the **deployed** URL (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1).
      Cannot be measured meaningfully on localhost.
- [ ] A manual screen-reader pass (VoiceOver/NVDA). Automated axe is clean, but
      axe cannot judge whether the reading order makes sense to a person.
- [ ] Sentry or equivalent error alerting — needs a DSN. Structured JSON logs
      with redaction are already in place (`src/lib/logger.ts`).
- [ ] Re-run the whole suite against the production domain once DNS is live.
- [ ] Replace the CC0 placeholder photography with commissioned images of real
      partner settings — see `docs/image-credits.md`.
