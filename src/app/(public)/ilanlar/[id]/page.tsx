import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, ChevronLeft, MapPin } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge, FeaturedBadge, TrustBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/cards/PostCard";
import { TrustCard } from "@/components/ui/TrustCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ReportDialog } from "@/components/ReportDialog";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { kisalt, trGorece, whatsappLinki } from "@/lib/format";
import type { Post } from "@/types/database";

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("posts").select("title,description").eq("id", id).maybeSingle();
  return {
    title: data?.title ?? "İlan",
    description: data?.description ? kisalt(data.description, 140) : "Dubai Türk Rehberi ilan detayı",
  };
}

export default async function IlanDetayPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  const post = data as Post | null;
  if (!post || post.status !== "approved") notFound();

  const user = await getCurrentUser();
  const { data: fav } = user
    ? await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_type", "post")
        .eq("item_id", post.id)
        .maybeSingle()
    : { data: null };

  const { data: similarData } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "approved")
    .eq("category", post.category)
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3);
  const similar = (similarData ?? []) as Post[];

  return (
    <main>
      <PageContainer className="space-y-4">
        <Link href="/ilanlar" className="inline-flex items-center gap-1 text-sm font-medium text-text-muted">
          <ChevronLeft className="h-4 w-4" /> İlanlar
        </Link>

        <article className="overflow-hidden rounded-3xl bg-surface shadow-card">
          {post.image_url ? (
            <div className="relative aspect-[16/10] w-full">
              <Image src={post.image_url} alt={post.title} fill sizes="(max-width:480px) 100vw, 480px" className="object-cover" />
            </div>
          ) : null}
          <div className="p-5">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Badge tone="green">{post.category}</Badge>
              {post.is_featured ? <FeaturedBadge /> : null}
              <TrustBadge />
            </div>
            <h1 className="text-xl font-bold leading-tight text-text-main">{post.title}</h1>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
              {post.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {post.location}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {trGorece(post.created_at)}
              </span>
            </div>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-text-main">
              {post.description}
            </p>
            <p className="mt-4 rounded-2xl bg-brand-green-soft p-3 text-xs text-brand-green-dark">
              Bu ilan topluluk kurallarına göre kontrol edilmiştir.
            </p>
          </div>
        </article>

        <div className="flex flex-wrap items-center gap-2">
          {post.whatsapp_number ? (
            <Button
              asLink
              href={whatsappLinki(post.whatsapp_number, `Merhaba, "${post.title}" ilanı için yazıyorum.`)}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp&apos;tan İletişime Geç
            </Button>
          ) : null}
          <FavoriteButton
            itemType="post"
            itemId={post.id}
            initialSaved={Boolean(fav)}
            loggedIn={Boolean(user)}
          />
          <ReportDialog itemType="post" itemId={post.id} />
        </div>

        <TrustCard
          title="Tanımadığın kişilere ödeme yaparken dikkatli ol."
          description="Şüpheli bir durum görürsen lütfen şikayet et. Topluluğun güvenliği bizim için önemli."
        />

        {similar.length > 0 ? (
          <section>
            <h2 className="mb-3 text-base font-bold text-text-main">Benzer İlanlar</h2>
            <div className="space-y-3">
              {similar.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        ) : null}
      </PageContainer>
    </main>
  );
}
