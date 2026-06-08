export default function Loading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg-soft">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-green-soft border-t-brand-green" />
        <p className="text-sm text-text-muted">Yükleniyor...</p>
      </div>
    </div>
  );
}
