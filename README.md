# Dubai Türk Rehberi

Dubai’deki Türk topluluğu için pratik yaşam rehberi.
Next.js 16 (App Router) + TypeScript + Tailwind 4 + Supabase (yerel CLI) ile geliştirilmiştir.

> Tüm arayüz Türkçedir, mobil-öncelikli tasarım kullanır ve içerikler
> moderasyondan geçtikten sonra yayına alınır.

## Hızlı Başlangıç

### Gereksinimler

- Node.js 20+ (lokal kurulumda 24 ile test edildi)
- npm 10+
- Docker (yerel Supabase için)
- Supabase CLI

```bash
brew install supabase/tap/supabase
```

### Kurulum

```bash
cd ~/Desktop/projects/dubai
npm install
cp .env.local.example .env.local   # zaten oluşturulmuş olabilir
```

### Supabase yerel ortamını başlat

```bash
supabase start          # Docker konteynerlerini ayağa kaldırır
supabase db reset       # migrations + seed.sql uygular
```

`supabase status -o env` çıktısı `.env.local` dosyasıyla uyuşmalıdır.
Yerel anahtarlar (anon + service_role) deterministiktir, demo değerlerdir.

### Uygulamayı çalıştır

```bash
npm run dev             # http://localhost:3000
```

Yerel Supabase Studio: `http://localhost:54323`
Mailpit (e-posta önizleme): `http://localhost:54324`

## Test Hesapları (seed)

| E-posta | Şifre | Rol |
| --- | --- | --- |
| `admin@dubaiturkrehberi.test` | `Admin1234!` | Yönetici |
| `emre@dubaiturkrehberi.test` | `Admin1234!` | İşletme sahibi |
| `ayse@dubaiturkrehberi.test` ve diğerleri | `Admin1234!` | Üye |

> İlk admin şifresini production öncesi mutlaka değiştirin.

## Klasör Yapısı

```text
src/
├── app/
│   ├── (public)/            # Mobil shell + bottom nav ile public sayfalar
│   │   ├── page.tsx         # /
│   │   ├── ilanlar/
│   │   ├── ilan-ver/
│   │   ├── isletmeler/
│   │   ├── isletme-tanit/
│   │   ├── topluluk/
│   │   ├── oner-gonder/
│   │   ├── profil/
│   │   ├── hakkimizda/
│   │   ├── guvenlik/
│   │   └── iletisim/
│   ├── admin/               # Rol guardlı yönetim paneli
│   ├── giris/               # E-posta + şifre auth
│   ├── actions/             # Tüm server actions
│   ├── layout.tsx           # Türkçe lokal, font, metadata
│   ├── globals.css          # Tailwind theme tokenları
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/   (AppShell, Header, BottomNav, PageContainer, SectionHeader)
│   ├── ui/       (Button, Badge, FormField, FilterPanel, ImageUpload, ...)
│   ├── cards/    (PostCard, BusinessCard, TopicCard, RecommendationCard, ...)
│   └── admin/    (AdminTabs, AdminActionButton)
├── lib/
│   ├── supabase/ (server.ts, client.ts, admin.ts, middleware.ts)
│   ├── auth.ts   (getCurrentUser, requireAdmin)
│   ├── constants.ts
│   ├── format.ts
│   ├── privacy.ts
│   └── cn.ts
├── proxy.ts                 # Session yenileme + admin guard (Next 16 proxy)
└── types/database.ts

supabase/
├── config.toml
├── migrations/
│   ├── 0001_schema.sql      # Tablolar, enum'lar, trigger'lar
│   ├── 0002_rls.sql         # Row Level Security politikaları
│   └── 0003_storage.sql     # post-images, business-images, avatars
└── seed.sql                 # Türkçe demo verisi (70 ilan, 30 işletme, ...)
```

## Önemli Komutlar

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production derleme
npm run lint         # ESLint
supabase status      # Yerel servislerin durumu
supabase db reset    # Şemayı sıfırla ve seed yeniden uygula
supabase stop        # Konteynerleri durdur
```

## Güvenlik & Gizlilik Notları

- **WhatsApp scraping yok.** `/admin/whatsapp-aktar` sadece elle yapıştırılan
  metni satırlara böler, telefon numaralarını maskeler ve taslak **öneri**
  olarak kayıt eder. Yayın için yine admin onayı gerekir.
- **Service role anahtarı** yalnızca `src/lib/supabase/admin.ts` içinde
  kullanılır, istemci tarafına gönderilmez.
- **RLS** her tabloda aktif: kamusal sorgular yalnızca `status = 'approved'`
  satırlarını görür; içerik sahibi kendi `pending`/`rejected` içeriğini görür;
  admin tüm satırları yönetebilir.
- **Şikayetler** ve **kaydedilen içerikler** yalnızca sahibinin görebileceği
  şekilde kısıtlanmıştır.

## Veri Modeli (özet)

11 tablo: `profiles`, `posts`, `businesses`, `community_topics`,
`community_replies`, `recommendations`, `favorites`, `reports`,
`admin_imports`, `categories`, `locations` (+ `contact_messages`).

Anahtar trigger'lar:
- `handle_new_user`: `auth.users` ekledikçe `profiles` satırı oluşturur.
- `handle_reply_insert/update`: onaylanan cevaplarda
  `community_topics.reply_count` ve `last_activity_at` günceller.
- `set_updated_at`: tüm içerik tablolarında `updated_at` otomatik yenilenir.

## SEO

- `app/layout.tsx`'te Türkçe locale (`lang="tr"`) ve OpenGraph metadata.
- Her public sayfa için ayrı `metadata` veya `generateMetadata`.
- `robots.ts` admin/profil yollarını kapatır.
- `sitemap.ts` onaylı ilan/işletme/topluluk konularını listeler.

## Lisans

Bu proje topluluk içi kullanım için hazırlanmıştır.
