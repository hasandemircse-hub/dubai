"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const girisSemasi = z.object({
  email: z.string().email("Geçerli bir e-posta girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
});

const kayitSemasi = girisSemasi.extend({
  name: z.string().min(2, "Ad en az 2 karakter olmalı."),
});

const sifreSemasi = z.object({
  email: z.string().email("Geçerli bir e-posta girin."),
});

export type AuthSonuc = {
  ok: boolean;
  message?: string;
  field?: string;
};

export async function signInAction(_: AuthSonuc | undefined, formData: FormData): Promise<AuthSonuc> {
  const parsed = girisSemasi.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue.message, field: issue.path[0]?.toString() };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    const raw = (error.message || "").toLowerCase();
    let message = "E-posta veya şifre hatalı.";
    if (raw.includes("not confirmed") || raw.includes("confirm")) {
      message =
        "E-postan henüz onaylanmamış. Lütfen kayıt sonrası gönderdiğimiz onay bağlantısına tıkla. Mail gelmediyse şifre sıfırlama bağlantısı isteyebilirsin.";
    } else if (raw.includes("rate")) {
      message = "Çok fazla deneme yaptın. Lütfen biraz sonra tekrar dene.";
    }
    return { ok: false, message };
  }
  const nextParam = formData.get("next")?.toString();
  revalidatePath("/", "layout");
  redirect(nextParam && nextParam.startsWith("/") ? nextParam : "/profil");
}

export async function signUpAction(_: AuthSonuc | undefined, formData: FormData): Promise<AuthSonuc> {
  const parsed = kayitSemasi.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue.message, field: issue.path[0]?.toString() };
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.name, role: "user" } },
  });
  if (error) {
    return { ok: false, message: "Hesap oluşturulamadı: " + error.message };
  }
  const needsConfirmation = !data.session;
  if (needsConfirmation) {
    return {
      ok: true,
      message:
        "Hesabın oluşturuldu. E-postana gönderdiğimiz onay bağlantısına tıkladıktan sonra giriş yapabilirsin.",
    };
  }
  revalidatePath("/", "layout");
  redirect("/profil");
}

export async function resetPasswordAction(
  _: AuthSonuc | undefined,
  formData: FormData,
): Promise<AuthSonuc> {
  const parsed = sifreSemasi.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message, field: "email" };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);
  if (error) {
    return { ok: false, message: "Şifre sıfırlama bağlantısı gönderilemedi." };
  }
  return { ok: true, message: "Şifre sıfırlama bağlantısı e-postana gönderildi." };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
