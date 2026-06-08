import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg-soft px-6">
      <div className="max-w-sm rounded-3xl bg-surface p-6 text-center shadow-card">
        <p className="text-5xl">🧭</p>
        <h1 className="mt-3 text-lg font-bold">Sayfa bulunamadı</h1>
        <p className="mt-2 text-sm text-text-muted">
          Aradığın sayfa kaldırılmış veya hiç var olmamış olabilir.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-semibold text-white"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
