"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitLead } from "@/actions/submit-lead";
import { ATTRIBUTION_KEYS, type Attribution } from "@/lib/attribution";
import { initialLeadFormState } from "@/lib/leads/form-state";
import type { CampaignId } from "@/lib/leads/campaigns";
import { ConsentFieldset } from "./ConsentFieldset";
import { FormField, type FieldSpec } from "./FormField";
import { Honeypot } from "./Honeypot";
import { SubmitButton } from "./SubmitButton";

const FIELDS: readonly FieldSpec[] = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "companyName", label: "Company / care group name", autoComplete: "organization" },
  {
    name: "mobileNumber",
    label: "Direct mobile number",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Corporate email address",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
  },
] as const;

interface LeadFormProps {
  campaign: CampaignId;
  submitLabel: string;
  attribution?: Attribution;
}

/**
 * Posts through a real `<form action>`, so it submits even with JavaScript
 * disabled or still downloading — the realistic case for a QR scan on event
 * wifi. JavaScript only adds pending state, inline errors, the anti-bot timing
 * stamp and campaign attribution.
 */
export function LeadForm({ campaign, submitLabel, attribution = {} }: LeadFormProps) {
  const [state, formAction] = useActionState(submitLead, initialLeadFormState);
  const formRef = useRef<HTMLFormElement>(null);

  // Written straight to the DOM rather than through state: these are
  // client-only values that must be absent from the server render (or
  // hydration would mismatch), and writing them causes no extra render.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | null;

    const stamp = field("renderedAt");
    if (stamp) stamp.value = String(Date.now());

    // Campaign attribution comes from the QR code's query string, read on the
    // client so the landing pages stay statically rendered and CDN-fast. It is
    // untrusted either way — hidden inputs are editable — so the Server Action
    // re-validates and allowlists every key before storing it.
    const params = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_KEYS) {
      const input = field(key);
      const value = params.get(key);
      if (input && value && !input.value) input.value = value;
    }
  }, []);

  const errors = state.errors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="relative">
      <input type="hidden" name="campaign" value={campaign} />
      <input type="hidden" name="renderedAt" defaultValue="" />
      {ATTRIBUTION_KEYS.map((key) => (
        <input key={key} type="hidden" name={key} defaultValue={attribution[key] ?? ""} />
      ))}
      <Honeypot />

      {errors.form ? (
        <p
          role="alert"
          className="mb-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="space-y-5">
        {FIELDS.map((field) => (
          <FormField
            key={field.name}
            {...field}
            defaultValue={state.values?.[field.name]}
            error={errors[field.name as keyof typeof errors]}
          />
        ))}
      </div>

      <div className="mt-7 space-y-6">
        <ConsentFieldset />
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
