"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="grid min-h-dvh place-items-center bg-bg-soft px-6">
      <div className="max-w-sm rounded-3xl bg-surface p-6 text-center shadow-card">
        <h1 className="text-lg font-bold">Bir şeyler ters gitti</h1>
        <p className="mt-2 text-sm text-text-muted">
          Lütfen sayfayı yenile veya tekrar dene. Sorun devam ederse bize ulaş.
        </p>
        <button
          onClick={reset}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-semibold text-white"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
