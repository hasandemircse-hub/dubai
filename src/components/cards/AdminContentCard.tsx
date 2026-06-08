import { ReactNode } from "react";
import { Badge, FeaturedBadge, StatusBadge } from "@/components/ui/Badge";
import { kisalt, trGorece } from "@/lib/format";
import type { ContentStatus } from "@/types/database";

type Props = {
  title: string;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  status: ContentStatus;
  isFeatured?: boolean;
  createdAt: string;
  meta?: ReactNode;
  actions: ReactNode;
};

export function AdminContentCard({
  title,
  description,
  category,
  location,
  status,
  isFeatured,
  createdAt,
  meta,
  actions,
}: Props) {
  return (
    <article className="rounded-3xl bg-surface p-4 shadow-card">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {category ? <Badge tone="green">{category}</Badge> : null}
        <StatusBadge status={status} />
        {isFeatured ? <FeaturedBadge /> : null}
      </div>
      <h3 className="text-[15px] font-bold leading-tight text-text-main">{title}</h3>
      {description ? (
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
          {kisalt(description, 220)}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
        {location ? <span>{location}</span> : null}
        <span>{trGorece(createdAt)}</span>
        {meta}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">{actions}</div>
    </article>
  );
}
