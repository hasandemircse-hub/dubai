import { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrustCard } from "@/components/ui/TrustCard";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Dubai Türk Rehberi ile ilgili bilgi.",
};

export default function HakkimizdaPage() {
  return (
    <main>
      <PageContainer className="space-y-4">
        <h1 className="text-2xl font-bold">Hakkımızda</h1>
        <article className="space-y-4 rounded-3xl bg-surface p-5 text-[15px] leading-relaxed text-text-main shadow-card">
          <p>
            Dubai Türk Rehberi, Dubai’de yaşayan Türklerin günlük hayatta ihtiyaç duyduğu bilgileri
            tek yerde toplamak için hazırlanmıştır.
          </p>
          <p>
            Aklındaki sorulara WhatsApp gruplarında dolaşmadan, düzenli ve aranabilir bir alandan
            ulaşmanı amaçlıyoruz. İlanlar, işletmeler ve topluluk konuları yayına alınmadan önce
            kontrol edilir.
          </p>
          <p>
            Topluluğa katkı sağlamak istiyorsan ilan verebilir, öneri gönderebilir veya konu açabilirsin.
          </p>
        </article>
        <TrustCard />
      </PageContainer>
    </main>
  );
}
