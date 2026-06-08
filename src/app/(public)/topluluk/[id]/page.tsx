import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ChevronLeft, MapPin, MessageCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge, FeaturedBadge, TrustBadge } from "@/components/ui/Badge";
import { TrustCard } from "@/components/ui/TrustCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ReportDialog } from "@/components/ReportDialog";
import { ReplyForm } from "./ReplyForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { kisalt, trGorece } from "@/lib/format";
import type { CommunityReply, CommunityTopic } from "@/types/database";

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("community_topics")
    .select("title,description")
    .eq("id", id)
    .maybeSingle();
  return {
    title: data?.title ?? "Konu",
    description: data?.description ? kisalt(data.description, 140) : "Topluluk konusu",
  };
}

export default async function KonuDetayPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("community_topics").select("*").eq("id", id).maybeSingle();
  const topic = data as CommunityTopic | null;
  if (!topic || topic.status !== "approved") notFound();

  const user = await getCurrentUser();
  const { data: repliesData } = await supabase
    .from("community_replies")
    .select("*")
    .eq("topic_id", topic.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });
  const replies = (repliesData ?? []) as CommunityReply[];

  const { data: fav } = user
    ? await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_type", "topic")
        .eq("item_id", topic.id)
        .maybeSingle()
    : { data: null };

  return (
    <main>
      <PageContainer className="space-y-4">
        <Link href="/topluluk" className="inline-flex items-center gap-1 text-sm text-text-muted">
          <ChevronLeft className="h-4 w-4" /> Topluluk
        </Link>
        <article className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge tone="green">{topic.category}</Badge>
            {topic.is_featured ? <FeaturedBadge /> : null}
            <TrustBadge />
          </div>
          <h1 className="text-xl font-bold text-text-main">{topic.title}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
            {topic.user_name ? <span>Açan: {topic.user_name}</span> : null}
            {topic.location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {topic.location}
              </span>
            ) : null}
            <span>{trGorece(topic.created_at)}</span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3 w-3" /> {topic.reply_count} cevap
            </span>
          </div>
          <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-text-main">
            {topic.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <FavoriteButton itemType="topic" itemId={topic.id} initialSaved={Boolean(fav)} loggedIn={Boolean(user)} />
            <ReportDialog itemType="topic" itemId={topic.id} />
          </div>
        </article>

        <section>
          <h2 className="mb-3 text-base font-bold text-text-main">Cevaplar</h2>
          {replies.length === 0 ? (
            <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
              Henüz cevap yok. İlk cevabı sen yazabilirsin.
            </p>
          ) : (
            <ul className="space-y-2">
              {replies.map((r) => (
                <li key={r.id} className="rounded-2xl bg-surface p-4 shadow-card">
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span className="font-semibold text-text-main">{r.user_name ?? "Üye"}</span>
                    <span>{trGorece(r.created_at)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-main">{r.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-text-main">Cevap Yaz</h2>
          {user ? (
            <ReplyForm topicId={topic.id} />
          ) : (
            <div className="rounded-2xl bg-surface p-4 text-sm text-text-muted shadow-card">
              Cevap yazmak için{" "}
              <Link href={`/giris?next=/topluluk/${topic.id}`} className="font-semibold text-brand-green-dark">
                giriş yap
              </Link>
              .
            </div>
          )}
        </section>

        <TrustCard
          title="Topluluk Kuralları"
          description="Cevabın kontrol edildikten sonra görünür olur. Saygılı dil kullanalım."
        />
      </PageContainer>
    </main>
  );
}
