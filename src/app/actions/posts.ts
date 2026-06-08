"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, requireUser } from "@/lib/auth";

const ilanSemasi = z.object({
  title: z.string().min(4, "Başlık en az 4 karakter olmalı.").max(120, "Başlık çok uzun."),
  category: z.string().min(2, "Kategori seç."),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı.").max(2000),
  location: z.string().min(2, "Bölge seç."),
  whatsapp_number: z
    .string()
    .optional()
    .transform((v) => (v ? v.trim() : ""))
    .refine((v) => !v || /^[+0-9 ()-]{8,20}$/.test(v), {
      message: "Geçerli bir WhatsApp numarası gir.",
    }),
  consent: z.literal("on", { message: "KVKK onayı zorunludur." }),
});

export type FormSonuc = { ok: boolean; message?: string };

async function bucketYukle(
  bucket: string,
  userId: string,
  file: File | null,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Görsel en fazla 5 MB olabilir.");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Görsel JPEG, PNG ya da WEBP olmalı.");
  }
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

export async function createPostAction(
  _prev: FormSonuc | undefined,
  formData: FormData,
): Promise<FormSonuc> {
  const user = await requireUser();
  const parsed = ilanSemasi.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    location: formData.get("location"),
    whatsapp_number: formData.get("whatsapp_number"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }
  let imageUrl: string | null = null;
  try {
    imageUrl = await bucketYukle("post-images", user.id, formData.get("image") as File | null);
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Görsel yüklenemedi." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    title: parsed.data.title,
    category: parsed.data.category,
    description: parsed.data.description,
    location: parsed.data.location,
    whatsapp_number: parsed.data.whatsapp_number || null,
    image_url: imageUrl,
    status: "pending",
    source_type: "user_submitted",
  });
  if (error) {
    return { ok: false, message: "İlan oluşturulamadı, lütfen tekrar dene." };
  }
  revalidatePath("/ilanlar");
  revalidatePath("/profil");
  return { ok: true, message: "İlanın bize ulaştı. Kontrol edildikten sonra yayına alınacak." };
}

const sikayetSemasi = z.object({
  item_type: z.enum(["post", "business", "topic"]),
  item_id: z.string().uuid(),
  reason: z.string().min(3, "Şikayet nedeni belirt."),
  description: z.string().optional(),
});

export async function reportContentAction(
  _prev: FormSonuc | undefined,
  formData: FormData,
): Promise<FormSonuc> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const parsed = sikayetSemasi.safeParse({
    item_type: formData.get("item_type"),
    item_id: formData.get("item_id"),
    reason: formData.get("reason"),
    description: formData.get("description") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }
  const { error } = await supabase.from("reports").insert({
    user_id: user?.id ?? null,
    item_type: parsed.data.item_type,
    item_id: parsed.data.item_id,
    reason: parsed.data.reason,
    description: parsed.data.description ?? null,
    status: "pending",
  });
  if (error) {
    return { ok: false, message: "Şikayetin kaydedilemedi, tekrar dene." };
  }
  return { ok: true, message: "Şikayetin bize ulaştı. Kontrol edeceğiz." };
}

export async function approvePostAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("posts").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/ilanlar");
  revalidatePath("/ilanlar");
}

export async function rejectPostAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("posts").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin/ilanlar");
}

export async function togglePostFeaturedAction(id: string, value: boolean) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("posts").update({ is_featured: value }).eq("id", id);
  revalidatePath("/admin/ilanlar");
  revalidatePath("/ilanlar");
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  const admin = getSupabaseAdminClient();
  await admin.from("posts").delete().eq("id", id);
  revalidatePath("/admin/ilanlar");
  revalidatePath("/ilanlar");
}

export async function incrementPostViewAction(id: string) {
  const admin = getSupabaseAdminClient();
  const { data } = await admin.from("posts").select("view_count").eq("id", id).maybeSingle();
  if (data && typeof data.view_count === "number") {
    await admin.from("posts").update({ view_count: data.view_count + 1 }).eq("id", id);
  }
}

export async function redirectAfterPostSubmit() {
  redirect("/profil");
}
