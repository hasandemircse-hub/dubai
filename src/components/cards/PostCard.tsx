import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { Badge, FeaturedBadge, TrustBadge } from "@/components/ui/Badge";
import { kisalt, trGorece, whatsappLinki } from "@/lib/format";
import type { Post } from "@/types/database";

type Props = {
  post: Post;
  href?: string;
};

export function PostCard({ post, href }: Props) {
  const detayHref = href ?? `/ilanlar/${post.id}`;
  return (
    <article className="overflow-hidden rounded-3xl bg-surface shadow-card">
      {post.image_url ? (
        <Link href={detayHref} className="relative block aspect-[16/10] w-full">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(max-width:480px) 100vw, 480px"
            className="object-cover"
          />
        </Link>
      ) : null}
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge tone="green">{post.category}</Badge>
          {post.is_featured ? <FeaturedBadge /> : null}
          <TrustBadge />
        </div>
        <Link href={detayHref} className="block">
          <h3 className="text-[15px] font-bold leading-tight text-text-main line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted line-clamp-2">
            {kisalt(post.description, 160)}
          </p>
        </Link>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-text-muted">
          {post.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {post.location}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {trGorece(post.created_at)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {post.whatsapp_number ? (
            <a
              href={whatsappLinki(
                post.whatsapp_number,
                `Merhaba, "${post.title}" ilanı için yazıyorum.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-brand-green px-3 text-sm font-semibold text-white active:scale-[0.98]"
            >
              WhatsApp&apos;tan İletişime Geç
            </a>
          ) : (
            <Link
              href={detayHref}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-bg-warm px-3 text-sm font-semibold text-text-main"
            >
              Detayları Gör
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
