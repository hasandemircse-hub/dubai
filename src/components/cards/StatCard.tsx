import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  tone?: "default" | "warning" | "danger";
  icon?: ReactNode;
};

export function StatCard({ label, value, hint, href, tone = "default", icon }: Props) {
  const toneCls =
    tone === "warning"
      ? "border-state-warning"
      : tone === "danger"
        ? "border-state-danger"
        : "border-border-soft";
  const inner = (
    <div className={`rounded-3xl border ${toneCls} bg-surface p-4 shadow-card`}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[12px] font-medium text-text-muted">{label}</span>
        {icon ? <span className="text-text-muted">{icon}</span> : null}
      </div>
      <p className="text-2xl font-bold text-text-main">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-text-muted">{hint}</p> : null}
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block transition active:scale-[0.98]">
        {inner}
      </Link>
    );
  }
  return inner;
}
