import { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrustCard } from "@/components/ui/TrustCard";
import { OneriForm } from "./OneriForm";
import { BOLGELER, ISLETME_KATEGORILERI } from "@/lib/constants";

export const metadata: Metadata = { title: "Öneri Gönder" };

export default function OneriPage() {
  return (
    <main>
      <PageContainer className="space-y-4">
        <div>
          <Link href="/" className="text-sm text-text-muted">← Ana Sayfa</Link>
          <h1 className="mt-2 text-2xl font-bold">Öneri Gönder</h1>
          <p className="mt-1 text-sm text-text-muted">
            Bildiklerini paylaş, Dubai’deki Türk topluluğuna faydan olsun.
          </p>
        </div>
        <div className="rounded-3xl bg-brand-green-soft p-4 text-sm text-brand-green-dark">
          Gönderilen öneriler kontrol edildikten sonra yayınlanır. Kişisel bilgiler izinsiz paylaşılmaz.
        </div>
        <OneriForm
          kategoriler={ISLETME_KATEGORILERI.map((c) => ({ value: c, label: c }))}
          bolgeler={BOLGELER.map((b) => ({ value: b, label: b }))}
        />
        <TrustCard />
      </PageContainer>
    </main>
  );
}
