"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormField, SelectField, TextAreaField } from "@/components/ui/FormField";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/Toast";
import { FormSonuc, createBusinessAction } from "@/app/actions/businesses";

type Opt = { value: string; label: string };

export function IsletmeForm({ kategoriler, bolgeler }: { kategoriler: Opt[]; bolgeler: Opt[] }) {
  const [state, action, pending] = useActionState<FormSonuc | undefined, FormData>(
    createBusinessAction,
    undefined,
  );
  const router = useRouter();
  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => router.push("/profil"), 1500);
      return () => clearTimeout(t);
    }
  }, [state, router]);
  return (
    <form action={action} className="space-y-4">
      <FormField label="Ad Soyad" name="owner_name" placeholder="Adın Soyadın" required />
      <FormField label="İşletme adı" name="business_name" placeholder="İşletmenin tam adı" required />
      <SelectField label="Kategori" name="category" placeholder="Kategori seç" required options={kategoriler} />
      <TextAreaField label="Açıklama" name="description" placeholder="Hizmetlerini sade şekilde anlat" required rows={5} />
      <FormField label="Instagram hesabı" name="instagram_url" placeholder="https://instagram.com/..." />
      <FormField label="TikTok hesabı" name="tiktok_url" placeholder="https://tiktok.com/@..." />
      <FormField label="WhatsApp numarası" name="whatsapp_number" placeholder="Örn: +971 50 000 00 00" />
      <SelectField label="Hizmet bölgesi" name="location" placeholder="Bölge seç" required options={bolgeler} />
      <ImageUpload name="logo" label="Logo yükle" hint="Opsiyonel" />
      <ImageUpload name="cover_image" label="Kapak görseli yükle" hint="Opsiyonel" />
      {state?.message ? (
        <InlineAlert tone={state.ok ? "success" : "danger"}>{state.message}</InlineAlert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Gönderiliyor..." : "Tanıtımı Gönder"}
      </Button>
    </form>
  );
}
