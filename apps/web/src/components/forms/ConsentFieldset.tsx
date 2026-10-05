import Link from "next/link";

/**
 * Responding to a requested funding audit rests on legitimate interest, so it
 * needs no tickbox. Marketing is a separate, unticked, genuinely optional
 * consent — and because we capture a mobile number, the wording names calls
 * and texts explicitly (PECR).
 */
export function ConsentFieldset() {
  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-ink-muted">
        We will use these details to respond to your enquiry and assess your funding
        eligibility. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-emerald">
          privacy notice
        </Link>
        .
      </p>
      <div className="flex gap-3">
        <input
          id="marketingConsent"
          name="marketingConsent"
          type="checkbox"
          value="on"
          className="mt-0.5 h-5 w-5 shrink-0 rounded-sm border-line-strong accent-emerald"
        />
        <label htmlFor="marketingConsent" className="text-xs leading-relaxed text-ink-muted">
          Optional: you may also contact me by email, call or text about other Gateway
          programmes and funding deadlines. You can withdraw this at any time.
        </label>
      </div>
    </div>
  );
}
