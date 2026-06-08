import { MapPin } from "lucide-react";
import { Badge, TrustBadge } from "@/components/ui/Badge";
import { kisalt, whatsappLinki } from "@/lib/format";
import type { Recommendation } from "@/types/database";

type Props = {
  rec: Recommendation;
};

export function RecommendationCard({ rec }: Props) {
  return (
    <article className="rounded-3xl bg-surface p-4 shadow-card">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {rec.category ? <Badge tone="green">{rec.category}</Badge> : null}
        <TrustBadge />
      </div>
      <h3 className="text-[15px] font-bold leading-tight text-text-main line-clamp-2">{rec.title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{kisalt(rec.description, 220)}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-text-muted">
        {rec.location ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {rec.location}
          </span>
        ) : (
          <span />
        )}
        {rec.show_name && rec.display_name ? <span>Öneren: {rec.display_name}</span> : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {rec.whatsapp_number ? (
          <a
            href={whatsappLinki(rec.whatsapp_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center rounded-full bg-brand-green px-3 text-xs font-semibold text-white"
          >
            WhatsApp
          </a>
        ) : null}
        {rec.instagram_url ? (
          <a
            href={rec.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center rounded-full bg-bg-warm px-3 text-xs font-semibold text-text-main"
          >
            Instagram
          </a>
        ) : null}
      </div>
    </article>
  );
}
