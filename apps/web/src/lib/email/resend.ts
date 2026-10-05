import { Resend } from "resend";
import { isEmailConfigured, serverEnv } from "@/lib/env";
import {
  leadNotificationHtml,
  leadNotificationSubject,
  leadNotificationText,
  type LeadNotificationData,
} from "./templates/lead-notification";

export interface SendResult {
  ok: boolean;
  providerMessageId?: string;
  /** False only when retrying could never succeed. */
  retryable: boolean;
  error?: string;
}

/**
 * Provider error names that will never succeed on retry. Everything else —
 * including a missing or wrong API key — stays retryable, so the backlog
 * flushes automatically once configuration is corrected rather than needing a
 * manual replay.
 */
const PERMANENT = new Set([
  "validation_error",
  "invalid_from_address",
  "invalid_parameter",
  "missing_required_field",
  "invalid_attachment",
  "invalid_idempotency_key",
  "invalid_idempotent_request",
  "not_found",
  "method_not_allowed",
]);

export async function sendLeadNotification(
  data: LeadNotificationData,
  idempotencyKey: string,
): Promise<SendResult> {
  if (!isEmailConfigured()) {
    return { ok: false, retryable: true, error: "RESEND_API_KEY not configured" };
  }

  const env = serverEnv();
  const client = new Resend(env.RESEND_API_KEY);

  try {
    const { data: sent, error } = await client.emails.send(
      {
        from: env.LEAD_NOTIFICATION_FROM,
        to: [env.LEAD_NOTIFICATION_TO],
        replyTo: data.email,
        subject: leadNotificationSubject(data),
        html: leadNotificationHtml(data),
        text: leadNotificationText(data),
      },
      { idempotencyKey },
    );

    if (error) {
      return {
        ok: false,
        retryable: !PERMANENT.has(error.name),
        error: `${error.name}: ${error.message}`,
      };
    }
    return { ok: true, providerMessageId: sent?.id, retryable: false };
  } catch (cause) {
    // Network-level failure: outcome unknown, so retry with the same key.
    return {
      ok: false,
      retryable: true,
      error: cause instanceof Error ? cause.message : "Unknown transport error",
    };
  }
}
