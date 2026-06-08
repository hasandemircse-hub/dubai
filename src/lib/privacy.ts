const TELEFON_REGEX = /(\+?\d[\d\s().-]{7,}\d)/g;

export function telefonMaskele(metin: string): string {
  if (!metin) return "";
  return metin.replace(TELEFON_REGEX, (eslesme) => {
    const rakamlar = eslesme.replace(/\D/g, "");
    if (rakamlar.length < 8) return eslesme;
    const baslangic = rakamlar.slice(0, Math.min(4, rakamlar.length - 2));
    const son = rakamlar.slice(-2);
    return `+${baslangic} *** ** ${son}`;
  });
}

export function telefonIceriyorMu(metin: string): boolean {
  if (!metin) return false;
  return TELEFON_REGEX.test(metin);
}

export function metniSatirlaraBol(metin: string): string[] {
  if (!metin) return [];
  return metin
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 6);
}
