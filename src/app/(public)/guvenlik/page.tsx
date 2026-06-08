import { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { TrustCard } from "@/components/ui/TrustCard";
import { GUVEN_MESAJLARI } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Güvenlik ve Topluluk Kuralları",
  description: "Dubai Türk Rehberi topluluk kuralları ve güvenlik önerileri.",
};

const KURALLAR = [
  "Kişisel bilgileri izinsiz paylaşma.",
  "Tanımadığın kişilere ödeme yaparken dikkatli ol.",
  "Şüpheli ilanları bildir.",
  "İlanlar kontrol edildikten sonra yayınlanır.",
  "Sahte profil, dolandırıcılık ve taciz içerikleri kabul edilmez.",
  "Saygılı dil kullan, kişisel saldırı yapma.",
];

export default function GuvenlikPage() {
  return (
    <main>
      <PageContainer className="space-y-4">
        <h1 className="text-2xl font-bold">Güvenlik ve Topluluk Kuralları</h1>
        <ul className="space-y-2 rounded-3xl bg-surface p-5 text-[15px] leading-relaxed text-text-main shadow-card">
          {KURALLAR.map((k) => (
            <li key={k} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
              <span>{k}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-3xl bg-brand-green-soft p-5">
          <h2 className="text-base font-semibold text-brand-green-dark">Hatırlatma</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-main">
            {GUVEN_MESAJLARI.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <TrustCard />
      </PageContainer>
    </main>
  );
}
