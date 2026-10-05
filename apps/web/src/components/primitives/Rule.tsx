/** Hairline divider. Structure in this design comes from rules, not shadows. */
export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-line ${className}`} />;
}
