import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** "wide" for full editorial measure, "text" for readable prose columns. */
  width?: "wide" | "text";
}

/** The single owner of horizontal gutters. Keeping this in one place is what
 *  guarantees a >=24px side gutter at every breakpoint, including 390px. */
export function Container({ children, className = "", width = "wide" }: ContainerProps) {
  const measure = width === "text" ? "max-w-[46rem]" : "max-w-[78rem]";
  return (
    <div className={`mx-auto w-full ${measure} px-6 md:px-10 lg:px-14 ${className}`}>
      {children}
    </div>
  );
}
