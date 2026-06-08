"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Checkbox, FormField, SelectField, TextAreaField } from "@/components/ui/FormField";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/Toast";
import { FormSonuc, createPostAction } from "@/app/actions/posts";

type Opt = { value: string; label: string };

type Props = {
  kategoriler: Opt[];
  bolgeler: Opt[];
};

export function IlanForm({ kategoriler, bolgeler }: Props) {
  const [state, action, pending] = useActionState<FormSonuc | undefined, FormData>(
    createPostAction,
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
      <FormField
        label="Başlık"
        name="title"
        placeholder="Kısa ve net bir başlık yaz"
        required
      />
      <SelectField
        label="Kategori"
        name="category"
        placeholder="Kategori seç"
        required
        options={kategoriler}
      />
      <TextAreaField
        label="Açıklama"
        name="description"
        placeholder="Detayları sade şekilde anlat"
        required
        rows={6}
      />
      <SelectField
        label="Konum / Bölge"
        name="location"
        placeholder="Bölge seç"
        required
        options={bolgeler}
      />
      <FormField
        label="WhatsApp numarası"
        name="whatsapp_number"
        placeholder="Örn: +971 50 000 00 00"
        hint="Sadece iletişim için kullanılır"
      />
      <ImageUpload name="image" label="Fotoğraf yükle" hint="Opsiyonel, en fazla 5 MB" />
      <Checkbox
        name="consent"
        label="KVKK / Gizlilik onayı veriyorum"
        hint="Topluluk kurallarını okudum ve kişisel verilerin güvenli işlenmesini kabul ediyorum."
      />
      {state?.message ? (
        <InlineAlert tone={state.ok ? "success" : "danger"}>{state.message}</InlineAlert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Gönderiliyor..." : "İlanı Yayınla"}
      </Button>
    </form>
  );
}
