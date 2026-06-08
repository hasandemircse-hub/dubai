import { Metadata } from "next";
import { AdminContentCard } from "@/components/cards/AdminContentCard";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Business, ContentStatus } from "@/types/database";
import {
  approveBusinessAction,
  deleteBusinessAction,
  rejectBusinessAction,
  toggleBusinessFeaturedAction,
} from "@/app/actions/businesses";

export const metadata: Metadata = { title: "İşletmeler (Yönetim)" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ durum?: string }> };
const DURUM_MAP: Record<string, ContentStatus> = {
  bekleyen: "pending",
  yayinda: "approved",
  reddedilen: "rejected",
};

export default async function AdminIsletmelerPage({ searchParams }: Props) {
  const sp = await searchParams;
  const durumKey = (sp.durum && DURUM_MAP[sp.durum] ? sp.durum : "bekleyen") as keyof typeof DURUM_MAP;
  const status = DURUM_MAP[durumKey];
  const admin = getSupabaseAdminClient();

  const [bekleyenC, yayindaC, reddedilenC, listRes] = await Promise.all([
    admin.from("businesses").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("businesses").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("businesses").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("businesses").select("*").eq("status", status).order("created_at", { ascending: false }).limit(50),
  ]);

  const businesses = (listRes.data ?? []) as Business[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">İşletmeler</h1>
      <AdminTabs
        active={`/admin/isletmeler?durum=${durumKey}`}
        tabs={[
          { label: "Bekleyen", href: "/admin/isletmeler?durum=bekleyen", count: bekleyenC.count ?? 0 },
          { label: "Yayında", href: "/admin/isletmeler?durum=yayinda", count: yayindaC.count ?? 0 },
          { label: "Reddedilen", href: "/admin/isletmeler?durum=reddedilen", count: reddedilenC.count ?? 0 },
        ]}
      />
      {businesses.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
          Bu sekmede işletme yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {businesses.map((b) => (
            <AdminContentCard
              key={b.id}
              title={b.business_name}
              description={b.description}
              category={b.category}
              location={b.location}
              status={b.status}
              isFeatured={b.is_featured}
              createdAt={b.created_at}
              meta={
                <>
                  {b.instagram_url ? <span>IG ✓</span> : null}
                  {b.whatsapp_number ? <span>WA ✓</span> : null}
                </>
              }
              actions={
                <>
                  {b.status !== "approved" ? (
                    <AdminActionButton action={async () => { "use server"; await approveBusinessAction(b.id); }}>
                      Onayla
                    </AdminActionButton>
                  ) : null}
                  {b.status !== "rejected" ? (
                    <AdminActionButton tone="warning" action={async () => { "use server"; await rejectBusinessAction(b.id); }}>
                      Reddet
                    </AdminActionButton>
                  ) : null}
                  {b.status === "approved" ? (
                    <AdminActionButton
                      tone="secondary"
                      action={async () => { "use server"; await toggleBusinessFeaturedAction(b.id, !b.is_featured); }}
                    >
                      {b.is_featured ? "Öne Çıkarmayı Kaldır" : "Öne Çıkar"}
                    </AdminActionButton>
                  ) : null}
                  <AdminActionButton
                    tone="danger"
                    confirm="Bu işletmeyi silmek istediğinden emin misin?"
                    action={async () => { "use server"; await deleteBusinessAction(b.id); }}
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
