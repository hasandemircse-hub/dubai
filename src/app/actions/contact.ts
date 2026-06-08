"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const sema = z.object({
  name: z.string().min(2, "Ad gerekli.").max(120),
  email: z.string().email("Geçerli bir e-posta gir."),
  message: z.string().min(5, "Mesaj çok kısa.").max(2000),
});

export type FormSonuc = { ok: boolean; message?: string };

export async function sendContactAction(
  _prev: FormSonuc | undefined,
  formData: FormData,
): Promise<FormSonuc> {
  const parsed = sema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) return { ok: false, message: "Mesaj gönderilemedi, lütfen tekrar dene." };
  return { ok: true, message: "Mesajın bize ulaştı, kısa süre içinde dönüş yapacağız." };
}
