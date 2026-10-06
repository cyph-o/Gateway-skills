interface EyebrowProps {
  children: string;
  className?: string;
}

/** Letterspaced mono label — the data register of the design system. */
export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return <p className={`label-mono text-emerald ${className}`}>{children}</p>;
}
