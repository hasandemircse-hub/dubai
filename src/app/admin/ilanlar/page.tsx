import { Metadata } from "next";
import { AdminContentCard } from "@/components/cards/AdminContentCard";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ContentStatus, Post } from "@/types/database";
import {
  approvePostAction,
  deletePostAction,
  rejectPostAction,
  togglePostFeaturedAction,
} from "@/app/actions/posts";

export const metadata: Metadata = { title: "İlanlar (Yönetim)" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ durum?: string }> };

const DURUM_MAP: Record<string, ContentStatus> = {
  bekleyen: "pending",
  yayinda: "approved",
  reddedilen: "rejected",
};

export default async function AdminIlanlarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const durumKey = (sp.durum && DURUM_MAP[sp.durum] ? sp.durum : "bekleyen") as keyof typeof DURUM_MAP;
  const status = DURUM_MAP[durumKey];
  const admin = getSupabaseAdminClient();

  const [bekleyenC, yayindaC, reddedilenC, listRes] = await Promise.all([
    admin.from("posts").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("posts").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("posts").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("posts").select("*").eq("status", status).order("created_at", { ascending: false }).limit(50),
  ]);

  const posts = (listRes.data ?? []) as Post[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">İlanlar</h1>
      <AdminTabs
        active={`/admin/ilanlar?durum=${durumKey}`}
        tabs={[
          { label: "Bekleyen", href: "/admin/ilanlar?durum=bekleyen", count: bekleyenC.count ?? 0 },
          { label: "Yayında", href: "/admin/ilanlar?durum=yayinda", count: yayindaC.count ?? 0 },
          { label: "Reddedilen", href: "/admin/ilanlar?durum=reddedilen", count: reddedilenC.count ?? 0 },
        ]}
      />
      {posts.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
          Bu sekmede ilan yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {posts.map((p) => (
            <AdminContentCard
              key={p.id}
              title={p.title}
              description={p.description}
              category={p.category}
              location={p.location}
              status={p.status}
              isFeatured={p.is_featured}
              createdAt={p.created_at}
              meta={p.whatsapp_number ? <span>WA: {p.whatsapp_number}</span> : null}
              actions={
                <>
                  {p.status !== "approved" ? (
                    <AdminActionButton action={async () => { "use server"; await approvePostAction(p.id); }}>
                      Onayla
                    </AdminActionButton>
                  ) : null}
                  {p.status !== "rejected" ? (
                    <AdminActionButton
                      tone="warning"
                      action={async () => { "use server"; await rejectPostAction(p.id); }}
                    >
                      Reddet
                    </AdminActionButton>
                  ) : null}
                  {p.status === "approved" ? (
                    <AdminActionButton
                      tone="secondary"
                      action={async () => { "use server"; await togglePostFeaturedAction(p.id, !p.is_featured); }}
                    >
                      {p.is_featured ? "Öne Çıkarmayı Kaldır" : "Öne Çıkar"}
                    </AdminActionButton>
                  ) : null}
                  <AdminActionButton
                    tone="danger"
                    confirm="Bu ilanı silmek istediğinden emin misin?"
                    action={async () => { "use server"; await deletePostAction(p.id); }}
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
