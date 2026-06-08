import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge, FeaturedBadge, TrustBadge } from "@/components/ui/Badge";
import { kisalt, whatsappLinki } from "@/lib/format";
import type { Business } from "@/types/database";

type Props = {
  business: Business;
};

export function BusinessCard({ business }: Props) {
  const detay = `/isletmeler/${business.id}`;
  return (
    <article className="overflow-hidden rounded-3xl bg-surface shadow-card">
      <Link href={detay} className="relative block aspect-[16/9] w-full bg-bg-warm">
        {business.cover_image_url ? (
          <Image
            src={business.cover_image_url}
            alt={business.business_name}
            fill
            sizes="(max-width:480px) 100vw, 480px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">
            <span aria-hidden>🏢</span>
          </div>
        )}
        {business.logo_url ? (
          <div className="absolute bottom-3 left-3 h-12 w-12 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
            <Image
              src={business.logo_url}
              alt={`${business.business_name} logosu`}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </Link>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge tone="green">{business.category}</Badge>
          {business.is_featured ? <FeaturedBadge /> : null}
          <TrustBadge />
        </div>
        <Link href={detay}>
          <h3 className="text-[15px] font-bold leading-tight text-text-main line-clamp-1">
            {business.business_name}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted line-clamp-2">
            {kisalt(business.description, 160)}
          </p>
        </Link>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-text-muted">
          {business.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {business.location}
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {business.whatsapp_number ? (
            <a
              href={whatsappLinki(
                business.whatsapp_number,
                `Merhaba, ${business.business_name} hakkında bilgi almak istiyorum.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full bg-brand-green px-3 text-xs font-semibold text-white"
            >
              WhatsApp
            </a>
          ) : null}
          {business.instagram_url ? (
            <a
              href={business.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-full bg-bg-warm px-3 text-xs font-semibold text-text-main"
            >
              Instagram
            </a>
          ) : null}
          {business.tiktok_url ? (
            <a
              href={business.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-full bg-bg-warm px-3 text-xs font-semibold text-text-main"
            >
              TikTok
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
