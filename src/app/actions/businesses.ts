"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, requireUser } from "@/lib/auth";

const sema = z.object({
  owner_name: z.string().min(2, "Ad Soyad gerekli.").max(80),
  business_name: z.string().min(2, "İşletme adı gerekli.").max(120),
  category: z.string().min(2, "Kategori seç."),
  description: z.string().min(10, "Kısa bir açıklama yaz.").max(2000),
  instagram_url: z.string().url("Geçerli bir Instagram bağlantısı gir.").optional().or(z.literal("")),
  tiktok_url: z.string().url("Geçerli bir TikTok bağlantısı gir.").optional().or(z.literal("")),
  whatsapp_number: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim() : ""))
    .refine((v) => !v || /^[+0-9 ()-]{8,20}$/.test(v), "Geçerli bir WhatsApp numarası gir."),
  location: z.string().min(2, "Hizmet bölgesini seç."),
});

export type FormSonuc = { ok: boolean; message?: string };

async function yukle(bucket: string, userId: string, file: File | null) {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error("Görsel en fazla 5 MB olabilir.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Görsel JPEG, PNG ya da WEBP olmalı.");
  const admin = getSupabaseAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await admin.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error("Görsel yüklenemedi. Lütfen tekrar dene.");
  const { data } = admin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createBusinessAction(
  _prev: FormSonuc | undefined,
  formData: FormData,
): Promise<FormSonuc> {
  const user = await requireUser();
  const parsed = sema.safeParse({
    owner_name: formData.get("owner_name"),
    business_name: formData.get("business_name"),
    category: formData.get("category"),
    description: formData.get("description"),
    instagram_url: formData.get("instagram_url") ?? "",
    tiktok_url: formData.get("tiktok_url") ?? "",
    whatsapp_number: formData.get("whatsapp_number") ?? "",
    location: formData.get("location"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }
  let logoUrl: string | null = null;
  let coverUrl: string | null = null;
  try {
    logoUrl = await yukle("business-images", user.id, formData.get("logo") as File | null);
    coverUrl = await yukle("business-images", user.id, formData.get("cover_image") as File | null);
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Görsel yüklenemedi." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("businesses").insert({
    user_id: user.id,
    owner_name: parsed.data.owner_name,
    business_name: parsed.data.business_name,
    description: parsed.data.description,
    category: parsed.data.category,
    instagram_url: parsed.data.instagram_url || null,
    tiktok_url: parsed.data.tiktok_url || null,
    whatsapp_number: parsed.data.whatsapp_number || null,
    location: parsed.data.location,
    logo_url: logoUrl,
    cover_image_url: coverUrl,
    status: "pending",
    source_type: "business_claimed",
  });
  if (error) return { ok: false, message: "İşletme kaydedilemedi: " + error.message };
  revalidatePath("/isletmeler");
  return { ok: true, message: "İşletme tanıtımın bize ulaştı. Kontrol edildikten sonra yayına alınacak." };
}

export async function approveBusinessAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  const { data: biz } = await admin
    .from("businesses")
    .select("user_id")
    .eq("id", id)
    .maybeSingle<{ user_id: string }>();
  await admin.from("businesses").update({ status: "approved" }).eq("id", id);
  if (biz?.user_id) {
    await admin.from("profiles").update({ role: "business_owner" }).eq("user_id", biz.user_id);
  }
  revalidatePath("/admin/isletmeler");
  revalidatePath("/isletmeler");
}

export async function rejectBusinessAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("businesses").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin/isletmeler");
}

export async function toggleBusinessFeaturedAction(id: string, value: boolean) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("businesses").update({ is_featured: value }).eq("id", id);
  revalidatePath("/admin/isletmeler");
  revalidatePath("/isletmeler");
}

export async function deleteBusinessAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("businesses").delete().eq("id", id);
  revalidatePath("/admin/isletmeler");
  revalidatePath("/isletmeler");
}
