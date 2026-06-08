import { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { trGorece } from "@/lib/format";
import type { Profile, UserRole } from "@/types/database";
import { setUserRoleAction } from "@/app/actions/reports";

export const metadata: Metadata = { title: "Kullanıcılar (Yönetim)" };
export const dynamic = "force-dynamic";

export default async function AdminKullanicilarPage() {
  const admin = getSupabaseAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const profiles = (data ?? []) as Profile[];
  const {
    data: { users },
  } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 });
  const emailById = new Map(users.map((u) => [u.id, u.email]));

  const roleLabel: Record<UserRole, string> = {
    user: "Üye",
    business_owner: "İşletme sahibi",
    admin: "Yönetici",
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Kullanıcılar</h1>
      <p className="text-sm text-text-muted">{profiles.length} kullanıcı</p>
      <div className="overflow-hidden rounded-3xl bg-surface shadow-card">
        <div className="hidden grid-cols-12 gap-3 border-b border-border-soft px-4 py-3 text-[11px] font-semibold uppercase text-text-muted lg:grid">
          <div className="col-span-3">Kullanıcı</div>
          <div className="col-span-4">E-posta</div>
          <div className="col-span-2">Rol</div>
          <div className="col-span-3">Aksiyonlar</div>
        </div>
        <ul>
          {profiles.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-1 gap-3 border-b border-border-soft px-4 py-3 last:border-0 lg:grid-cols-12 lg:items-center"
            >
              <div className="lg:col-span-3">
                <p className="text-sm font-semibold text-text-main">{p.name ?? "(isimsiz)"}</p>
                <p className="text-[11px] text-text-muted">{trGorece(p.created_at)}</p>
              </div>
              <div className="text-xs text-text-muted lg:col-span-4">{emailById.get(p.user_id) ?? "—"}</div>
              <div className="lg:col-span-2">
                <Badge
                  tone={p.role === "admin" ? "green" : p.role === "business_owner" ? "amber" : "muted"}
                >
                  {roleLabel[p.role]}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 lg:col-span-3">
                {p.role !== "admin" ? (
                  <AdminActionButton
                    tone="secondary"
                    action={async () => { "use server"; await setUserRoleAction(p.user_id, "admin"); }}
                  >
                    Admin yap
                  </AdminActionButton>
                ) : null}
                {p.role !== "business_owner" ? (
                  <AdminActionButton
                    tone="outline"
                    action={async () => { "use server"; await setUserRoleAction(p.user_id, "business_owner"); }}
                  >
                    İşletme sahibi
                  </AdminActionButton>
                ) : null}
                {p.role !== "user" ? (
                  <AdminActionButton
                    tone="outline"
                    action={async () => { "use server"; await setUserRoleAction(p.user_id, "user"); }}
                  >
                    Üye yap
                  </AdminActionButton>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
