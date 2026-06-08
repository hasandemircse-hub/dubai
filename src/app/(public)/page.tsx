import Link from "next/link";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { PostCard } from "@/components/cards/PostCard";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { TopicCard } from "@/components/cards/TopicCard";
import { TrustCard } from "@/components/ui/TrustCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { KATEGORILER, TOPLULUK_KATEGORILERI } from "@/lib/constants";
import type { Business, CommunityTopic, Post } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const [postsRes, businessesRes, topicsRes] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("status", "approved")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("businesses")
      .select("*")
      .eq("status", "approved")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("community_topics")
      .select("*")
      .eq("status", "approved")
      .order("last_activity_at", { ascending: false })
      .limit(6),
  ]);

  const posts = (postsRes.data ?? []) as Post[];
  const businesses = (businessesRes.data ?? []) as Business[];
  const topics = (topicsRes.data ?? []) as CommunityTopic[];

  return (
    <main>
      <PageContainer className="space-y-7">
        <section className="rounded-3xl bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-green-dark p-5 text-white shadow-card">
          <Badge tone="amber" className="mb-3">
            Topluluk
          </Badge>
          <h1 className="text-2xl font-bold leading-tight">
            Dubai’de yaşamı birlikte kolaylaştıralım.
          </h1>
          <p className="mt-1.5 text-sm text-white/90">
            Güvenilir öneriler ve topluluk ilanları
          </p>
          <form
            action="/ilanlar"
            className="mt-4 flex items-center gap-2 rounded-2xl bg-white p-1.5 text-text-main shadow-floating"
          >
            <Search className="ml-2 h-5 w-5 text-text-muted" aria-hidden />
            <input
              name="q"
              placeholder="Ne arıyorsun?"
              className="h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-text-muted"
              aria-label="Ne arıyorsun?"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-brand-green px-4 text-sm font-semibold text-white"
            >
              Ara
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/ilan-ver"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-brand-green-dark"
            >
              İlan Ver
            </Link>
            <Link
              href="/ilanlar"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/30"
            >
              İlanlara Bak
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-white/80">
            İçerikler kontrol edildikten sonra yayınlanır.
          </p>
        </section>

        <section>
          <SectionHeader title="Kategoriler" subtitle="Aradığın konuya hızlıca git" />
          <div className="grid grid-cols-2 gap-3">
            {KATEGORILER.slice(0, 6).map((k) => (
              <CategoryCard
                key={k.slug}
                name={k.name}
                emoji={k.emoji}
                href={`/ilanlar?kategori=${encodeURIComponent(k.name)}`}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Son Eklenen İlanlar"
            actionLabel="Tümü"
            actionHref="/ilanlar"
          />
          <div className="space-y-3">
            {posts.length === 0 ? (
              <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
                Henüz uygun ilan yok.
              </p>
            ) : (
              posts.map((p) => <PostCard key={p.id} post={p} />)
            )}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Topluluk Sohbetleri"
            subtitle="WhatsApp’ta kaybolan soruları burada düzenli şekilde konuşalım."
            actionLabel="Tümü"
            actionHref="/topluluk"
          />
          <div className="-mx-4 overflow-x-auto scrollbar-none">
            <div className="flex gap-3 px-4 pb-1">
              {topics.length === 0
                ? TOPLULUK_KATEGORILERI.slice(0, 4).map((c) => (
                    <Link
                      key={c.name}
                      href={`/topluluk?kategori=${encodeURIComponent(c.name)}`}
                      className="flex min-w-[200px] flex-col gap-3 rounded-3xl bg-surface p-4 shadow-card"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-green-soft text-2xl">
                        {c.emoji}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text-main">{c.name}</p>
                        <p className="text-[11px] text-text-muted">İlk konuyu sen aç</p>
                      </div>
                      <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-green-dark">
                        Sohbete Katıl <MessageCircle className="h-3 w-3" />
                      </span>
                    </Link>
                  ))
                : topics.slice(0, 6).map((t) => <TopicCard key={t.id} topic={t} compact />)}
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            title="Öne Çıkan İşletmeler"
            actionLabel="Tümü"
            actionHref="/isletmeler"
          />
          <div className="space-y-3">
            {businesses.length === 0 ? (
              <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
                Henüz işletme yok.
              </p>
            ) : (
              businesses.map((b) => <BusinessCard key={b.id} business={b} />)
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <h2 className="text-lg font-bold text-text-main">Sen de bildiklerini paylaş</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
            İyi bir mekan, güvenilir bir hizmet ya da faydalı bir bilgi biliyorsan topluluğa öner.
          </p>
          <div className="mt-4">
            <Button asLink href="/oner-gonder" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Öneri Gönder
            </Button>
          </div>
          <p className="mt-3 text-[11px] text-text-muted">
            Kişisel bilgiler izinsiz yayınlanmaz.
          </p>
        </section>

        <TrustCard />
      </PageContainer>
    </main>
  );
}
