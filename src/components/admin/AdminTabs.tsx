import Link from "next/link";
import { cn } from "@/lib/cn";

type Tab = { label: string; href: string; count?: number };

type Props = {
  tabs: Tab[];
  active: string;
};

export function AdminTabs({ tabs, active }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto scrollbar-none">
      <div className="flex gap-2 px-4">
        {tabs.map((t) => {
          const isActive = t.href === active;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
                isActive ? "bg-brand-green text-white" : "bg-surface text-text-main shadow-card",
              )}
            >
              {t.label}
              {typeof t.count === "number" ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    isActive ? "bg-white/20 text-white" : "bg-bg-warm text-text-muted",
                  )}
                >
                  {t.count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
