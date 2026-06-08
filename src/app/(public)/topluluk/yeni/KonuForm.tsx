"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormField, SelectField, TextAreaField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/Toast";
import { FormSonuc, createTopicAction } from "@/app/actions/topics";

type Opt = { value: string; label: string };

export function KonuForm({
  kategoriler,
  bolgeler,
  defaultName,
}: {
  kategoriler: Opt[];
  bolgeler: Opt[];
  defaultName?: string;
}) {
  const [state, action, pending] = useActionState<FormSonuc | undefined, FormData>(
    createTopicAction,
    undefined,
  );
  const router = useRouter();
  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => router.push("/topluluk"), 1500);
      return () => clearTimeout(t);
    }
  }, [state, router]);
  return (
    <form action={action} className="space-y-4">
      <FormField label="Başlık" name="title" placeholder="Sorunu kısa ve net yaz" required />
      <SelectField label="Kategori" name="category" placeholder="Kategori seç" required options={kategoriler} />
      <TextAreaField label="Açıklama" name="description" placeholder="Detayları sade şekilde anlat" required rows={5} />
      <SelectField label="Bölge" name="location" placeholder="Bölge (opsiyonel)" options={bolgeler} />
      <FormField label="Adın" name="user_name" placeholder="Topluluğa görünecek isim" defaultValue={defaultName} required />
      {state?.message ? (
        <InlineAlert tone={state.ok ? "success" : "danger"}>{state.message}</InlineAlert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Gönderiliyor..." : "Konu Aç"}
      </Button>
    </form>
  );
}
