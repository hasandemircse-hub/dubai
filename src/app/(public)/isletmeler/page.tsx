import { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BOLGELER, ISLETME_KATEGORILERI, SAYFA_BASINA } from "@/lib/constants";
import type { Business } from "@/types/database";

export const metadata: Metadata = {
  title: "İşletmeler",
  description: "Dubai’deki Türk işletmeleri ve hizmet verenler.",
};
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    kategori?: string;
    bolge?: string;
    sayfa?: string;
  }>;
};

export default async function IsletmelerPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const kategori = sp.kategori ?? "";
  const bolge = sp.bolge ?? "";
  const sayfa = Math.max(1, parseInt(sp.sayfa ?? "1", 10) || 1);
  const baslangic = (sayfa - 1) * SAYFA_BASINA;
  const bitis = baslangic + SAYFA_BASINA - 1;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("businesses")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(baslangic, bitis);

  if (q) query = query.or(`business_name.ilike.%${q}%,description.ilike.%${q}%`);
  if (kategori) query = query.eq("category", kategori);
  if (bolge) query = query.eq("location", bolge);

  const { data, count } = await query;
  const businesses = (data ?? []) as Business[];
  const toplam = count ?? 0;
  const toplamSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BASINA));

  function pageLink(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori) params.set("kategori", kategori);
    if (bolge) params.set("bolge", bolge);
    if (p > 1) params.set("sayfa", String(p));
    const qs = params.toString();
    return qs ? `/isletmeler?${qs}` : "/isletmeler";
  }

  return (
    <main>
      <PageContainer className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">İşletmeler</h1>
          <p className="mt-1 text-sm text-text-muted">
            Dubai’deki Türk işletmeleri ve hizmet verenler.
          </p>
        </div>
        <form action="/isletmeler" method="get">
          {kategori ? <input type="hidden" name="kategori" value={kategori} /> : null}
          {bolge ? <input type="hidden" name="bolge" value={bolge} /> : null}
          <SearchInput name="q" placeholder="İşletme ara" defaultValue={q} />
        </form>
        <FilterPanel
          pathname="/isletmeler"
          categoryOptions={ISLETME_KATEGORILERI.map((k) => ({ value: k, label: k }))}
          locationOptions={BOLGELER.map((b) => ({ value: b, label: b }))}
          showDate={false}
        />
        <p className="text-xs text-text-muted">{toplam} işletme</p>
        <div className="space-y-3">
          {businesses.length === 0 ? (
            <EmptyState
              title="Henüz uygun işletme yok"
              description="Aramanı değiştirebilir veya işletmeni tanıtabilirsin."
              actionLabel="İşletme Tanıt"
              actionHref="/isletme-tanit"
            />
          ) : (
            businesses.map((b) => <BusinessCard key={b.id} business={b} />)
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
