"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";

type Props = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
};

export function ImageUpload({ name, label, hint, required }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) {
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(f));
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-text-main">
          {label}
          {required ? <span className="ml-0.5 text-brand-green-dark">*</span> : null}
        </span>
        {hint ? <span className="text-[11px] text-text-muted">{hint}</span> : null}
      </div>
      <label className="relative flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border-medium bg-surface text-center text-text-muted transition hover:bg-bg-warm">
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/png,image/jpeg,image/webp"
          required={required}
          onChange={onChange}
          className="sr-only"
        />
        {preview ? (
          <Image
            src={preview}
            alt="Yüklenen görsel önizleme"
            fill
            sizes="(max-width:480px) 100vw, 480px"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Camera className="h-6 w-6" />
            <span className="text-xs font-medium">Görsel ekle (opsiyonel)</span>
          </div>
        )}
      </label>
      {preview ? (
        <button
          type="button"
          onClick={clear}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-state-danger-text"
        >
          <X className="h-3 w-3" /> Görseli kaldır
        </button>
      ) : null}
    </div>
  );
}
