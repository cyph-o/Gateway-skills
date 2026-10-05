import { z } from "zod";

/**
 * Server-only configuration. Validated lazily on first access so a missing
 * runtime secret never breaks a static build, but a misconfigured deployment
 * fails loudly on the first request rather than silently mis-delivering leads.
 *
 * Nothing here is exported to the client. The notification recipient is fixed
 * in configuration and is never accepted from a request.
 */
const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_WEBHOOK_SECRET: z.string().min(1).optional(),
  LEAD_NOTIFICATION_TO: z.email().default("info@gatewayskillsnetwork.co.uk"),
  LEAD_NOTIFICATION_FROM: z
    .string()
    .min(1)
    .default("Gateway Skills Network <onboarding@resend.dev>"),
  CRON_SECRET: z.string().min(16).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  LEAD_RATE_LIMIT_PER_IP: z.coerce.number().int().positive().default(5),
  LEAD_RATE_LIMIT_GLOBAL: z.coerce.number().int().positive().default(120),
  OUTBOX_MAX_ATTEMPTS: z.coerce.number().int().positive().default(6),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid server environment — ${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** Email is only attempted when a provider key is configured. Without one the
 *  lead still persists and the outbox row waits, rather than being lost. */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export const isProduction = process.env.NODE_ENV === "production";
