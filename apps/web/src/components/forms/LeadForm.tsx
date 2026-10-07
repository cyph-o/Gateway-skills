"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ATTRIBUTION_KEYS,
  readAttributionFromForm,
  type Attribution,
} from "@/lib/attribution";
import type { CampaignId } from "@/lib/leads/campaigns";
import { leadFormSchema, type LeadFieldErrors } from "@/lib/leads/schema";
import {
  WEB3FORMS_ACCESS_KEY,
  WEB3FORMS_DEFAULT_SUBJECT,
  WEB3FORMS_ENDPOINT,
  WEB3FORMS_FROM_NAME,
  web3formsPayload,
} from "@/lib/leads/web3forms";
import { ConsentFieldset } from "./ConsentFieldset";
import { InterestFieldset } from "./InterestFieldset";
import { SelectField } from "./SelectField";
import { FormField, type FieldSpec } from "./FormField";
import { Honeypot } from "./Honeypot";
import { SubmitButton } from "./SubmitButton";

const FIELDS: readonly FieldSpec[] = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "jobTitle", label: "Job title", autoComplete: "organization-title" },
  {
    name: "companyName",
    label: "Care provider / company name",
    autoComplete: "organization",
  },
  {
    name: "mobileNumber",
    label: "Direct mobile number",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Direct work email",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
  },
] as const;

interface LeadFormProps {
  campaign: CampaignId;
  submitLabel: string;
  attribution?: Attribution;
  /** Absolute URL Web3Forms sends no-JavaScript visitors to after submitting. */
  confirmationUrl: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const SUCCESS_MESSAGE =
  "Thank you. Your enquiry has been submitted successfully. A member of the Gateway " +
  "Skills Network team will be in touch shortly.";

const ERROR_MESSAGE =
  "Something went wrong while submitting your enquiry. Please try again or contact us directly.";

/**
 * Sends enquiries to the Gateway inbox through Web3Forms. With JavaScript,
 * the submit is intercepted, validated against the shared schema (so inline
 * errors read exactly as before) and posted with readable labels, a
 * personalised subject and the visitor as reply-to. Without JavaScript, the
 * form still posts natively to Web3Forms, which redirects to the
 * confirmation page: the realistic case for a QR scan on event wifi.
 */
export function LeadForm({
  campaign,
  submitLabel,
  attribution = {},
  confirmationUrl,
}: LeadFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const bannerRef = useRef<HTMLParagraphElement>(null);

  // Written straight to the DOM: both must be absent from the server render,
  // and writing them causes no extra render.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // Server-rendered without noValidate, so a visitor without JavaScript still
    // gets the browser's required and email checks. Once scripted, the shared
    // schema takes over and shows the inline errors instead.
    form.noValidate = true;

    // Campaign attribution comes from the QR code's query string, read on the
    // client so the landing pages stay statically rendered and CDN-fast.
    const params = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_KEYS) {
      const input = form.elements.namedItem(key) as HTMLInputElement | null;
      const value = params.get(key);
      if (input && value && !input.value) input.value = value;
    }
  }, []);

  // Move focus to the outcome so screen readers and keyboard users hear it.
  useEffect(() => {
    if (status === "success" || status === "error") bannerRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    // A filled honeypot is a bot: show it the success it wants, send nothing.
    const honeypot = formData.get("botcheck");
    if (typeof honeypot === "string" && honeypot.length > 0) {
      form.reset();
      setErrors({});
      setStatus("success");
      return;
    }

    // Object.fromEntries keeps only the LAST value of a repeated key, which
    // would silently drop all but one ticked programme checkbox.
    const raw: Record<string, unknown> = Object.fromEntries(formData);
    raw.interests = formData.getAll("interests");
    const parsed = leadFormSchema.safeParse(raw);

    if (!parsed.success) {
      const next: LeadFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) {
          next[key as keyof LeadFieldErrors] = issue.message;
        }
      }
      setErrors(next);
      setStatus("idle");
      const first = Object.keys(next)[0];
      if (first)
        (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");

    const body = new FormData();
    const payload = web3formsPayload(parsed.data, {
      attribution: readAttributionFromForm(formData),
      pageUrl: window.location.href,
    });
    for (const [key, value] of Object.entries(payload)) body.append(key, value);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      const result: unknown = await response.json().catch(() => null);
      const accepted =
        response.ok &&
        typeof result === "object" &&
        result !== null &&
        (result as { success?: unknown }).success === true;
      if (!accepted) throw new Error("Web3Forms rejected the submission");

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      ref={formRef}
      action={WEB3FORMS_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
      className="relative"
    >
      {/* Read by Web3Forms only on a no-JavaScript post; the scripted path
          builds its own labelled payload. */}
      <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
      <input type="hidden" name="subject" value={WEB3FORMS_DEFAULT_SUBJECT} />
      <input type="hidden" name="from_name" value={WEB3FORMS_FROM_NAME} />
      <input type="hidden" name="redirect" value={confirmationUrl} />
      <input type="hidden" name="campaign" value={campaign} />
      {ATTRIBUTION_KEYS.map((key) => (
        <input
          key={key}
          type="hidden"
          name={key}
          defaultValue={attribution[key] ?? ""}
        />
      ))}
      <Honeypot />

      {status === "success" ? (
        <p
          ref={bannerRef}
          role="status"
          tabIndex={-1}
          className="mb-6 rounded-sm border border-emerald/30 bg-mist px-4 py-3 text-sm text-ink-strong outline-none"
        >
          {SUCCESS_MESSAGE}
        </p>
      ) : null}

      {status === "error" ? (
        <p
          ref={bannerRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 outline-none"
        >
          {ERROR_MESSAGE}
        </p>
      ) : null}

      <div className="space-y-5">
        {FIELDS.map((field) => (
          <FormField
            key={field.name}
            {...field}
            error={errors[field.name as keyof typeof errors]}
          />
        ))}
      </div>

      <div className="mt-5 space-y-5">
        <SelectField
          name="employeeBand"
          label="Total number of UK employees"
          placeholder="Select a range"
          error={errors.employeeBand}
          options={[
            { value: "1-49", label: "1 to 49" },
            { value: "50-249", label: "50 to 249" },
            { value: "250+", label: "250 or more" },
          ]}
        />
        <SelectField
          name="levyPayer"
          label="Does your organisation pay the Apprenticeship Levy?"
          placeholder="Select an answer"
          error={errors.levyPayer}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "unsure", label: "Unsure" },
          ]}
        />
        <InterestFieldset />
      </div>

      <div className="mt-7 space-y-6">
        <ConsentFieldset />
        <SubmitButton label={submitLabel} pending={status === "submitting"} />
      </div>
    </form>
  );
}
