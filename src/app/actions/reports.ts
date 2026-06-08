"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export async function reviewReportAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("reports").update({ status: "reviewed" }).eq("id", id);
  revalidatePath("/admin/raporlar");
}

export async function dismissReportAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("reports").update({ status: "dismissed" }).eq("id", id);
  revalidatePath("/admin/raporlar");
}

export async function deleteReportedItemAction(itemType: "post" | "business" | "topic", itemId: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  const table =
    itemType === "business" ? "businesses" : itemType === "topic" ? "community_topics" : "posts";
  await admin.from(table).delete().eq("id", itemId);
  await admin.from("reports").update({ status: "reviewed" }).eq("item_id", itemId);
  revalidatePath("/admin/raporlar");
  if (itemType === "post") revalidatePath("/ilanlar");
  if (itemType === "business") revalidatePath("/isletmeler");
  if (itemType === "topic") revalidatePath("/topluluk");
}

export async function setUserRoleAction(userId: string, role: "user" | "business_owner" | "admin") {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("profiles").update({ role }).eq("user_id", userId);
  revalidatePath("/admin/kullanicilar");
}
