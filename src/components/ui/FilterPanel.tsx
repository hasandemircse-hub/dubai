"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Filter, X } from "lucide-react";
import { SelectField } from "./FormField";

type Option = { value: string; label: string };

type Props = {
  pathname: string;
  categoryOptions: Option[];
  locationOptions: Option[];
  showDate?: boolean;
};

export function FilterPanel({ pathname, categoryOptions, locationOptions, showDate = true }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(form: FormData) {
    const sp = new URLSearchParams();
    const k = form.get("kategori")?.toString().trim();
    const b = form.get("bolge")?.toString().trim();
    const t = form.get("tarih")?.toString().trim();
    const q = params.get("q");
    if (q) sp.set("q", q);
    if (k) sp.set("kategori", k);
    if (b) sp.set("bolge", b);
    if (t) sp.set("tarih", t);
    startTransition(() => router.push(`${pathname}?${sp.toString()}`));
  }

  function clear() {
    startTransition(() => router.push(pathname));
  }

  return (
    <details className="group rounded-2xl border border-border-soft bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-text-main">
        <span className="inline-flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filtrele
        </span>
        <span className="text-xs text-text-muted group-open:hidden">aç</span>
        <span className="hidden text-xs text-text-muted group-open:inline">kapat</span>
      </summary>
      <form
        action={(fd) => update(fd)}
        className="grid grid-cols-1 gap-3 border-t border-border-soft p-4 sm:grid-cols-2"
      >
        <SelectField
          label="Kategori seç"
          name="kategori"
          defaultValue={params.get("kategori") ?? ""}
          placeholder="Tümü"
          options={categoryOptions}
        />
        <SelectField
          label="Bölge seç"
          name="bolge"
          defaultValue={params.get("bolge") ?? ""}
          placeholder="Tümü"
          options={locationOptions}
        />
        {showDate ? (
          <SelectField
            label="Tarih seç"
            name="tarih"
            defaultValue={params.get("tarih") ?? ""}
            placeholder="Tümü"
            options={[
              { value: "1g", label: "Son 24 saat" },
              { value: "7g", label: "Son 7 gün" },
              { value: "30g", label: "Son 30 gün" },
            ]}
          />
        ) : null}
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="h-12 flex-1 rounded-full bg-brand-green text-sm font-semibold text-white disabled:opacity-60"
          >
            Ara
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={pending}
            className="inline-flex h-12 items-center gap-1 rounded-full bg-bg-warm px-4 text-sm font-medium text-text-main"
          >
            <X className="h-4 w-4" /> Filtreleri Temizle
          </button>
        </div>
      </form>
    </details>
  );
}
