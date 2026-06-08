"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, requireUser } from "@/lib/auth";

const konuSemasi = z.object({
  title: z.string().min(6, "Başlık en az 6 karakter olmalı.").max(160),
  category: z.string().min(2, "Kategori seç."),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı.").max(2000),
  location: z.string().optional(),
  user_name: z.string().min(2, "Adın gerekli.").max(80),
});

const cevapSemasi = z.object({
  topic_id: z.string().uuid(),
  message: z.string().min(2, "Cevap çok kısa.").max(2000),
});

export type FormSonuc = { ok: boolean; message?: string };

export async function createTopicAction(
  _prev: FormSonuc | undefined,
  formData: FormData,
): Promise<FormSonuc> {
  const user = await requireUser();
  const parsed = konuSemasi.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    location: formData.get("location") ?? undefined,
    user_name: formData.get("user_name"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("community_topics").insert({
    user_id: user.id,
    user_name: parsed.data.user_name,
    title: parsed.data.title,
    category: parsed.data.category,
    description: parsed.data.description,
    location: parsed.data.location || null,
    status: "pending",
    source_type: "user_submitted",
  });
  if (error) return { ok: false, message: "Konu oluşturulamadı: " + error.message };
  revalidatePath("/topluluk");
  return { ok: true, message: "Konu kontrol edildikten sonra yayına alınır." };
}

export async function createReplyAction(
  _prev: FormSonuc | undefined,
  formData: FormData,
): Promise<FormSonuc> {
  const user = await requireUser();
  const parsed = cevapSemasi.safeParse({
    topic_id: formData.get("topic_id"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("community_replies").insert({
    topic_id: parsed.data.topic_id,
    user_id: user.id,
    user_name: user.profile?.name ?? user.email ?? "Üye",
    message: parsed.data.message,
    status: "pending",
  });
  if (error) return { ok: false, message: "Cevabın gönderilemedi." };
  revalidatePath(`/topluluk/${parsed.data.topic_id}`);
  return { ok: true, message: "Cevabın kontrol edildikten sonra görünür olur." };
}

export async function approveTopicAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("community_topics").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/topluluk");
  revalidatePath("/topluluk");
}

export async function rejectTopicAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("community_topics").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin/topluluk");
}

export async function toggleTopicFeaturedAction(id: string, value: boolean) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("community_topics").update({ is_featured: value }).eq("id", id);
  revalidatePath("/admin/topluluk");
  revalidatePath("/topluluk");
}

export async function deleteTopicAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("community_topics").delete().eq("id", id);
  revalidatePath("/admin/topluluk");
  revalidatePath("/topluluk");
}

export async function approveReplyAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("community_replies").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/cevaplar");
}

export async function rejectReplyAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("community_replies").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin/cevaplar");
}

export async function deleteReplyAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("community_replies").delete().eq("id", id);
  revalidatePath("/admin/cevaplar");
}
