import { Metadata } from "next";
import { AdminContentCard } from "@/components/cards/AdminContentCard";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { Badge } from "@/components/ui/Badge";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ContentStatus, Recommendation } from "@/types/database";
import {
  approveRecommendationAction,
  convertRecToBusinessAction,
  convertRecToPostAction,
  convertRecToTopicAction,
  deleteRecommendationAction,
  rejectRecommendationAction,
} from "@/app/actions/recommendations";

export const metadata: Metadata = { title: "Öneriler (Yönetim)" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ durum?: string }> };
const DURUM_MAP: Record<string, ContentStatus> = {
  bekleyen: "pending",
  yayinda: "approved",
  reddedilen: "rejected",
};

export default async function AdminOnerilerPage({ searchParams }: Props) {
  const sp = await searchParams;
  const durumKey = (sp.durum && DURUM_MAP[sp.durum] ? sp.durum : "bekleyen") as keyof typeof DURUM_MAP;
  const status = DURUM_MAP[durumKey];
  const admin = getSupabaseAdminClient();

  const [b, y, r, list] = await Promise.all([
    admin.from("recommendations").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("recommendations").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("recommendations").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("recommendations").select("*").eq("status", status).order("created_at", { ascending: false }).limit(50),
  ]);

  const recs = (list.data ?? []) as Recommendation[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Öneriler</h1>
      <AdminTabs
        active={`/admin/oneriler?durum=${durumKey}`}
        tabs={[
          { label: "Bekleyen", href: "/admin/oneriler?durum=bekleyen", count: b.count ?? 0 },
          { label: "Yayında", href: "/admin/oneriler?durum=yayinda", count: y.count ?? 0 },
          { label: "Reddedilen", href: "/admin/oneriler?durum=reddedilen", count: r.count ?? 0 },
        ]}
      />
      {recs.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
          Bu sekmede öneri yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {recs.map((rec) => (
            <AdminContentCard
              key={rec.id}
              title={rec.title}
              description={rec.description}
              category={rec.category}
              location={rec.location}
              status={rec.status}
              createdAt={rec.created_at}
              meta={
                <>
                  {rec.source_type === "whatsapp_summary" ? (
                    <Badge tone="warning">WhatsApp özeti</Badge>
                  ) : null}
                  {rec.whatsapp_number ? <span>WA: {rec.whatsapp_number}</span> : null}
                </>
              }
              actions={
                <>
                  {rec.status !== "approved" ? (
                    <AdminActionButton action={async () => { "use server"; await approveRecommendationAction(rec.id); }}>
                      Onayla
                    </AdminActionButton>
                  ) : null}
                  {rec.status !== "rejected" ? (
                    <AdminActionButton tone="warning" action={async () => { "use server"; await rejectRecommendationAction(rec.id); }}>
                      Reddet
                    </AdminActionButton>
                  ) : null}
                  <AdminActionButton
                    tone="secondary"
                    action={async () => { "use server"; await convertRecToPostAction(rec.id); }}
                  >
                    İlana Dönüştür
                  </AdminActionButton>
                  <AdminActionButton
                    tone="secondary"
                    action={async () => { "use server"; await convertRecToTopicAction(rec.id); }}
                  >
                    Topluluk Konusuna Dönüştür
                  </AdminActionButton>
                  <AdminActionButton
                    tone="secondary"
                    action={async () => { "use server"; await convertRecToBusinessAction(rec.id); }}
                  >
                    İşletme Tanıtımına Dönüştür
                  </AdminActionButton>
                  <AdminActionButton
                    tone="danger"
                    confirm="Bu öneriyi silmek istediğinden emin misin?"
                    action={async () => { "use server"; await deleteRecommendationAction(rec.id); }}
                  >
                    Sil
                  </AdminActionButton>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
