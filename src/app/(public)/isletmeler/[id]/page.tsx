import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ChevronLeft, MapPin } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge, FeaturedBadge, TrustBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ReportDialog } from "@/components/ReportDialog";
import { TrustCard } from "@/components/ui/TrustCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { kisalt, whatsappLinki } from "@/lib/format";
import type { Business } from "@/types/database";

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("businesses")
    .select("business_name,description")
    .eq("id", id)
    .maybeSingle();
  return {
    title: data?.business_name ?? "İşletme",
    description: data?.description ? kisalt(data.description, 140) : "İşletme detayı",
  };
}

export default async function IsletmeDetayPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("businesses").select("*").eq("id", id).maybeSingle();
  const biz = data as Business | null;
  if (!biz || biz.status !== "approved") notFound();

  const user = await getCurrentUser();
  const { data: fav } = user
    ? await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_type", "business")
        .eq("item_id", biz.id)
        .maybeSingle()
    : { data: null };

  return (
    <main>
      <PageContainer className="space-y-4">
        <Link href="/isletmeler" className="inline-flex items-center gap-1 text-sm text-text-muted">
          <ChevronLeft className="h-4 w-4" /> İşletmeler
        </Link>
        <article className="overflow-hidden rounded-3xl bg-surface shadow-card">
          <div className="relative aspect-[16/9] w-full bg-bg-warm">
            {biz.cover_image_url ? (
              <Image src={biz.cover_image_url} alt={biz.business_name} fill sizes="(max-width:480px) 100vw, 480px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl">🏢</div>
            )}
            {biz.logo_url ? (
              <div className="absolute -bottom-6 left-4 h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-white shadow">
                <Image src={biz.logo_url} alt={`${biz.business_name} logosu`} width={64} height={64} className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>
          <div className="p-5 pt-8">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <Badge tone="green">{biz.category}</Badge>
              {biz.is_featured ? <FeaturedBadge /> : null}
              <TrustBadge />
            </div>
            <h1 className="text-xl font-bold text-text-main">{biz.business_name}</h1>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-text-muted">
              {biz.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {biz.location}
                </span>
              ) : null}
              {biz.owner_name ? <span>İşletme sahibi: {biz.owner_name}</span> : null}
            </div>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-text-main">
              {biz.description}
            </p>
          </div>
        </article>
        <div className="flex flex-wrap items-center gap-2">
          {biz.whatsapp_number ? (
            <Button
              asLink
              href={whatsappLinki(biz.whatsapp_number, `Merhaba, ${biz.business_name} için yazıyorum.`)}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp&apos;tan İletişime Geç
            </Button>
          ) : null}
          {biz.instagram_url ? (
            <a
              href={biz.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-surface px-4 text-sm font-semibold text-text-main shadow-card"
            >
              Instagram
            </a>
          ) : null}
          {biz.tiktok_url ? (
            <a
              href={biz.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-surface px-4 text-sm font-semibold text-text-main shadow-card"
            >
              TikTok
            </a>
          ) : null}
          <FavoriteButton itemType="business" itemId={biz.id} initialSaved={Boolean(fav)} loggedIn={Boolean(user)} />
          <ReportDialog itemType="business" itemId={biz.id} />
        </div>
        <TrustCard />
      </PageContainer>
    </main>
  );
}
