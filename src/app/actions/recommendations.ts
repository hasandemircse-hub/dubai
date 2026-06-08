"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

const sema = z.object({
  title: z.string().min(4, "Başlık en az 4 karakter olmalı.").max(160),
  category: z.string().optional(),
  description: z.string().min(10, "Kısa bir açıklama yaz.").max(2000),
  location: z.string().optional(),
  instagram_url: z.string().url("Geçerli bir Instagram bağlantısı gir.").optional().or(z.literal("")),
  whatsapp_number: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim() : ""))
    .refine((v) => !v || /^[+0-9 ()-]{8,20}$/.test(v), "Geçerli bir WhatsApp numarası gir."),
  display_name: z.string().optional(),
  show_name: z.union([z.literal("on"), z.string().optional()]).transform((v) => v === "on"),
});

export type FormSonuc = { ok: boolean; message?: string };

export async function createRecommendationAction(
  _prev: FormSonuc | undefined,
  formData: FormData,
): Promise<FormSonuc> {
  const parsed = sema.safeParse({
    title: formData.get("title"),
    category: formData.get("category") ?? undefined,
    description: formData.get("description"),
    location: formData.get("location") ?? undefined,
    instagram_url: formData.get("instagram_url") ?? "",
    whatsapp_number: formData.get("whatsapp_number") ?? "",
    display_name: formData.get("display_name") ?? undefined,
    show_name: formData.get("show_name") ?? undefined,
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("recommendations").insert({
    user_id: user?.id ?? null,
    title: parsed.data.title,
    category: parsed.data.category || null,
    description: parsed.data.description,
    location: parsed.data.location || null,
    instagram_url: parsed.data.instagram_url || null,
    whatsapp_number: parsed.data.whatsapp_number || null,
    display_name: parsed.data.display_name || null,
    show_name: parsed.data.show_name,
    status: "pending",
    source_type: "user_submitted",
  });
  if (error) return { ok: false, message: "Önerin gönderilemedi: " + error.message };
  revalidatePath("/admin/oneriler");
  return { ok: true, message: "Önerin bize ulaştı. Kontrol edildikten sonra yayına alınacak." };
}

export async function approveRecommendationAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("recommendations").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/oneriler");
}

export async function rejectRecommendationAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("recommendations").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin/oneriler");
}

export async function deleteRecommendationAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("recommendations").delete().eq("id", id);
  revalidatePath("/admin/oneriler");
}

async function getRecOrThrow(id: string) {
  const admin = getSupabaseAdminClient();
  const { data } = await admin.from("recommendations").select("*").eq("id", id).maybeSingle();
  if (!data) throw new Error("Öneri bulunamadı.");
  return data as {
    id: string;
    user_id: string | null;
    title: string;
    description: string;
    category: string | null;
    location: string | null;
    whatsapp_number: string | null;
    instagram_url: string | null;
  };
}

export async function convertRecToPostAction(id: string) {
  const adminUser = await requireAdmin();
  const rec = await getRecOrThrow(id);
  const admin = getSupabaseAdminClient();
  await admin.from("posts").insert({
    user_id: rec.user_id ?? adminUser.id,
    title: rec.title,
    category: rec.category ?? "Mekan Tavsiyeleri",
    description: rec.description,
    location: rec.location,
    whatsapp_number: rec.whatsapp_number,
    status: "pending",
    source_type: "community_suggested",
  });
  await admin.from("recommendations").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/oneriler");
  revalidatePath("/admin/ilanlar");
}

export async function convertRecToTopicAction(id: string) {
  const adminUser = await requireAdmin();
  const rec = await getRecOrThrow(id);
  const admin = getSupabaseAdminClient();
  await admin.from("community_topics").insert({
    user_id: rec.user_id ?? adminUser.id,
    user_name: "Topluluktan",
    title: rec.title,
    category: rec.category ?? "Genel Sohbet",
    description: rec.description,
    location: rec.location,
    status: "pending",
    source_type: "community_suggested",
  });
  await admin.from("recommendations").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/oneriler");
  revalidatePath("/admin/topluluk");
}

export async function convertRecToBusinessAction(id: string) {
  const adminUser = await requireAdmin();
  const rec = await getRecOrThrow(id);
  const admin = getSupabaseAdminClient();
  await admin.from("businesses").insert({
    user_id: rec.user_id ?? adminUser.id,
    owner_name: null,
    business_name: rec.title,
    description: rec.description,
    category: rec.category ?? "Hizmet",
    instagram_url: rec.instagram_url,
    whatsapp_number: rec.whatsapp_number,
    location: rec.location,
    status: "pending",
    source_type: "community_suggested",
  });
  await admin.from("recommendations").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/oneriler");
  revalidatePath("/admin/isletmeler");
}
