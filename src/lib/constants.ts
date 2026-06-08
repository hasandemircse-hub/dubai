export const SITE_NAME = "Dubai Türk Rehberi";
export const SITE_TAGLINE = "Dubai’deki Türkler için pratik yaşam rehberi";
export const SITE_DESCRIPTION =
  "Dubai’de yaşayan Türk topluluğu için ilanlar, işletmeler, topluluk sohbetleri ve güvenilir öneriler.";

export const KATEGORILER = [
  { name: "Mekan Tavsiyeleri", emoji: "🍽️", slug: "mekan-tavsiyeleri" },
  { name: "Nanny / Bakıcı", emoji: "👶", slug: "nanny-bakici" },
  { name: "Türkiye’den Getirenler", emoji: "🛬", slug: "turkiyeden-getirenler" },
  { name: "Dubai’den Gönderenler", emoji: "🛫", slug: "dubaiden-gonderenler" },
  { name: "İkinci El Pazarı", emoji: "🛒", slug: "ikinci-el" },
  { name: "İşletme & Sosyal Medya Tanıtımı", emoji: "💼", slug: "isletme-tanitim" },
  { name: "Topluluk Konusu", emoji: "💬", slug: "topluluk-konusu" },
] as const;

export type KategoriAdi = (typeof KATEGORILER)[number]["name"];

export const TOPLULUK_KATEGORILERI = [
  { name: "Genel Sohbet", emoji: "💬" },
  { name: "Yeni Gelenler", emoji: "👋" },
  { name: "Anneler Kulübü", emoji: "🤱" },
  { name: "Mekan Önerileri", emoji: "📍" },
  { name: "Bakıcı Arayanlar", emoji: "🧒" },
  { name: "İkinci El", emoji: "🛍️" },
  { name: "Türkiye’den Getirenler", emoji: "🛬" },
  { name: "Okul & Çocuk", emoji: "🎒" },
  { name: "Ev & Taşınma", emoji: "🏠" },
  { name: "Sağlık & Doktor", emoji: "🩺" },
] as const;

export const BOLGELER = [
  "Dubai Marina",
  "Jumeirah",
  "Downtown Dubai",
  "Business Bay",
  "Al Barsha",
  "JVC",
  "JLT",
  "Deira",
  "Bur Dubai",
  "Mirdif",
  "Dubai Hills",
  "Arabian Ranches",
  "Damac Hills 2",
  "Dubai Silicon Oasis",
  "Motor City",
  "International City",
  "Palm Jumeirah",
  "Dubai Creek",
  "Diğer",
] as const;

export const ISLETME_KATEGORILERI = [
  "Yeme & İçme",
  "Güzellik & Bakım",
  "Eğitim",
  "Sağlık",
  "Çocuk",
  "Market",
  "Hizmet",
  "Emlak",
  "Etkinlik",
  "Spor",
] as const;

export const SAYFA_BASINA = 12;

export const GUVEN_MESAJLARI = [
  "İçerikler kontrol edildikten sonra yayınlanır.",
  "Kişisel bilgiler izinsiz paylaşılmaz.",
  "Şüpheli içerikleri bize bildirebilirsin.",
  "Tanımadığın kişilere ödeme yaparken dikkatli ol.",
  "WhatsApp mesajları doğrudan yayınlanmaz.",
] as const;
