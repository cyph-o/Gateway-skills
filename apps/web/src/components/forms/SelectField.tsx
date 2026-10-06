export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: readonly SelectOption[];
  placeholder: string;
  defaultValue?: string;
  error?: string;
}

export function SelectField({
  name,
  label,
  options,
  placeholder,
  defaultValue,
  error,
}: SelectFieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-strong">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 block min-h-12 w-full rounded-sm border bg-surface px-3 text-base text-ink-strong ${
          error ? "border-red-700" : "border-line-strong focus:border-emerald"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
