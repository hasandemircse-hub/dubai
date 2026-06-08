import { Metadata } from "next";
import Link from "next/link";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { Badge } from "@/components/ui/Badge";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { trGorece } from "@/lib/format";
import type { Report, ReportStatus } from "@/types/database";
import {
  deleteReportedItemAction,
  dismissReportAction,
  reviewReportAction,
} from "@/app/actions/reports";

export const metadata: Metadata = { title: "Şikayetler (Yönetim)" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ durum?: string }> };
const DURUM_MAP: Record<string, ReportStatus> = {
  bekleyen: "pending",
  incelenen: "reviewed",
  kapanan: "dismissed",
};

async function fetchTargetInfo(itemType: "post" | "business" | "topic", id: string) {
  const admin = getSupabaseAdminClient();
  const table = itemType === "business" ? "businesses" : itemType === "topic" ? "community_topics" : "posts";
  const field = itemType === "business" ? "business_name" : "title";
  const { data } = await admin.from(table).select(`${field}`).eq("id", id).maybeSingle<Record<string, string>>();
  return data ? (data[field] as string) : "(silinmiş)";
}

export default async function AdminRaporlarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const durumKey = (sp.durum && DURUM_MAP[sp.durum] ? sp.durum : "bekleyen") as keyof typeof DURUM_MAP;
  const status = DURUM_MAP[durumKey];

  const admin = getSupabaseAdminClient();
  const [b, r, k, list] = await Promise.all([
    admin.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("reports").select("id", { count: "exact", head: true }).eq("status", "reviewed"),
    admin.from("reports").select("id", { count: "exact", head: true }).eq("status", "dismissed"),
    admin.from("reports").select("*").eq("status", status).order("created_at", { ascending: false }).limit(50),
  ]);

  const reports = (list.data ?? []) as Report[];

  const targets = await Promise.all(
    reports.map(async (rep) => ({
      id: rep.id,
      title: await fetchTargetInfo(rep.item_type, rep.item_id),
    })),
  );
  const titleById = new Map(targets.map((t) => [t.id, t.title]));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Şikayetler</h1>
      <AdminTabs
        active={`/admin/raporlar?durum=${durumKey}`}
        tabs={[
          { label: "Bekleyen", href: "/admin/raporlar?durum=bekleyen", count: b.count ?? 0 },
          { label: "İncelenen", href: "/admin/raporlar?durum=incelenen", count: r.count ?? 0 },
          { label: "Kapatılan", href: "/admin/raporlar?durum=kapanan", count: k.count ?? 0 },
        ]}
      />
      {reports.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
          Bu sekmede şikayet yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {reports.map((rep) => {
            const link =
              rep.item_type === "business"
                ? `/isletmeler/${rep.item_id}`
                : rep.item_type === "topic"
                  ? `/topluluk/${rep.item_id}`
                  : `/ilanlar/${rep.item_id}`;
            return (
              <article key={rep.id} className="rounded-3xl bg-surface p-4 shadow-card">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone="muted">
                    {rep.item_type === "business" ? "İşletme" : rep.item_type === "topic" ? "Konu" : "İlan"}
                  </Badge>
                  <Badge tone={rep.status === "pending" ? "warning" : rep.status === "dismissed" ? "muted" : "success"}>
                    {rep.status === "pending" ? "Bekliyor" : rep.status === "dismissed" ? "Kapatıldı" : "İncelendi"}
                  </Badge>
                  <span className="text-[11px] text-text-muted">{trGorece(rep.created_at)}</span>
                </div>
                <p className="text-sm font-semibold text-text-main">{titleById.get(rep.id)}</p>
                <p className="mt-1 text-sm text-text-main">
                  <span className="font-medium">Neden:</span> {rep.reason}
                </p>
                {rep.description ? (
                  <p className="mt-1 text-sm text-text-muted">{rep.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={link} className="inline-flex h-9 items-center rounded-full bg-bg-warm px-3 text-xs font-semibold">
                    İncele
                  </Link>
                  {rep.status === "pending" ? (
                    <>
                      <AdminActionButton
                        tone="secondary"
                        action={async () => { "use server"; await reviewReportAction(rep.id); }}
                      >
                        İncelendi olarak işaretle
                      </AdminActionButton>
                      <AdminActionButton
                        tone="warning"
                        action={async () => { "use server"; await dismissReportAction(rep.id); }}
                      >
                        Şikayeti Kapat
                      </AdminActionButton>
                    </>
                  ) : null}
                  <AdminActionButton
                    tone="danger"
                    confirm="İçerik silinecek, devam et?"
                    action={async () => { "use server"; await deleteReportedItemAction(rep.item_type, rep.item_id); }}
                  >
                    İçeriği Sil
                  </AdminActionButton>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
