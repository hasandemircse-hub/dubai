import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "success" | "warning" | "danger" | "info";

const toneStyles: Record<Tone, string> = {
  success: "bg-state-success text-state-success-text",
  warning: "bg-state-warning text-state-warning-text",
  danger: "bg-state-danger text-state-danger-text",
  info: "bg-brand-green-soft text-brand-green-dark",
};

export function InlineAlert({
  tone = "info",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl px-4 py-3 text-sm font-medium", toneStyles[tone], className)}>
      {children}
    </div>
  );
}
