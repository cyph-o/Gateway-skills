"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { readAttributionFromForm } from "@/lib/attribution";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/leads/rate-limit";
import { createLead } from "@/lib/leads/service";
import {
  HONEYPOT_FIELD,
  MAX_FORM_AGE_MS,
  MIN_FILL_MS,
  leadFormSchema,
  type LeadFieldErrors,
} from "@/lib/leads/schema";
import { deriveSubmissionId } from "@/lib/leads/submission-id";
import type { LeadFormState } from "@/lib/leads/form-state";
import { drainOutbox } from "@/lib/outbox/drain";

const ECHO_FIELDS = ["fullName", "companyName", "mobileNumber", "email"] as const;

function echo(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const field of ECHO_FIELDS) {
    const value = formData.get(field);
    if (typeof value === "string") out[field] = value;
  }
  return out;
}

function clientIp(headerList: Headers): string | null {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headerList.get("x-real-ip");
}

/**
 * The single write path for enquiries, invoked by a real `<form action>` so it
 * works with JavaScript disabled or still downloading on event wifi.
 *
 * Order matters: cheap bot checks, then validation, then rate limiting, then a
 * transactional commit. Only after the transaction commits do we acknowledge —
 * and only then do we attempt delivery.
 */
export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const values = echo(formData);

  // 1. Honeypot — invisible to people, irresistible to naive bots.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.length > 0) {
    logger.warn("lead.rejected", { reason: "honeypot" });
    return { status: "error", errors: { form: "Submission rejected." }, values };
  }

  // 2. Timing — a form completed instantly was not typed by a human. The
  //    stamp is set on mount, so it is absent without JavaScript; we skip the
  //    heuristic rather than reject those visitors, who are still covered by
  //    the honeypot and the rate limits.
  const stamp = formData.get("renderedAt");
  if (typeof stamp === "string" && stamp.length > 0) {
    const renderedAt = Number(stamp);
    const age = Date.now() - renderedAt;
    if (!Number.isFinite(renderedAt) || age < MIN_FILL_MS) {
      logger.warn("lead.rejected", { reason: "too_fast", age });
      return { status: "error", errors: { form: "Submission rejected." }, values };
    }
    if (age > MAX_FORM_AGE_MS) {
      return {
        status: "error",
        errors: { form: "This form has expired. Please reload the page and try again." },
        values,
      };
    }
  }

  // 3. Validation.
  const parsed = leadFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: LeadFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in errors)) {
        errors[key as keyof LeadFieldErrors] = issue.message;
      }
    }
    return { status: "error", errors, values };
  }

  const database = db();
  let reference: string;

  try {
    // 4. Abuse controls, after validation so bad payloads cost nothing.
    const limit = await checkRateLimit(database, clientIp(await headers()));
    if (!limit.allowed) {
      logger.warn("lead.rate_limited", { scope: limit.scope });
      return {
        status: "error",
        errors: { form: "Too many submissions from this connection. Please try again shortly." },
        values,
      };
    }

    // 5. Resolve the idempotency key, then commit the lead, its consents and
    //    its outbox event together.
    const submissionId = deriveSubmissionId({
      campaign: parsed.data.campaign,
      email: parsed.data.email,
      mobileNumber: parsed.data.mobileNumber,
    });

    const result = await createLead(parsed.data, {
      attribution: readAttributionFromForm(formData),
      submissionId,
    });
    reference = result.reference;
    logger.info("lead.accepted", {
      reference,
      campaign: parsed.data.campaign,
      duplicate: result.duplicate,
    });
  } catch (cause) {
    logger.error("lead.persist_failed", {
      error: cause instanceof Error ? cause.message : "unknown",
    });
    return {
      status: "error",
      errors: {
        form:
          "We could not record your enquiry just now. Please try again, or email " +
          "info@gatewayskillsnetwork.co.uk and we will pick it up directly.",
      },
      values,
    };
  }

  // 6. Attempt delivery after the response is sent. This is an optimisation,
  //    not a guarantee: the scheduled drain is what ensures delivery.
  after(async () => {
    try {
      await drainOutbox(5);
    } catch (cause) {
      logger.error("outbox.after_failed", {
        error: cause instanceof Error ? cause.message : "unknown",
      });
    }
  });

  // redirect() throws by design — must stay outside the try block above.
  redirect(`/enquiry-received?ref=${encodeURIComponent(reference)}`);
}
