import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrustCard } from "@/components/ui/TrustCard";
import { KonuForm } from "./KonuForm";
import { getCurrentUser } from "@/lib/auth";
import { BOLGELER, TOPLULUK_KATEGORILERI } from "@/lib/constants";

export const metadata: Metadata = { title: "Yeni Konu" };
export const dynamic = "force-dynamic";

export default async function YeniKonuPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris?next=/topluluk/yeni");
  return (
    <main>
      <PageContainer className="space-y-4">
        <div>
          <Link href="/topluluk" className="text-sm text-text-muted">← Topluluk</Link>
          <h1 className="mt-2 text-2xl font-bold">Yeni Konu</h1>
          <p className="mt-1 text-sm text-text-muted">
            Konu kontrol edildikten sonra yayına alınır.
          </p>
        </div>
        <KonuForm
          kategoriler={TOPLULUK_KATEGORILERI.map((k) => ({ value: k.name, label: `${k.emoji} ${k.name}` }))}
          bolgeler={BOLGELER.map((b) => ({ value: b, label: b }))}
          defaultName={user.profile?.name ?? ""}
        />
        <TrustCard />
      </PageContainer>
    </main>
  );
}
