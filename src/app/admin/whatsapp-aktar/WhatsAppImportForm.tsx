"use client";

import { useActionState } from "react";
import { FormField, SelectField, TextAreaField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/Toast";
import { ImportSonuc, importWhatsAppDraftsAction } from "@/app/actions/admin-imports";

type Opt = { value: string; label: string };

export function WhatsAppImportForm({ kategoriler, bolgeler }: { kategoriler: Opt[]; bolgeler: Opt[] }) {
  const [state, action, pending] = useActionState<ImportSonuc | undefined, FormData>(
    importWhatsAppDraftsAction,
    undefined,
  );
  return (
    <form action={action} className="space-y-4 rounded-3xl bg-surface p-5 shadow-card">
      <TextAreaField
        label="Mesajları veya notları yapıştır"
        name="raw_text"
        rows={10}
        required
        placeholder="Her satır bir taslak öneri olur. Telefon numaraları otomatik olarak maskelenir."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectField
          label="Varsayılan kategori"
          name="default_category"
          placeholder="Kategori seç"
          options={kategoriler}
        />
        <SelectField
          label="Varsayılan bölge"
          name="default_location"
          placeholder="Bölge seç"
          options={bolgeler}
        />
      </div>
      <FormField label="Kaynak notu" name="source_note" placeholder="Örn: Anneler Kulübü grubu - 12.06" />
      {state?.message ? (
        <InlineAlert tone={state.ok ? (state.warning ? "warning" : "success") : "danger"}>
          {state.message}
        </InlineAlert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Oluşturuluyor..." : "Taslak Öneriler Oluştur"}
      </Button>
    </form>
  );
}
