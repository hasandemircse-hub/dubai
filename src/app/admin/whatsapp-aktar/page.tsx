import { Metadata } from "next";
import { WhatsAppImportForm } from "./WhatsAppImportForm";
import { BOLGELER, ISLETME_KATEGORILERI } from "@/lib/constants";

export const metadata: Metadata = { title: "WhatsApp Bilgisi Aktar" };

export default function WhatsAppImportPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">WhatsApp Bilgisi Aktar</h1>
        <p className="text-sm text-text-muted">
          WhatsApp’ta kaybolan faydalı bilgileri kişisel verileri temizleyerek taslak öneriye dönüştür.
        </p>
        <div className="rounded-2xl bg-state-warning px-4 py-3 text-sm text-state-warning-text">
          Bu alan özel mesajları yayınlamak için kullanılmaz. Kişisel isim, telefon ve özel bilgiler izin olmadan paylaşılmamalıdır.
        </div>
      </header>
      <WhatsAppImportForm
        kategoriler={ISLETME_KATEGORILERI.map((c) => ({ value: c, label: c }))}
        bolgeler={BOLGELER.map((b) => ({ value: b, label: b }))}
      />
    </div>
  );
}
