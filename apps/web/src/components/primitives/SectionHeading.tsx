import type { ReactNode } from "react";
import type { SectionHeader } from "@/content/types";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps extends SectionHeader {
  /** h1 only for the single page-level heading; h2 everywhere else. */
  as?: "h1" | "h2";
  size?: "md" | "lg" | "xl";
  align?: "left" | "center";
  children?: ReactNode;
}

const sizes = {
  md: "text-display-sm",
  lg: "text-display-md",
  xl: "text-display-lg",
} as const;

export function SectionHeading({
  index,
  eyebrow,
  heading,
  standfirst,
  as: Tag = "h2",
  size = "lg",
  align = "left",
  children,
}: SectionHeadingProps) {
  const label = index ?? eyebrow;
  return (
    <div className={`reveal ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      {label ? <Eyebrow rule={align === "left"}>{label}</Eyebrow> : null}
      <Tag className={`${sizes[size]} ${label ? "mt-5" : ""}`}>{heading}</Tag>
      {standfirst ? (
        <p className="mt-5 text-lg leading-relaxed text-ink-muted md:text-xl">{standfirst}</p>
      ) : null}
      {children}
    </div>
  );
}
