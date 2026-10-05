import { HONEYPOT_FIELD } from "@/lib/leads/schema";

/**
 * Off-screen decoy. Hidden from sight and from assistive technology, but
 * present in the DOM, so a bot that fills every input identifies itself.
 * Deliberately not `display:none` — some bots skip those.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor={HONEYPOT_FIELD}>Company website</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
