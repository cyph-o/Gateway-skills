# Gateway Skills Network

Corporate website and Care Show landing pages for Gateway Skills Network Ltd —
connecting UK employers to funded higher-level qualifications across leadership,
service transformation, and AI & automation.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Drizzle ORM · Postgres ·
Resend · Vercel Cron. One application; no separate API service.

## Getting started

```bash
pnpm install
createdb gateway_skills_dev          # or point DATABASE_URL at Neon
cp .env.example apps/web/.env.local  # then fill in DATABASE_URL
pnpm db:migrate
pnpm dev                             # http://localhost:4321
```

Email is optional locally: without `RESEND_API_KEY`, enquiries still persist and
their outbox rows simply wait.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on **port 4321** (pinned to avoid clashing with other local projects) |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript |
| `pnpm test` | Unit and integration tests (needs the database) |
| `pnpm test:e2e` | Playwright: 80 tests, mobile (WebKit) + desktop. Needs the server running |
| `pnpm db:generate` / `pnpm db:migrate` | Create / apply migrations |

## How lead capture works

A real `<form action>` posts to a Server Action, so it submits even if
JavaScript never loads — the realistic case for a QR scan on event wifi.

The action validates, applies the anti-bot and rate-limit checks, then commits
the lead, its consent records and a notification outbox event **in one
transaction**. Only then is the visitor sent to a confirmation page with a
reference. Delivery is attempted immediately via `after()`, and a Vercel Cron
route drains and retries the outbox every five minutes — that cron, not the
request, is the actual delivery guarantee.

Consequences worth knowing:

- An email outage never loses an enquiry.
- A repeated enquiry produces one lead and one email: the idempotency key is
  derived from the enquiry's own content within a 10-minute window, so it works
  identically with or without JavaScript.
- The notification recipient is fixed in server configuration and is never read
  from a request.

## Documentation

- [`docs/deployment.md`](docs/deployment.md) — provisioning and environment
- [`docs/launch-checklist.md`](docs/launch-checklist.md) — go-live gate
- [`docs/claims-register.md`](docs/claims-register.md) — regulated marketing
  claims and their sign-off status

## Testing

119 automated tests. The e2e suite runs against a running server on port 4321
(`pnpm build && pnpm start` in another terminal), and covers:

- **Lead capture** — transactional persistence, idempotency, validation, honeypot and timing rejection
- **No JavaScript** — the form still submits, dedupes and shows errors with JS disabled
- **Responsive** — no horizontal scroll on any route at seven widths, 320px to 1536px
- **Contrast** — every rendered text node measured against its true background for WCAG AA
- **Accessibility** — axe WCAG 2.2 A/AA sweep on all 11 routes, keyboard operability, heading structure
- **Outbox durability** — an email outage keeps the lead, schedules a bounded retry, then dead-letters
- **Motion** — smooth anchor scrolling, reduced-motion respected, and the guarantee that no
  reveal animation can ever leave on-screen content invisible (including when printing)

## Motion and imagery

Scroll reveals are **pure CSS** (`animation-timeline: view()`), so the page ships no animation
runtime — it would be a poor trade to send ~30KB of JavaScript to fade headings in on a page
reached by QR code over event wifi. Two gates guard it: `prefers-reduced-motion` and an
`@supports` check that includes `animation-range`, because browsers with partial support would
otherwise apply the `backwards` fill and leave content stuck at opacity 0. Unsupported browsers
render everything immediately.

Photography is CC0, colour-graded to one treatment, and served as authored — see
[`docs/image-credits.md`](docs/image-credits.md).

## Conventions

All copy lives in typed modules under `src/content/` — never inline in JSX — so
it can be changed without touching components. One section component per file;
page files stay short compositions. Files are kept under 200 lines.
