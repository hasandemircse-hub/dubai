"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { metniSatirlaraBol, telefonIceriyorMu, telefonMaskele } from "@/lib/privacy";

const sema = z.object({
  raw_text: z.string().min(10, "Lütfen metni yapıştır."),
  default_category: z.string().optional(),
  default_location: z.string().optional(),
  source_note: z.string().optional(),
});

export type ImportSonuc = { ok: boolean; message?: string; created?: number; warning?: boolean };

export async function importWhatsAppDraftsAction(
  _prev: ImportSonuc | undefined,
  formData: FormData,
): Promise<ImportSonuc> {
  const adminUser = await requireAdmin();
  const parsed = sema.safeParse({
    raw_text: formData.get("raw_text"),
    default_category: formData.get("default_category") ?? undefined,
    default_location: formData.get("default_location") ?? undefined,
    source_note: formData.get("source_note") ?? undefined,
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const admin = getSupabaseAdminClient();
  const lines = metniSatirlaraBol(parsed.data.raw_text);
  const warning = telefonIceriyorMu(parsed.data.raw_text);
  const cleaned = telefonMaskele(parsed.data.raw_text);

  await admin.from("admin_imports").insert({
    admin_user_id: adminUser.id,
    raw_text: parsed.data.raw_text,
    cleaned_summary: cleaned,
    default_category: parsed.data.default_category || null,
    default_location: parsed.data.default_location || null,
    warning_detected: warning,
  });

  if (lines.length === 0) {
    return { ok: false, message: "Yeterince anlamlı satır bulunamadı." };
  }

  const rows = lines.map((line) => {
    const cleanedLine = telefonMaskele(line);
    return {
      user_id: null,
      title: line.slice(0, 60),
      category: parsed.data.default_category || null,
      description: cleanedLine,
      location: parsed.data.default_location || null,
      status: "pending" as const,
      source_type: "whatsapp_summary" as const,
    };
  });

  const { error } = await admin.from("recommendations").insert(rows);
  if (error) return { ok: false, message: "Taslaklar oluşturulamadı: " + error.message };
  revalidatePath("/admin/oneriler");
  return {
    ok: true,
    created: rows.length,
    warning,
    message: `${rows.length} taslak öneri oluşturuldu.` + (warning ? " Bu metinde telefon numarası olabilir, yayına almadan önce kontrol et." : ""),
  };
}
