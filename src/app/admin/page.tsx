import { Metadata } from "next";
import { StatCard } from "@/components/cards/StatCard";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Yönetim Paneli" };
export const dynamic = "force-dynamic";

async function count(table: string, filters: Record<string, string> = {}) {
  const admin = getSupabaseAdminClient();
  let q = admin.from(table).select("id", { count: "exact", head: true });
  for (const [k, v] of Object.entries(filters)) {
    q = q.eq(k, v);
  }
  const { count: c } = await q;
  return c ?? 0;
}

export default async function AdminDashboard() {
  const [
    bekleyenIlan,
    bekleyenOneri,
    bekleyenIsletme,
    bekleyenKonu,
    bekleyenCevap,
    bekleyenSikayet,
    toplamIlan,
    yayindakiIlan,
    toplamIsletme,
    toplamKonu,
  ] = await Promise.all([
    count("posts", { status: "pending" }),
    count("recommendations", { status: "pending" }),
    count("businesses", { status: "pending" }),
    count("community_topics", { status: "pending" }),
    count("community_replies", { status: "pending" }),
    count("reports", { status: "pending" }),
    count("posts"),
    count("posts", { status: "approved" }),
    count("businesses"),
    count("community_topics"),
  ]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Genel Bakış</h1>
        <p className="mt-1 text-sm text-text-muted">Topluluk içeriğine hızlı bir bakış.</p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Bekleyen</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard label="Bekleyen İlanlar" value={bekleyenIlan} href="/admin/ilanlar" tone="warning" />
          <StatCard label="Bekleyen Öneriler" value={bekleyenOneri} href="/admin/oneriler" tone="warning" />
          <StatCard label="Bekleyen İşletmeler" value={bekleyenIsletme} href="/admin/isletmeler" tone="warning" />
          <StatCard label="Bekleyen Topluluk Konuları" value={bekleyenKonu} href="/admin/topluluk" tone="warning" />
          <StatCard label="Bekleyen Cevaplar" value={bekleyenCevap} href="/admin/cevaplar" tone="warning" />
          <StatCard label="Şikayetler" value={bekleyenSikayet} href="/admin/raporlar" tone="danger" />
          <StatCard label="WhatsApp Bilgisi Aktar" value="→" href="/admin/whatsapp-aktar" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Genel İstatistikler</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard label="Toplam ilan" value={toplamIlan} />
          <StatCard label="Yayındaki ilan" value={yayindakiIlan} />
          <StatCard label="Toplam işletme" value={toplamIsletme} />
          <StatCard label="Toplam topluluk konusu" value={toplamKonu} />
        </div>
      </section>
    </div>
  );
}
