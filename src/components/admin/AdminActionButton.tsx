"use client";

import { ReactNode, useTransition } from "react";
import { cn } from "@/lib/cn";

type Tone = "primary" | "secondary" | "danger" | "outline" | "warning";

const toneStyles: Record<Tone, string> = {
  primary: "bg-brand-green text-white",
  secondary: "bg-brand-green-soft text-brand-green-dark",
  danger: "bg-state-danger text-state-danger-text",
  outline: "bg-surface text-text-main ring-1 ring-border-soft",
  warning: "bg-state-warning text-state-warning-text",
};

type Props = {
  action: () => Promise<void>;
  tone?: Tone;
  confirm?: string;
  children: ReactNode;
  className?: string;
};

export function AdminActionButton({ action, tone = "primary", confirm, children, className }: Props) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-semibold transition disabled:opacity-60",
        toneStyles[tone],
        className,
      )}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        startTransition(() => action());
      }}
    >
      {pending ? "..." : children}
    </button>
  );
}
