import { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { TopicCard } from "@/components/cards/TopicCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TOPLULUK_KATEGORILERI } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { CommunityTopic } from "@/types/database";

export const metadata: Metadata = {
  title: "Topluluk Sohbetleri",
  description: "WhatsApp’ta kaybolan soruları burada düzenli şekilde konuşalım.",
};
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string; kategori?: string }>;
};

export default async function ToplulukPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const kategori = sp.kategori ?? "";

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("community_topics")
    .select("*")
    .eq("status", "approved")
    .order("is_featured", { ascending: false })
    .order("last_activity_at", { ascending: false })
    .limit(40);
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  if (kategori) query = query.eq("category", kategori);

  const { data } = await query;
  const topics = (data ?? []) as CommunityTopic[];

  function chipHref(name: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori !== name) params.set("kategori", name);
    const qs = params.toString();
    return qs ? `/topluluk?${qs}` : "/topluluk";
  }

  return (
    <main>
      <PageContainer className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Topluluk Sohbetleri</h1>
            <p className="mt-1 text-sm text-text-muted">
              WhatsApp’ta kaybolan soruları burada düzenli şekilde konuşalım.
            </p>
          </div>
          <Button asLink href="/topluluk/yeni" size="sm">
            Konu Aç
          </Button>
        </div>

        <form action="/topluluk" method="get">
          {kategori ? <input type="hidden" name="kategori" value={kategori} /> : null}
          <SearchInput name="q" placeholder="Konu ara" defaultValue={q} />
        </form>

        <div className="-mx-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 px-4">
            <Link
              href={q ? `/topluluk?q=${encodeURIComponent(q)}` : "/topluluk"}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium",
                kategori === "" ? "bg-brand-green text-white" : "bg-surface text-text-main shadow-card",
              )}
            >
              Tümü
            </Link>
            {TOPLULUK_KATEGORILERI.map((k) => {
              const active = k.name === kategori;
              return (
                <Link
                  key={k.name}
                  href={chipHref(k.name)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                    active ? "bg-brand-green text-white" : "bg-surface text-text-main shadow-card",
                  )}
                >
                  {k.emoji} {k.name}
                </Link>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-text-muted">
          <Badge tone="muted">{topics.length} konu</Badge>
        </p>

        <div className="space-y-3">
          {topics.length === 0 ? (
            <EmptyState
              title="Henüz konu yok"
              description="İlk soruyu sen sorabilirsin."
              actionLabel="Konu Aç"
              actionHref="/topluluk/yeni"
            />
          ) : (
            topics.map((t) => <TopicCard key={t.id} topic={t} />)
          )}
        </div>
      </PageContainer>
    </main>
  );
}
