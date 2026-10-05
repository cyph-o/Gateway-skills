interface EyebrowProps {
  children: string;
  /** Renders the leading hairline tick. Off for inline/compact use. */
  rule?: boolean;
  className?: string;
}

/** Letterspaced mono label — the data register of the design system. */
export function Eyebrow({ children, rule = true, className = "" }: EyebrowProps) {
  return (
    <p className={`label-mono flex items-center gap-3 text-emerald ${className}`}>
      {rule ? <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" /> : null}
      <span>{children}</span>
    </p>
  );
}
