import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function SectionHeader({ title, subtitle, actionLabel, actionHref }: Props) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-text-main">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm leading-snug text-text-muted">{subtitle}</p>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-brand-green-dark"
        >
          {actionLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
