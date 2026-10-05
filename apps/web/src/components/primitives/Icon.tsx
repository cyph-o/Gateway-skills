import {
  Award,
  BadgeCheck,
  Building2,
  CalendarClock,
  ClipboardList,
  Cpu,
  FileStack,
  Gauge,
  HeartHandshake,
  LayoutDashboard,
  ReceiptText,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  UserCog,
  Users,
  Workflow,
} from "lucide-react";
import type { IconName } from "@/content/types";

const registry = {
  "shield-check": ShieldCheck,
  users: Users,
  gauge: Gauge,
  award: Award,
  scroll: ScrollText,
  "badge-check": BadgeCheck,
  workflow: Workflow,
  "layout-dashboard": LayoutDashboard,
  cpu: Cpu,
  "clipboard-list": ClipboardList,
  building: Building2,
  "heart-handshake": HeartHandshake,
  "calendar-clock": CalendarClock,
  "file-stack": FileStack,
  receipt: ReceiptText,
  "user-cog": UserCog,
  "trending-up": TrendingUp,
} as const satisfies Record<IconName, unknown>;

interface IconProps {
  name: IconName;
  className?: string;
  /** Icons here are always decorative; adjacent text carries the meaning. */
  strokeWidth?: number;
}

export function Icon({ name, className, strokeWidth = 1.5 }: IconProps) {
  const Glyph = registry[name];
  return (
    <Glyph className={className} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />
  );
}
