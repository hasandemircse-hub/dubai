"use client";

import { useActionState } from "react";
import { Checkbox, FormField, SelectField, TextAreaField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/Toast";
import { FormSonuc, createRecommendationAction } from "@/app/actions/recommendations";

type Opt = { value: string; label: string };

export function OneriForm({ kategoriler, bolgeler }: { kategoriler: Opt[]; bolgeler: Opt[] }) {
  const [state, action, pending] = useActionState<FormSonuc | undefined, FormData>(
    createRecommendationAction,
    undefined,
  );
  return (
    <form action={action} className="space-y-4">
      <FormField label="Ne önermek istiyorsun?" name="title" placeholder="Kısa bir başlık" required />
      <SelectField label="Kategori" name="category" placeholder="Kategori (opsiyonel)" options={kategoriler} />
      <SelectField label="Bölge" name="location" placeholder="Bölge (opsiyonel)" options={bolgeler} />
      <TextAreaField label="Kısa açıklama" name="description" placeholder="Önerini birkaç cümleyle anlat" required rows={5} />
      <FormField label="Varsa Instagram bağlantısı" name="instagram_url" placeholder="https://instagram.com/..." />
      <FormField label="Varsa WhatsApp numarası" name="whatsapp_number" placeholder="Örn: +971 50 000 00 00" />
      <FormField label="Adın" name="display_name" placeholder="Topluluğa görünecek isim (opsiyonel)" />
      <Checkbox name="show_name" label="Adın görünsün mü?" hint="Önerinin altında ismin gösterilebilir." />
      {state?.message ? (
        <InlineAlert tone={state.ok ? "success" : "danger"}>{state.message}</InlineAlert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Gönderiliyor..." : "Öneri Gönder"}
      </Button>
    </form>
  );
}
