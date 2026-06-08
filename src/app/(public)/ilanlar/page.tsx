import { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { PostCard } from "@/components/cards/PostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BOLGELER, KATEGORILER, SAYFA_BASINA } from "@/lib/constants";
import type { Post } from "@/types/database";

export const metadata: Metadata = {
  title: "İlanlar",
  description: "Dubai’deki Türk topluluğundan güncel ilanlar.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    kategori?: string;
    bolge?: string;
    tarih?: string;
    sayfa?: string;
  }>;
};

function dateFilter(tarih: string | undefined): Date | null {
  if (!tarih) return null;
  const now = new Date();
  if (tarih === "1g") return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (tarih === "7g") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (tarih === "30g") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return null;
}

export default async function IlanlarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const kategori = sp.kategori ?? "";
  const bolge = sp.bolge ?? "";
  const tarih = sp.tarih ?? "";
  const sayfa = Math.max(1, parseInt(sp.sayfa ?? "1", 10) || 1);
  const baslangic = (sayfa - 1) * SAYFA_BASINA;
  const bitis = baslangic + SAYFA_BASINA - 1;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(baslangic, bitis);

  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  if (kategori) query = query.eq("category", kategori);
  if (bolge) query = query.eq("location", bolge);
  const sinir = dateFilter(tarih);
  if (sinir) query = query.gte("created_at", sinir.toISOString());

  const { data, count } = await query;
  const posts = (data ?? []) as Post[];
  const toplam = count ?? 0;
  const toplamSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BASINA));

  function pageLink(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori) params.set("kategori", kategori);
    if (bolge) params.set("bolge", bolge);
    if (tarih) params.set("tarih", tarih);
    if (p > 1) params.set("sayfa", String(p));
    const qs = params.toString();
    return qs ? `/ilanlar?${qs}` : "/ilanlar";
  }

  return (
    <main>
      <PageContainer className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">İlanlar</h1>
          <p className="mt-1 text-sm text-text-muted">
            Dubai’deki Türk topluluğundan güncel ilanlar.
          </p>
        </div>

        <form action="/ilanlar" method="get" className="space-y-2">
          {kategori ? <input type="hidden" name="kategori" value={kategori} /> : null}
          {bolge ? <input type="hidden" name="bolge" value={bolge} /> : null}
          {tarih ? <input type="hidden" name="tarih" value={tarih} /> : null}
          <SearchInput name="q" placeholder="Ne arıyorsun?" defaultValue={q} />
        </form>

        <FilterPanel
          pathname="/ilanlar"
          categoryOptions={KATEGORILER.map((k) => ({ value: k.name, label: k.name }))}
          locationOptions={BOLGELER.map((b) => ({ value: b, label: b }))}
        />

        <p className="text-xs text-text-muted">{toplam} ilan</p>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <EmptyState
              title="Henüz uygun ilan yok"
              description="Aramanı değiştirebilir veya ilk ilanı sen verebilirsin."
              actionLabel="İlan Ver"
              actionHref="/ilan-ver"
            />
          ) : (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>

        {toplamSayfa > 1 ? (
          <nav className="flex items-center justify-between pt-2">
            {sayfa > 1 ? (
              <Link href={pageLink(sayfa - 1)} className="rounded-full bg-surface px-4 py-2 text-sm shadow-card">
                Önceki
              </Link>
            ) : <span />}
            <span className="text-xs text-text-muted">{sayfa} / {toplamSayfa}</span>
            {sayfa < toplamSayfa ? (
              <Link href={pageLink(sayfa + 1)} className="rounded-full bg-surface px-4 py-2 text-sm shadow-card">
                Sonraki
              </Link>
            ) : <span />}
          </nav>
        ) : null}
      </PageContainer>
    </main>
  );
}
