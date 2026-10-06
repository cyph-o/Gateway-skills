import { PROGRAMME_INTERESTS } from "@/lib/leads/schema";

/** Programme interest checkboxes. Optional by design: an enquiry should never
 *  be blocked because someone is not yet sure which route they need. */
export function InterestFieldset() {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-ink-strong">
        Which programmes are you interested in?
      </legend>
      <div className="mt-3 space-y-3">
        {Object.entries(PROGRAMME_INTERESTS).map(([value, label]) => (
          <div key={value} className="flex gap-3">
            <input
              id={`interest-${value}`}
              name="interests"
              type="checkbox"
              value={value}
              className="mt-0.5 h-5 w-5 shrink-0 rounded-sm border-line-strong accent-emerald"
            />
            <label htmlFor={`interest-${value}`} className="text-sm leading-snug text-ink">
              {label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
