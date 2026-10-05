import type { HTMLInputTypeAttribute } from "react";

export interface FieldSpec {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email";
  /** Shown beneath the label, before any error. */
  hint?: string;
}

interface FormFieldProps extends FieldSpec {
  defaultValue?: string;
  error?: string;
}

export function FormField({
  name,
  label,
  type = "text",
  autoComplete,
  inputMode,
  hint,
  defaultValue,
  error,
}: FormFieldProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-strong">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={`mt-2 block min-h-12 w-full rounded-sm border bg-surface px-3.5 text-base text-ink-strong transition-colors placeholder:text-ink-muted/60 ${
          error ? "border-red-700" : "border-line-strong focus:border-emerald"
        }`}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
