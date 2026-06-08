"use client";

import { useActionState } from "react";
import { FormField, TextAreaField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/Toast";
import { FormSonuc, sendContactAction } from "@/app/actions/contact";

export function IletisimForm() {
  const [state, action, pending] = useActionState<FormSonuc | undefined, FormData>(
    sendContactAction,
    undefined,
  );
  return (
    <form action={action} className="space-y-4">
      <FormField label="Ad Soyad" name="name" required />
      <FormField label="E-posta" name="email" type="email" required />
      <TextAreaField label="Mesaj" name="message" required rows={5} placeholder="Mesajını yaz" />
      {state?.message ? (
        <InlineAlert tone={state.ok ? "success" : "danger"}>{state.message}</InlineAlert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Gönderiliyor..." : "Mesaj Gönder"}
      </Button>
    </form>
  );
}
