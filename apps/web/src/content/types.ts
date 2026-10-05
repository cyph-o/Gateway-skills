/** Shared shapes for page content modules. Content stays free of React imports:
 *  icons are referenced by name and resolved by components/primitives/Icon.tsx. */

export type IconName =
  | "shield-check"
  | "users"
  | "gauge"
  | "award"
  | "scroll"
  | "badge-check"
  | "workflow"
  | "layout-dashboard"
  | "cpu"
  | "clipboard-list"
  | "building"
  | "heart-handshake"
  | "calendar-clock"
  | "file-stack"
  | "receipt"
  | "user-cog"
  | "trending-up";

export interface SectionHeader {
  /** Letterspaced mono eyebrow, e.g. "SECTION 03". */
  readonly index?: string;
  readonly eyebrow?: string;
  readonly heading: string;
  readonly standfirst?: string;
}

export interface Proposition {
  readonly title: string;
  readonly body: string;
  readonly icon: IconName;
}

export interface QualificationBadge {
  readonly label: string;
  readonly detail?: string;
  readonly icon: IconName;
}

export interface UseCase {
  readonly title: string;
  readonly icon: IconName;
  readonly bottleneck: string;
  readonly application: string;
  readonly impact: string;
}

export interface FundingFigure {
  readonly label: string;
  readonly value: string;
}

export interface FundingRoute {
  readonly label: string;
  readonly headline: string;
  readonly detail: string;
  readonly figures?: readonly FundingFigure[];
}

export interface FlowStep {
  readonly label: string;
  readonly detail: string;
}

export interface RoleItem {
  readonly label: string;
  readonly icon: IconName;
}
