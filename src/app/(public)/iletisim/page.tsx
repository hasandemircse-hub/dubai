import { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrustCard } from "@/components/ui/TrustCard";
import { IletisimForm } from "./IletisimForm";

export const metadata: Metadata = { title: "İletişim" };

export default function IletisimPage() {
  return (
    <main>
      <PageContainer className="space-y-4">
        <h1 className="text-2xl font-bold">İletişim</h1>
        <p className="text-sm text-text-muted">
          Görüşlerini, önerilerini veya geri bildirimlerini bize ulaştırabilirsin.
        </p>
        <IletisimForm />
        <TrustCard />
      </PageContainer>
    </main>
  );
}
