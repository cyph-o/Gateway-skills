# Deployment

Three services: **Neon** (Postgres), **Resend** (email), **Vercel** (hosting + cron).

## 0. Lead storage — pick a driver first

`LEAD_STORAGE` selects where enquiries are written:

| Value | Use |
| --- | --- |
| `json` (default) | Local development, or one long-lived server with a persistent disk. |
| `postgres` | **Production on Vercel.** Requires `DATABASE_URL`. |

> **Set `LEAD_STORAGE="postgres"` before taking enquiries on Vercel.** Serverless
> filesystems are ephemeral and not shared between invocations, so leads written
> by the JSON driver are lost — silently, and exactly the data the site exists to
> collect. `/api/health` reports the active driver and returns a `critical`
> durability severity when it detects the JSON driver on a serverless host.

Both drivers implement the same contract (`src/lib/storage/types.ts`) and the
same guarantees: the lead, its consent pair and its outbox entry are written
together, and a repeated submission id yields one lead and one notification.

## 1. Database — Neon

1. Create a project; copy the **pooled** connection string.
2. Set `DATABASE_URL` in Vercel (all environments).
3. Apply the schema: `DATABASE_URL="<neon url>" pnpm db:migrate`

Migrations are additive only, so they can be applied before the deploy that uses
them without breaking the running version.

## 2. Email — Resend

1. Add and verify `gatewayskillsnetwork.co.uk` (SPF, DKIM, DMARC records).
   **Until DNS is verified, notification email will land in spam or nowhere.**
2. Create an API key → `RESEND_API_KEY`.
3. Set `LEAD_NOTIFICATION_FROM` to a verified sender on that domain, e.g.
   `Gateway Skills Network <notifications@gatewayskillsnetwork.co.uk>`.
   Interim: leave the default Resend onboarding sender and cut over later — no
   code change needed.
4. `LEAD_NOTIFICATION_TO` is fixed at `info@gatewayskillsnetwork.co.uk`. It is
   never taken from a request.
5. Add a webhook → `https://<domain>/api/webhooks/resend`, events
   `email.sent`, `email.delivered`, `email.bounced`, `email.complained`,
   `email.failed`. Copy the signing secret → `RESEND_WEBHOOK_SECRET`.

## 3. Admin dashboard — /admin

The dashboard lists captured enquiries and opens each one by reference. It is
closed unless both variables are set; with either missing the sign-in page says
it is unconfigured rather than admitting anyone.

1. Generate a password hash — the password itself is never stored:
   ```
   node apps/web/scripts/hash-password.mjs
   ```
   Paste the output into `ADMIN_PASSWORD_HASH` (minimum 12 characters enforced).
2. `openssl rand -hex 32` → `ADMIN_SESSION_SECRET`. Rotating it signs every
   existing session out, which is how access is revoked.
3. `/admin` is `noindex`, excluded in `robots.txt`, and guarded both in
   `src/proxy.ts` and again server-side in each page.

Sign-in is rate limited on `ADMIN_RATE_LIMIT_PER_IP` / `ADMIN_RATE_LIMIT_GLOBAL`,
which are deliberately separate counters from the public form's — a burst of
enquiries, or someone flooding the form, must never lock the team out of /admin.

## 4. Hosting — Vercel

- Root directory: `apps/web`. Build and install commands are detected.
- `vercel.json` registers the cron: `/api/cron/drain-outbox` every 5 minutes.
- Generate a cron secret: `openssl rand -hex 24` → `CRON_SECRET`.
- Set `NEXT_PUBLIC_SITE_URL` to the live origin once DNS points at Vercel.
- Enable Web Analytics (cookieless; no consent banner is required).

## Local ports

The app is pinned to **port 4321** (`next dev --port 4321` / `next start --port
4321`) so it never collides with other projects on this machine. Playwright
defaults to the same port; override with `E2E_BASE_URL` to test a deployed URL.

## Environment variables

See `.env.example`. Required in production: `LEAD_STORAGE="postgres"`,
`DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`,
`LEAD_NOTIFICATION_FROM`, `LEAD_NOTIFICATION_TO`, `RESEND_WEBHOOK_SECRET`,
`CRON_SECRET`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`.

## Degraded behaviour, by design

| If this is missing or down | What happens |
| --- | --- |
| `RESEND_API_KEY` | Leads still persist. Outbox rows retry; nothing is lost. Delivery resumes automatically once a key is set. |
| Resend is down | Same: bounded retries with jittered backoff, then dead-letter + an error log. |
| `CRON_SECRET` | The drain route returns 503 and logs `cron.misconfigured`. **Set this** — without it the retry guarantee is inert. |
| `RESEND_WEBHOOK_SECRET` | The webhook returns 503. Delivery still works; only provider-side status reconciliation is lost. |
| `LEAD_STORAGE=json` on Vercel | **Enquiries are lost.** `/api/health` returns a `critical` severity and the server logs it on boot. This is a misconfiguration, not a degraded mode. |
| `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET` | `/admin` cannot be opened by anyone; the sign-in page reports it is unconfigured. Lead capture is unaffected. |
| Database down | The visitor sees a retryable error and is given the email address. No false confirmation is ever shown. |

## Flushing a backlog manually

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/cron/drain-outbox
```

Safe to run at any time — concurrent drains claim rows with
`FOR UPDATE SKIP LOCKED` and can never double-send.
