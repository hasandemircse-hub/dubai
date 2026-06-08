import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, LogOut } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TrustCard } from "@/components/ui/TrustCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";
import type { Business, CommunityTopic, Favorite, Post } from "@/types/database";
import { trGorece } from "@/lib/format";

export const metadata: Metadata = { title: "Profilim" };
export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <PageContainer className="py-6 space-y-4">
        <h1 className="text-xl font-bold">Profilim</h1>
        <EmptyState
          title="Giriş gerekli"
          description="Profilini görmek için giriş yapmalısın."
          actionLabel="Giriş Yap"
          actionHref="/giris?next=/profil"
        />
      </PageContainer>
    );
  }

  const supabase = await createSupabaseServerClient();
  const [postsRes, topicsRes, businessRes, favoritesRes] = await Promise.all([
    supabase.from("posts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("community_topics").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("businesses").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("favorites").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
  ]);

  const posts = (postsRes.data ?? []) as Post[];
  const topics = (topicsRes.data ?? []) as CommunityTopic[];
  const business = businessRes.data as Business | null;
  const favorites = (favoritesRes.data ?? []) as Favorite[];

  const isAdmin = user.profile?.role === "admin";

  return (
    <main>
      <PageContainer className="space-y-6">
        <div className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-green-soft text-2xl font-bold text-brand-green-dark">
              {(user.profile?.name ?? user.email ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-text-main">
                {user.profile?.name ?? "Hoş geldin"}
              </h1>
              <p className="truncate text-xs text-text-muted">{user.email}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <Badge tone="green">
                  {user.profile?.role === "admin"
                    ? "Yönetici"
                    : user.profile?.role === "business_owner"
                      ? "İşletme sahibi"
                      : "Üye"}
                </Badge>
                {user.profile?.phone ? <Badge tone="muted">{user.profile.phone}</Badge> : null}
              </div>
            </div>
          </div>
          {isAdmin ? (
            <div className="mt-4">
              <Button asLink href="/admin" size="md" variant="secondary" fullWidth>
                Yönetim Paneline Git
              </Button>
            </div>
          ) : null}
        </div>

        <section>
          <SectionHeader title="Kaydettiklerim" />
          {favorites.length === 0 ? (
            <EmptyState title="Henüz kayıtlı içeriğin yok" description="Beğendiğin ilanları kaydet, profilinde toplayalım." />
          ) : (
            <div className="space-y-2">
              {favorites.map((f) => (
                <Link
                  key={f.id}
                  href={
                    f.item_type === "business"
                      ? `/isletmeler/${f.item_id}`
                      : f.item_type === "topic"
                        ? `/topluluk/${f.item_id}`
                        : `/ilanlar/${f.item_id}`
                  }
                  className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-card"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-main">
                      {f.item_type === "post" ? "İlan" : f.item_type === "business" ? "İşletme" : "Konu"}
                    </p>
                    <p className="text-[11px] text-text-muted">{trGorece(f.created_at)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="İlanlarım" actionLabel="Yeni İlan" actionHref="/ilan-ver" />
          {posts.length === 0 ? (
            <EmptyState
              title="Henüz ilanın yok"
              description="İlk ilanını verip topluluğa katıl."
              actionLabel="İlan Ver"
              actionHref="/ilan-ver"
            />
          ) : (
            <div className="space-y-2">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/ilanlar/${p.id}`}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-surface p-3 shadow-card"
                >
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap gap-1">
                      <StatusBadge status={p.status} />
                      <Badge tone="muted">{p.category}</Badge>
                    </div>
                    <p className="truncate text-sm font-semibold text-text-main">{p.title}</p>
                    <p className="text-[11px] text-text-muted">{trGorece(p.created_at)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 self-center text-text-muted" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Konularım" actionLabel="Yeni Konu" actionHref="/topluluk/yeni" />
          {topics.length === 0 ? (
            <EmptyState
              title="Henüz konun yok"
              description="Toplulukta ilk konunu aç."
              actionLabel="Konu Aç"
              actionHref="/topluluk/yeni"
            />
          ) : (
            <div className="space-y-2">
              {topics.map((t) => (
                <Link
                  key={t.id}
                  href={`/topluluk/${t.id}`}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-surface p-3 shadow-card"
                >
                  <div className="min-w-0">
                    <div className="mb-1 flex gap-1">
                      <StatusBadge status={t.status} />
                      <Badge tone="muted">{t.category}</Badge>
                    </div>
                    <p className="truncate text-sm font-semibold text-text-main">{t.title}</p>
                    <p className="text-[11px] text-text-muted">{t.reply_count} cevap · {trGorece(t.last_activity_at)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 self-center text-text-muted" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="İşletmem" actionLabel={business ? undefined : "Tanıt"} actionHref={business ? undefined : "/isletme-tanit"} />
          {business ? (
            <Link
              href={`/isletmeler/${business.id}`}
              className="block rounded-2xl bg-surface p-4 shadow-card"
            >
              <div className="mb-1 flex flex-wrap gap-1">
                <StatusBadge status={business.status} />
                <Badge tone="muted">{business.category}</Badge>
              </div>
              <p className="text-sm font-semibold text-text-main">{business.business_name}</p>
              <p className="mt-1 text-xs text-text-muted">{business.location}</p>
            </Link>
          ) : (
            <EmptyState
              title="Henüz işletme tanıtımın yok"
              description="İşletmeni topluluk ile paylaş."
              actionLabel="İşletme Tanıt"
              actionHref="/isletme-tanit"
            />
          )}
        </section>

        <TrustCard />

        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="lg" leftIcon={<LogOut className="h-4 w-4" />}>
            Çıkış Yap
          </Button>
        </form>
      </PageContainer>
    </main>
  );
}
