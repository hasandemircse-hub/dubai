"use client";

import { useActionState, useState } from "react";
import { Flag, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextAreaField } from "@/components/ui/FormField";
import { InlineAlert } from "@/components/ui/Toast";
import { FormSonuc, reportContentAction } from "@/app/actions/posts";

type Props = {
  itemType: "post" | "business" | "topic";
  itemId: string;
};

const REASONS = [
  "Yanıltıcı içerik",
  "Uygunsuz dil",
  "Spam reklam",
  "Kişisel veri paylaşımı",
  "Tekrarlanan ilan",
  "Diğer",
];

export function ReportDialog({ itemType, itemId }: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<FormSonuc | undefined, FormData>(
    reportContentAction,
    undefined,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1 rounded-full bg-bg-warm px-3 text-xs font-semibold text-state-danger-text"
      >
        <Flag className="h-3 w-3" /> Şikayet Et
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
          <div className="shell-width rounded-3xl bg-surface p-5 shadow-floating">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Şikayet Et</h2>
                <p className="text-xs text-text-muted">
                  Topluluk kurallarına aykırı içeriği bize bildir.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="grid h-9 w-9 place-items-center rounded-full bg-bg-warm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form action={action} className="mt-4 space-y-3">
              <input type="hidden" name="item_type" value={itemType} />
              <input type="hidden" name="item_id" value={itemId} />
              <div className="grid grid-cols-2 gap-2">
                {REASONS.map((r) => (
                  <label
                    key={r}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-border-soft bg-surface p-3 text-sm has-[:checked]:border-brand-green has-[:checked]:bg-brand-green-soft"
                  >
                    <input type="radio" name="reason" value={r} className="text-brand-green" required />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
              <TextAreaField
                label="Kısa açıklama (opsiyonel)"
                name="description"
                placeholder="Şikayetini birkaç cümleyle açıkla"
              />
              {state?.message ? (
                <InlineAlert tone={state.ok ? "success" : "danger"}>{state.message}</InlineAlert>
              ) : null}
              <div className="flex gap-2">
                <Button type="submit" size="md" disabled={pending} fullWidth>
                  {pending ? "Gönderiliyor..." : "Şikayeti Gönder"}
                </Button>
                <Button type="button" variant="outline" size="md" onClick={() => setOpen(false)}>
                  Kapat
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
