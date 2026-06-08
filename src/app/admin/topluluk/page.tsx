import { Metadata } from "next";
import Link from "next/link";
import { AdminContentCard } from "@/components/cards/AdminContentCard";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CommunityTopic, ContentStatus } from "@/types/database";
import {
  approveTopicAction,
  deleteTopicAction,
  rejectTopicAction,
  toggleTopicFeaturedAction,
} from "@/app/actions/topics";

export const metadata: Metadata = { title: "Topluluk (Yönetim)" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ durum?: string }> };
const DURUM_MAP: Record<string, ContentStatus> = {
  bekleyen: "pending",
  yayinda: "approved",
  reddedilen: "rejected",
};

export default async function AdminToplulukPage({ searchParams }: Props) {
  const sp = await searchParams;
  const durumKey = (sp.durum && DURUM_MAP[sp.durum] ? sp.durum : "bekleyen") as keyof typeof DURUM_MAP;
  const status = DURUM_MAP[durumKey];
  const admin = getSupabaseAdminClient();

  const [b, y, r, list] = await Promise.all([
    admin.from("community_topics").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("community_topics").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("community_topics").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("community_topics").select("*").eq("status", status).order("created_at", { ascending: false }).limit(50),
  ]);

  const topics = (list.data ?? []) as CommunityTopic[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Topluluk Konuları</h1>
      <AdminTabs
        active={`/admin/topluluk?durum=${durumKey}`}
        tabs={[
          { label: "Bekleyen", href: "/admin/topluluk?durum=bekleyen", count: b.count ?? 0 },
          { label: "Yayında", href: "/admin/topluluk?durum=yayinda", count: y.count ?? 0 },
          { label: "Reddedilen", href: "/admin/topluluk?durum=reddedilen", count: r.count ?? 0 },
        ]}
      />
      {topics.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
          Bu sekmede konu yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {topics.map((t) => (
            <AdminContentCard
              key={t.id}
              title={t.title}
              description={t.description}
              category={t.category}
              location={t.location}
              status={t.status}
              isFeatured={t.is_featured}
              createdAt={t.created_at}
              meta={<Link href={`/topluluk/${t.id}`} className="underline">Konuyu Aç</Link>}
              actions={
                <>
                  {t.status !== "approved" ? (
                    <AdminActionButton action={async () => { "use server"; await approveTopicAction(t.id); }}>
                      Konuyu Onayla
                    </AdminActionButton>
                  ) : null}
                  {t.status !== "rejected" ? (
                    <AdminActionButton tone="warning" action={async () => { "use server"; await rejectTopicAction(t.id); }}>
                      Konuyu Reddet
                    </AdminActionButton>
                  ) : null}
                  {t.status === "approved" ? (
                    <AdminActionButton
                      tone="secondary"
                      action={async () => { "use server"; await toggleTopicFeaturedAction(t.id, !t.is_featured); }}
                    >
                      {t.is_featured ? "Öne Çıkarmayı Kaldır" : "Öne Çıkar"}
                    </AdminActionButton>
                  ) : null}
                  <AdminActionButton
                    tone="danger"
                    confirm="Konuyu silmek istediğinden emin misin?"
                    action={async () => { "use server"; await deleteTopicAction(t.id); }}
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
