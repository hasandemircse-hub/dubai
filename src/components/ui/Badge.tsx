import { ReactNode } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "default" | "amber" | "warning" | "danger" | "success" | "green" | "muted";

const toneStyles: Record<Tone, string> = {
  default: "bg-bg-warm text-text-main",
  amber: "bg-badge-amber text-badge-amber-text",
  warning: "bg-state-warning text-state-warning-text",
  danger: "bg-state-danger text-state-danger-text",
  success: "bg-state-success text-state-success-text",
  green: "bg-brand-green-soft text-brand-green-dark",
  muted: "bg-surface text-text-muted ring-1 ring-border-soft",
};

type Props = {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
};

export function Badge({ children, tone = "default", icon, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
        toneStyles[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <Badge tone="amber" icon={<Sparkles className="h-3 w-3" />}>
      Öne Çıkan
    </Badge>
  );
}

export function TrustBadge() {
  return (
    <Badge tone="green" icon={<ShieldCheck className="h-3 w-3" />}>
      Onaylı
    </Badge>
  );
}

export function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved") return <Badge tone="success">Yayında</Badge>;
  if (status === "pending") return <Badge tone="warning">Bekliyor</Badge>;
  return <Badge tone="danger">Reddedildi</Badge>;
}
