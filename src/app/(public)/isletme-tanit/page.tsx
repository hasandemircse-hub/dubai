import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrustCard } from "@/components/ui/TrustCard";
import { IsletmeForm } from "./IsletmeForm";
import { getCurrentUser } from "@/lib/auth";
import { BOLGELER, ISLETME_KATEGORILERI } from "@/lib/constants";

export const metadata: Metadata = { title: "İşletme Tanıtımı" };
export const dynamic = "force-dynamic";

export default async function IsletmeTanitPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris?next=/isletme-tanit");
  return (
    <main>
      <PageContainer className="space-y-4">
        <div>
          <Link href="/isletmeler" className="text-sm text-text-muted">← İşletmeler</Link>
          <h1 className="mt-2 text-2xl font-bold">İşletme Tanıtımı</h1>
          <p className="mt-1 text-sm text-text-muted">
            İşletmeni, hizmetini veya sosyal medya hesabını Dubai’deki Türklerle paylaş.
          </p>
        </div>
        <div className="rounded-3xl bg-brand-green-soft p-4 text-sm text-brand-green-dark">
          Öne çıkan tanıtım alanı yakında aktif olacak.
        </div>
        <IsletmeForm
          kategoriler={ISLETME_KATEGORILERI.map((c) => ({ value: c, label: c }))}
          bolgeler={BOLGELER.map((b) => ({ value: b, label: b }))}
        />
        <TrustCard />
      </PageContainer>
    </main>
  );
}
