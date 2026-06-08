import { Metadata } from "next";
import Link from "next/link";
import { AdminContentCard } from "@/components/cards/AdminContentCard";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CommunityReply, ContentStatus } from "@/types/database";
import { approveReplyAction, deleteReplyAction, rejectReplyAction } from "@/app/actions/topics";

export const metadata: Metadata = { title: "Cevaplar (Yönetim)" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ durum?: string }> };
const DURUM_MAP: Record<string, ContentStatus> = {
  bekleyen: "pending",
  yayinda: "approved",
  reddedilen: "rejected",
};

export default async function AdminCevaplarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const durumKey = (sp.durum && DURUM_MAP[sp.durum] ? sp.durum : "bekleyen") as keyof typeof DURUM_MAP;
  const status = DURUM_MAP[durumKey];
  const admin = getSupabaseAdminClient();

  const [b, y, r, list] = await Promise.all([
    admin.from("community_replies").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("community_replies").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("community_replies").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("community_replies").select("*").eq("status", status).order("created_at", { ascending: false }).limit(50),
  ]);

  const replies = (list.data ?? []) as CommunityReply[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cevaplar</h1>
      <AdminTabs
        active={`/admin/cevaplar?durum=${durumKey}`}
        tabs={[
          { label: "Bekleyen", href: "/admin/cevaplar?durum=bekleyen", count: b.count ?? 0 },
          { label: "Yayında", href: "/admin/cevaplar?durum=yayinda", count: y.count ?? 0 },
          { label: "Reddedilen", href: "/admin/cevaplar?durum=reddedilen", count: r.count ?? 0 },
        ]}
      />
      {replies.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-center text-sm text-text-muted shadow-card">
          Bu sekmede cevap yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {replies.map((r) => (
            <AdminContentCard
              key={r.id}
              title={r.user_name ?? "Üye"}
              description={r.message}
              status={r.status}
              createdAt={r.created_at}
              meta={
                <Link href={`/topluluk/${r.topic_id}`} className="underline">
                  Konuya Git
                </Link>
              }
              actions={
                <>
                  {r.status !== "approved" ? (
                    <AdminActionButton action={async () => { "use server"; await approveReplyAction(r.id); }}>
                      Cevabı Onayla
                    </AdminActionButton>
                  ) : null}
                  {r.status !== "rejected" ? (
                    <AdminActionButton tone="warning" action={async () => { "use server"; await rejectReplyAction(r.id); }}>
                      Cevabı Reddet
                    </AdminActionButton>
                  ) : null}
                  <AdminActionButton
                    tone="danger"
                    confirm="Cevabı silmek istediğinden emin misin?"
                    action={async () => { "use server"; await deleteReplyAction(r.id); }}
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
