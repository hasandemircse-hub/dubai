const ay_kisa = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

export function trTarih(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${ay_kisa[d.getMonth()]} ${d.getFullYear()}`;
}

export function trGorece(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const dakika = Math.round(diffMs / 60000);
  if (dakika < 1) return "az önce";
  if (dakika < 60) return `${dakika} dk önce`;
  const saat = Math.round(dakika / 60);
  if (saat < 24) return `${saat} sa önce`;
  const gun = Math.round(saat / 24);
  if (gun < 7) return `${gun} gün önce`;
  return trTarih(d);
}

export function temizleWhatsApp(numara: string | null | undefined): string {
  if (!numara) return "";
  return numara.replace(/[^0-9]/g, "");
}

export function whatsappLinki(numara: string | null | undefined, mesaj?: string): string {
  const t = temizleWhatsApp(numara);
  if (!t) return "#";
  const base = `https://wa.me/${t}`;
  if (!mesaj) return base;
  return `${base}?text=${encodeURIComponent(mesaj)}`;
}

export function bicimliWhatsApp(numara: string | null | undefined): string {
  if (!numara) return "";
  const t = temizleWhatsApp(numara);
  if (!t) return "";
  if (t.startsWith("971") && t.length >= 12) {
    return `+971 ${t.slice(3, 5)} ${t.slice(5, 8)} ${t.slice(8, 10)} ${t.slice(10, 12)}`;
  }
  return `+${t}`;
}

export function kisalt(metin: string, uzunluk = 120): string {
  if (!metin) return "";
  if (metin.length <= uzunluk) return metin;
  return metin.slice(0, uzunluk - 1).trimEnd() + "…";
}
