import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrustCard } from "@/components/ui/TrustCard";
import { IlanForm } from "./IlanForm";
import { getCurrentUser } from "@/lib/auth";
import { KATEGORILER, BOLGELER } from "@/lib/constants";

export const metadata: Metadata = { title: "İlan Ver" };
export const dynamic = "force-dynamic";

export default async function IlanVerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/giris?next=/ilan-ver");
  return (
    <main>
      <PageContainer className="space-y-4">
        <div>
          <Link href="/ilanlar" className="text-sm text-text-muted">
            ← İlanlar
          </Link>
          <h1 className="mt-2 text-2xl font-bold">İlan Ver</h1>
          <p className="mt-1 text-sm text-text-muted">
            İlanın kontrol edildikten sonra yayına alınır.
          </p>
        </div>
        <IlanForm
          kategoriler={KATEGORILER.map((k) => ({ value: k.name, label: k.name }))}
          bolgeler={BOLGELER.map((b) => ({ value: b, label: b }))}
        />
        <TrustCard />
      </PageContainer>
    </main>
  );
}
