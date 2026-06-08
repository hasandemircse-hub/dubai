import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

export type SessionUser = {
  id: string;
  email: string | null;
  profile: Profile | null;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<Profile>();
  return { id: user.id, email: user.email ?? null, profile: profile ?? null };
}

export async function requireUser(): Promise<SessionUser> {
  const u = await getCurrentUser();
  if (!u) redirect("/giris");
  return u;
}

export async function requireRole(role: UserRole): Promise<SessionUser> {
  const u = await requireUser();
  if (!u.profile || u.profile.role !== role) {
    if (role === "admin") redirect("/");
    redirect("/profil");
  }
  return u;
}

export async function requireAdmin() {
  return requireRole("admin");
}
