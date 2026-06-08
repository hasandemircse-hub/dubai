import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { Badge, FeaturedBadge } from "@/components/ui/Badge";
import { kisalt, trGorece } from "@/lib/format";
import type { CommunityTopic } from "@/types/database";

type Props = {
  topic: CommunityTopic;
  compact?: boolean;
};

export function TopicCard({ topic, compact }: Props) {
  const href = `/topluluk/${topic.id}`;
  return (
    <Link
      href={href}
      className={`block rounded-3xl bg-surface p-4 shadow-card transition active:scale-[0.98] ${compact ? "min-w-[260px]" : ""}`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <Badge tone="green">{topic.category}</Badge>
        {topic.is_featured ? <FeaturedBadge /> : null}
      </div>
      <h3 className="text-[15px] font-bold leading-tight text-text-main line-clamp-2">
        {topic.title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted line-clamp-2">
        {kisalt(topic.description, 140)}
      </p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-2">
          {topic.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {topic.location}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3 w-3" /> {topic.reply_count} cevap
          </span>
        </span>
        <span>{trGorece(topic.last_activity_at)}</span>
      </div>
      <div className="mt-3">
        <span className="inline-flex h-9 items-center justify-center rounded-full bg-brand-green-soft px-3 text-xs font-semibold text-brand-green-dark">
          Sohbete Katıl
        </span>
      </div>
    </Link>
  );
}
