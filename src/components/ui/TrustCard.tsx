import { ShieldCheck } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
};

export function TrustCard({
  title = "Topluluğumuz Güvenilirdir",
  description = "İlanlar ve öneriler kontrol edilir. Uygunsuz içerikler yayına alınmaz.",
}: Props) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border border-border-soft bg-surface p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-green-soft text-brand-green-dark">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-text-main">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-text-muted">{description}</p>
      </div>
    </div>
  );
}
