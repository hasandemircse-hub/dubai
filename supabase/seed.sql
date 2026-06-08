-- Dubai Türk Rehberi - Demo verisi (seed)
-- Tüm metinler Türkçe, uydurma WhatsApp numaraları (+971 5X XXX XX XX)

-- =====================================================
-- KATEGORİLER
-- =====================================================

insert into public.categories (name, slug, emoji, description, sort_order) values
  ('Mekan Tavsiyeleri', 'mekan-tavsiyeleri', '🍽️', 'Restoran, kafe, kahvaltıcı tavsiyeleri', 1),
  ('Nanny / Bakıcı', 'nanny-bakici', '👶', 'Çocuk bakıcısı, dadı, nanny ilanları', 2),
  ('Türkiye’den Getirenler', 'turkiyeden-getirenler', '🛬', 'Türkiye’den eşya getirmek isteyenler', 3),
  ('Dubai’den Gönderenler', 'dubaiden-gonderenler', '🛫', 'Dubai’den Türkiye’ye eşya götürenler', 4),
  ('İkinci El Pazarı', 'ikinci-el', '🛒', 'İkinci el eşya alım/satım', 5),
  ('İşletme & Sosyal Medya Tanıtımı', 'isletme-tanitim', '💼', 'Türk işletmeleri ve hizmetler', 6),
  ('Topluluk Konusu', 'topluluk-konusu', '💬', 'Genel topluluk soruları', 7)
on conflict (slug) do nothing;

-- =====================================================
-- BÖLGELER
-- =====================================================

insert into public.locations (name, sort_order) values
  ('Dubai Marina', 1),
  ('Jumeirah', 2),
  ('Downtown Dubai', 3),
  ('Business Bay', 4),
  ('Al Barsha', 5),
  ('JVC', 6),
  ('JLT', 7),
  ('Deira', 8),
  ('Bur Dubai', 9),
  ('Mirdif', 10),
  ('Dubai Hills', 11),
  ('Arabian Ranches', 12),
  ('Damac Hills 2', 13),
  ('Dubai Silicon Oasis', 14),
  ('Motor City', 15),
  ('International City', 16),
  ('Palm Jumeirah', 17),
  ('Dubai Creek', 18),
  ('Diğer', 99)
on conflict (name) do nothing;

-- =====================================================
-- KULLANICILAR (auth.users + identities)
-- =====================================================
-- Şifre: hepsi "Admin1234!" (kolay test için).
-- Production'da seed kullanılmaz; ilk admin şifresini değiştirin.

do $$
declare
  v_users record;
  v_password_hash text := crypt('Admin1234!', gen_salt('bf'));
begin
  for v_users in
    select * from (values
      ('00000000-0000-0000-0000-000000000001'::uuid, 'admin@dubaiturkrehberi.test', 'Admin Yönetici', 'admin'),
      ('00000000-0000-0000-0000-000000000010'::uuid, 'ayse@dubaiturkrehberi.test',  'Ayşe Yıldız',     'user'),
      ('00000000-0000-0000-0000-000000000011'::uuid, 'mehmet@dubaiturkrehberi.test','Mehmet Demir',    'user'),
      ('00000000-0000-0000-0000-000000000012'::uuid, 'zeynep@dubaiturkrehberi.test','Zeynep Aydın',    'user'),
      ('00000000-0000-0000-0000-000000000013'::uuid, 'can@dubaiturkrehberi.test',   'Can Özkan',       'user'),
      ('00000000-0000-0000-0000-000000000014'::uuid, 'elif@dubaiturkrehberi.test',  'Elif Kara',       'user'),
      ('00000000-0000-0000-0000-000000000015'::uuid, 'burak@dubaiturkrehberi.test', 'Burak Şahin',     'user'),
      ('00000000-0000-0000-0000-000000000016'::uuid, 'selin@dubaiturkrehberi.test', 'Selin Yalçın',    'user'),
      ('00000000-0000-0000-0000-000000000017'::uuid, 'emre@dubaiturkrehberi.test',  'Emre Kaplan',     'business_owner')
    ) as t(id, email, name, role)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      v_users.id,
      'authenticated',
      'authenticated',
      v_users.email,
      v_password_hash,
      now(),
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object('name', v_users.name, 'role', v_users.role),
      now(), now(), '', '', '', ''
    )
    on conflict (id) do nothing;

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    )
    values (
      gen_random_uuid(),
      v_users.id,
      v_users.id::text,
      jsonb_build_object('sub', v_users.id::text, 'email', v_users.email, 'email_verified', true),
      'email',
      now(), now(), now()
    )
    on conflict do nothing;
  end loop;

  -- Trigger profile satırını otomatik oluşturur; rolleri kesinleştir
  update public.profiles set role = 'admin'
    where user_id = '00000000-0000-0000-0000-000000000001';
  update public.profiles set role = 'business_owner'
    where user_id = '00000000-0000-0000-0000-000000000017';
end $$;

-- =====================================================
-- POSTS (50 approved + 20 pending)
-- =====================================================

do $$
declare
  v_user_ids uuid[] := array[
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000011'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    '00000000-0000-0000-0000-000000000013'::uuid,
    '00000000-0000-0000-0000-000000000014'::uuid,
    '00000000-0000-0000-0000-000000000015'::uuid,
    '00000000-0000-0000-0000-000000000016'::uuid,
    '00000000-0000-0000-0000-000000000017'::uuid
  ];
  v_categories text[] := array[
    'Mekan Tavsiyeleri',
    'Nanny / Bakıcı',
    'Türkiye’den Getirenler',
    'Dubai’den Gönderenler',
    'İkinci El Pazarı',
    'İşletme & Sosyal Medya Tanıtımı'
  ];
  v_locations text[] := array[
    'Dubai Marina','Jumeirah','Downtown Dubai','Business Bay','Al Barsha','JVC','JLT','Mirdif',
    'Dubai Hills','Arabian Ranches','Palm Jumeirah','Dubai Silicon Oasis','Motor City','Diğer'
  ];
  v_titles text[] := array[
    'Çocukla gidilecek kahvaltı yeri arıyorum',
    'Uygun fiyatlı Türk restoranı önerisi',
    'Güvenilir bakıcı arayışındayım',
    'Türkiye’den ilaç getirecek kişi aranıyor',
    'Dubai’den İstanbul’a evrak göndermek istiyorum',
    'Az kullanılmış bebek arabası satılık',
    'Ev yemekleri siparişi alıyorum',
    'Türkçe konuşan kuaför tavsiyesi',
    'Ev temizliği yardımı arıyorum',
    'Yeni gelenler için SIM kart tavsiyesi',
    'Dubai’de Türk pastanesi',
    'Çocuk doktoru önerisi',
    'Haftalık yemek planı yapan aşçı',
    'Türkçe öğretmeni arıyorum',
    'Apartmandan apartmana taşıma yardımı',
    'İkinci el oyuncak ve kitap',
    'Ev içi yardımcı tavsiyesi',
    'Manikür/pedikür için Türk kuaför',
    'Spor salonu önerisi',
    'Bebek bezi toplu alım grubu',
    'Yarı zamanlı bakıcı arıyorum',
    'Hafta sonu kahvaltı kulübü',
    'İstanbul’dan Dubai’ye eşya yollama',
    'Çocuk parkı önerileri',
    'Türk marketi nerede?'
  ];
  v_descriptions text[] := array[
    'Selam herkese, hafta sonu için sakin ve çocuk dostu bir yer arıyorum. Tavsiyeleriniz için teşekkürler.',
    'Aile ortamına uygun, ev yapımı tatlar veren bir Türk restoranı önerebilir misiniz?',
    'Hafta içi 3 gün, 4 yaşında oğluma yardımcı olabilecek güvenilir bir bakıcı arıyorum.',
    'Önümüzdeki ay İstanbul’dan gelirken birkaç ilaç getirmeniz mümkün mü? Reçeteleri hazırlarım.',
    'Acil bir evrakı İstanbul’daki anneme yollamam lazım. Önümüzdeki hafta gidecek olan var mı?',
    'Az kullanılmış, çok temiz bebek arabası uygun fiyata satılık. Detaylar için yazabilirsiniz.',
    'Ev yapımı mantı, içli köfte, sarma ve tatlı siparişi alıyorum. Salı ve cuma teslim ediyorum.',
    'Türkçe konuşan, ev temizliği konusunda titiz bir kişi arıyoruz. Haftada 2 gün.',
    'Yeni geldim, bana SIM kart konusunda yardımcı olabilecek var mı? Hangi operatör daha uygun?',
    'Dubai’de Türk hamur işi ve tatlı yapan bir pastane var mı? Mahalle olarak Marina/JLT tercih ederim.',
    'Çocuğumuz için Türkçe konuşan bir çocuk doktoru tavsiyesine ihtiyacımız var.',
    'Haftalık menü çıkarıp eve gelen veya pişirip teslim eden Türk aşçı var mı?',
    '7 yaşında kızıma haftada 1-2 gün Türkçe çalıştıracak öğretmen arıyorum.',
    'Aynı bina içinde taşınma için yardımcı olabilecek ekip önerebilir misiniz?',
    'Çocuk oyuncakları, hikaye kitapları ve eğitici materyaller uygun fiyata satılık.',
    'Ev içi yardımcımız harika, başka aileye de zaman ayırabilir. İletişime geçebilirsiniz.',
    'JLT bölgesinde manikür/pedikür için Türk bir hanım tavsiyesi var mı?',
    'Marina ve civarında, Türk hocaların olduğu bir spor salonu önerisi olan?',
    'Bebek bezi ve ıslak mendil toplu alımıyla daha uygun fiyata almak ister misiniz?',
    'Sabah okula bırakma, öğleden sonra alma için yarı zamanlı bakıcı arıyorum.',
    'Hafta sonu Türk kahvaltısı için yeni bir grup kuralım, ilgilenen arkadaşlar yazsın.',
    'İstanbul’dan Dubai’ye küçük kargo gönderebilen biri var mı?',
    'Marina civarında 3-7 yaş çocuklar için temiz parklar önerebilir misiniz?',
    'Hangi bölgelerde Türk gıda ürünleri bulabileceğimiz market var?'
  ];
  i int;
  v_status public.content_status;
  v_featured boolean;
  v_title text;
  v_desc text;
  v_offset int;
begin
  for i in 1..70 loop
    v_status := case when i <= 50 then 'approved'::public.content_status else 'pending'::public.content_status end;
    v_featured := (v_status = 'approved' and i <= 8);

    v_title := v_titles[1 + ((i - 1) % array_length(v_titles, 1))];
    v_desc  := v_descriptions[1 + ((i - 1) % array_length(v_descriptions, 1))];
    v_offset := i;

    insert into public.posts (
      user_id, title, category, description, location, whatsapp_number, status, is_featured, source_type, created_at, updated_at
    ) values (
      v_user_ids[1 + ((i - 1) % array_length(v_user_ids, 1))],
      v_title || case when i > array_length(v_titles, 1) then ' (' || ((i / array_length(v_titles, 1)) + 1) || ')' else '' end,
      v_categories[1 + ((i - 1) % array_length(v_categories, 1))],
      v_desc,
      v_locations[1 + ((i - 1) % array_length(v_locations, 1))],
      '+971 5' || lpad((i % 9)::text, 1, '0') || ' ' || lpad((100 + i)::text, 3, '0') || ' ' || lpad((10 + (i % 80))::text, 2, '0') || ' ' || lpad((10 + (i % 70))::text, 2, '0'),
      v_status,
      v_featured,
      case when i % 17 = 0 then 'admin_curated'::public.source_type else 'user_submitted'::public.source_type end,
      now() - (v_offset || ' hours')::interval,
      now() - (v_offset || ' hours')::interval
    );
  end loop;
end $$;

-- =====================================================
-- BUSINESSES (30, 15 öne çıkan)
-- =====================================================

do $$
declare
  v_user_ids uuid[] := array[
    '00000000-0000-0000-0000-000000000017'::uuid, -- business_owner
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000011'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid
  ];
  v_names text[] := array[
    'İstanbul Mutfağı Dubai',
    'Anadolu Pide Evi',
    'Bosphorus Kuaför',
    'Türk Lokumu Cafe',
    'Marina Türk Pastanesi',
    'Dubai Türk Anaokulu',
    'Anneler Yardım Hattı',
    'Türk Doktor Kliniği',
    'Bebek & Çocuk Atölyesi',
    'JLT Türk Marketi',
    'Türkçe Logopedi Merkezi',
    'Mehtap Güzellik',
    'Dubai Çevirmen Ofisi',
    'Karadeniz Balık Lokantası',
    'Anadolu Antikacı',
    'Türk Spor Akademisi',
    'Marmara Emlak Danışmanlığı',
    'Türk Pet Bakımı',
    'Aile Hekimi - Dr. Ayşe',
    'Türk Hukuk Bürosu',
    'Ev Temizlik Hizmetleri',
    'Türk Diyetisyen Merkezi',
    'Çocuk Kuaförü Pamuk',
    'Türk Dans Stüdyosu',
    'Anadolu Gözlükçü',
    'Türk Foto Stüdyosu',
    'İstanbul Düğün Organizasyon',
    'Dubai Türk Tur',
    'Türk Bilgisayar Tamiri',
    'Anneler Kahve Evi'
  ];
  v_descriptions text[] := array[
    'Ev tadında Türk yemekleri, taze hamur işleri ve aile dostu ortam.',
    'Geleneksel Türk pidesi, lahmacun ve kebap çeşitleri.',
    'Türkçe konuşan, deneyimli kuaför ekibi ve aile dostu fiyatlar.',
    'Türk kahvesi, baklava ve özel tatlılarla samimi cafe.',
    'El yapımı pasta, kurabiye ve özel gün siparişleri.',
    'Türkçe eğitim veren, deneyimli öğretmenlerle anaokulu.',
    'Yeni doğum yapmış annelere yardım ve danışmanlık.',
    'Türkçe konuşan doktor kadrosuyla aile sağlığı hizmetleri.',
    'Çocuklara yönelik sanat ve oyun atölyesi.',
    'Türk gıda ürünleri ve günlük ev malzemeleri.',
    'Çocukların konuşma becerilerini desteklemek için Türkçe terapi.',
    'Saç, makyaj ve cilt bakımında profesyonel hizmet.',
    'Resmi belgeler için yeminli çevirmen.',
    'Taze deniz ürünleri ve Karadeniz mutfağı.',
    'Antika, vintage ve özel eşya alım/satım.',
    'Tekvando, jimnastik ve genel spor eğitimi.',
    'Apart, villa ve yatırım için Türkçe emlak danışmanlığı.',
    'Köpek/kedi bakımı, tıraş ve veteriner yönlendirmesi.',
    'Aile hekimliği, çocuk kontrolü ve genel sağlık.',
    'Hukuki danışmanlık, vize ve şirket kuruluşu desteği.',
    'Profesyonel temizlik ekibiyle haftalık/aylık hizmet.',
    'Beslenme planı, kilo yönetimi ve sağlıklı yaşam.',
    'Çocuklar için renkli, eğlenceli kuaför deneyimi.',
    'Halk dansları ve modern dans kursları.',
    'Reçeteli gözlük, lens ve aksesuar.',
    'Aile fotoğrafları ve özel gün çekimleri.',
    'Düğün, nişan ve kutlama organizasyonu.',
    'Türkçe rehberli şehir ve çöl turları.',
    'Bilgisayar, telefon ve tablet onarımı.',
    'Annelere özel sakin atmosferli kahve ve toplantı alanı.'
  ];
  v_categories text[] := array[
    'Yeme & İçme',
    'Güzellik & Bakım',
    'Eğitim',
    'Sağlık',
    'Çocuk',
    'Market',
    'Hizmet',
    'Emlak',
    'Etkinlik',
    'Spor'
  ];
  v_locations text[] := array[
    'Dubai Marina','Jumeirah','Downtown Dubai','Business Bay','Al Barsha','JVC','JLT','Mirdif',
    'Dubai Hills','Palm Jumeirah','Dubai Silicon Oasis','Motor City'
  ];
  i int;
  v_status public.content_status;
  v_featured boolean;
begin
  for i in 1..30 loop
    v_status := 'approved'::public.content_status;
    v_featured := i <= 15;

    insert into public.businesses (
      user_id, owner_name, business_name, description, category, instagram_url, tiktok_url,
      whatsapp_number, location, status, is_featured, source_type, created_at, updated_at
    ) values (
      v_user_ids[1 + ((i - 1) % array_length(v_user_ids, 1))],
      'Sahibi ' || i,
      v_names[i],
      v_descriptions[i],
      v_categories[1 + ((i - 1) % array_length(v_categories, 1))],
      'https://instagram.com/turkdubai_' || i,
      case when i % 3 = 0 then 'https://tiktok.com/@turkdubai_' || i else null end,
      '+971 5' || ((i % 9))::text || ' ' || lpad((200 + i)::text, 3, '0') || ' ' || lpad((10 + (i % 80))::text, 2, '0') || ' ' || lpad((20 + (i % 60))::text, 2, '0'),
      v_locations[1 + ((i - 1) % array_length(v_locations, 1))],
      v_status,
      v_featured,
      'user_submitted'::public.source_type,
      now() - (i || ' days')::interval,
      now() - (i || ' days')::interval
    );
  end loop;
end $$;

-- =====================================================
-- COMMUNITY TOPICS (20) + REPLIES (50)
-- =====================================================

do $$
declare
  v_user_ids uuid[] := array[
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000011'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    '00000000-0000-0000-0000-000000000013'::uuid,
    '00000000-0000-0000-0000-000000000014'::uuid,
    '00000000-0000-0000-0000-000000000015'::uuid,
    '00000000-0000-0000-0000-000000000016'::uuid
  ];
  v_user_names text[] := array[
    'Ayşe','Mehmet','Zeynep','Can','Elif','Burak','Selin'
  ];
  v_categories text[] := array[
    'Genel Sohbet','Yeni Gelenler','Anneler Kulübü','Mekan Önerileri','Bakıcı Arayanlar',
    'İkinci El','Türkiye’den Getirenler','Okul & Çocuk','Ev & Taşınma','Sağlık & Doktor'
  ];
  v_titles text[] := array[
    'Yeni geldim, nereden başlamalıyım?',
    'Anneler hafta sonu buluşması',
    'En iyi kahvaltı yerleri',
    'Güvenilir bakıcı önerileri',
    'İkinci el bebek eşyaları',
    'Türkiye’den getirilebilecekler',
    'Okul tavsiyeleri',
    'Ev kiralarken nelere dikkat?',
    'Türkçe konuşan doktorlar',
    'Marina’da park önerileri',
    'Sürücü belgesi nasıl alınır?',
    'Türk topluluğu etkinlikleri',
    'Acil ihtiyaç listesi',
    'Çocuk doğum günü mekanları',
    'Apartmandan ev önerisi',
    'Tatil için kısa kaçamak yerleri',
    'Yeni doğum yapan anneler',
    'Yaz tatili planlama',
    'Türk yemekleri öğrenmek',
    'Spor yapmak isteyen anneler'
  ];
  v_descriptions text[] := array[
    'Dubai’ye yeni taşındım, ilk haftada nelere dikkat etmeliyim?',
    'Cumartesi sabahı Marina’da kahvaltı için buluşmak ister misiniz?',
    'Hafta sonu için sakin ve aile dostu kahvaltı yerleri arıyorum.',
    '4 yaşındaki oğlum için hafta içi bakıcı arıyorum. Önerileri olan?',
    'Bebek arabası, beşik ve oyuncak satıyorum. İlgilenenler yazsın.',
    'Türkiye’den hangi ürünleri getirmek mantıklı? Listenizi paylaşır mısınız?',
    'Mirdif’te Türk öğrencilere uygun bir okul önerebilir misiniz?',
    'JVC’de ev tutarken karşılaştığım sorunları paylaşıyorum.',
    'Türkçe konuşan, ilgili bir aile hekimi tavsiyesi var mı?',
    'Marina civarında çocuk dostu güzel parklar?',
    'Dubai’de ehliyet süreci nasıl ilerliyor? Süreç ne kadar sürdü?',
    'Önümüzdeki ay piknik organize ediyoruz, katılmak ister misiniz?',
    'Yeni gelenlerin hazır bulundurması gereken acil eşya listesi.',
    '4 yaşındaki kızıma sürpriz doğum günü için mekan önerileri?',
    '2+1 daireden müstakil eve geçenlerin deneyimi nasıl?',
    '3 günlük tatil için yakın ülkelerde gidilecek yerler?',
    'Yeni doğum yapan anneler için destek grubu kuruyoruz.',
    'Yaz tatilinde çocuklarla nereye gidilir? Bütçe önerileri?',
    'Geleneksel Türk yemeklerini öğretecek hocalar var mı?',
    'Sabah saatlerinde birlikte yürüyüş yapacak anneler arıyorum.'
  ];
  v_replies text[] := array[
    'Aynı durumdayım, paylaşımlar için çok teşekkürler!',
    'Marina’da çok güzel bir yer biliyorum, mesaj atayım.',
    'Biz de aynı arayıştayız, lütfen önerileri burada toparlayalım.',
    'Bir kişi önereyim, isim verirsem rahatsız olur mu acaba?',
    'Geçen ay aynı sorunu yaşadım, çözümümü yazıyorum.',
    'Buraya yeni katıldım ama elimden gelirse yardımcı olurum.',
    'Yarın akşam müsait olan var mı? Sesli sohbet edelim.',
    'Çok güzel bir konu, ben de takip ediyorum.',
    'Önerileriniz çok değerli, herkese teşekkürler.',
    'Mesaj attım, müsait olduğunda yanıtlarsan sevinirim.'
  ];
  v_locations text[] := array[
    'Dubai Marina','Jumeirah','Downtown Dubai','Business Bay','Al Barsha','JVC','JLT','Mirdif','Dubai Hills','Palm Jumeirah'
  ];
  v_topic_ids uuid[];
  v_topic_id uuid;
  i int;
  j int;
  v_user_idx int;
begin
  for i in 1..20 loop
    v_topic_id := gen_random_uuid();
    v_topic_ids := array_append(v_topic_ids, v_topic_id);
    v_user_idx := 1 + ((i - 1) % array_length(v_user_ids, 1));

    insert into public.community_topics (
      id, user_id, user_name, title, category, description, location, status, is_featured, source_type, created_at, updated_at, last_activity_at
    ) values (
      v_topic_id,
      v_user_ids[v_user_idx],
      v_user_names[v_user_idx],
      v_titles[i],
      v_categories[1 + ((i - 1) % array_length(v_categories, 1))],
      v_descriptions[i],
      v_locations[1 + ((i - 1) % array_length(v_locations, 1))],
      'approved'::public.content_status,
      i <= 4,
      'user_submitted'::public.source_type,
      now() - (i || ' days')::interval,
      now() - (i || ' days')::interval,
      now() - (i || ' hours')::interval
    );
  end loop;

  -- 50 cevap üret
  for j in 1..50 loop
    v_user_idx := 1 + ((j - 1) % array_length(v_user_ids, 1));
    insert into public.community_replies (
      topic_id, user_id, user_name, message, status, created_at, updated_at
    ) values (
      v_topic_ids[1 + ((j - 1) % array_length(v_topic_ids, 1))],
      v_user_ids[v_user_idx],
      v_user_names[v_user_idx],
      v_replies[1 + ((j - 1) % array_length(v_replies, 1))],
      'approved'::public.content_status,
      now() - ((50 - j) || ' hours')::interval,
      now() - ((50 - j) || ' hours')::interval
    );
  end loop;
end $$;

-- =====================================================
-- RECOMMENDATIONS (30)
-- =====================================================

do $$
declare
  v_user_ids uuid[] := array[
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000011'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    '00000000-0000-0000-0000-000000000013'::uuid,
    '00000000-0000-0000-0000-000000000014'::uuid
  ];
  v_titles text[] := array[
    'Marina’da harika bir kahvaltıcı','Çocuk dostu pediatrist','Türkçe terapi merkezi',
    'Uygun fiyatlı kuaför','Güvenilir ev temizliği','Türkçe konuşan veteriner',
    'Sevdiğim Türk fırını','Çocuklar için müzik kursu','Türk diyetisyen','Türkçe konuşan psikolog',
    'Kaliteli ev yemeği servisi','Sosyal medya fotoğrafçısı','Türk avukat tavsiyesi',
    'Çocuk için Türkçe öğretmen','Ev taşıma firması','Tasarımcı','Apartmanda küçük kuaför',
    'Hızlı kargo','Çocuk dansı','Dijital pazarlama danışmanı','Düğün hazırlığı',
    'Anaokulu önerisi','Bebek bakım ürünleri','Marka tasarım','Cilt bakım uzmanı',
    'Tatlıcı','Plak/dekor tamiri','Klima servisi','Spa önerisi','Resim atölyesi'
  ];
  v_descriptions text[] := array[
    'Aileyle gittik, herkes çok memnun kaldı. Servisi de güzeldi.',
    'Türkçe konuşması ve sabırlı yaklaşımı bizi çok rahatlattı.',
    'Çocuğumuzun gelişimine çok faydası oldu, gönül rahatlığıyla öneririm.',
    'Hem fiyatı uygun hem de işinde çok iyiler.',
    'Düzenli ve titiz çalışıyor, güvenilir bir ekip.',
    'Veteriner hayvan dostu ve detaylı bilgi veriyor.',
    'Taze ürünler ve tam Türkiye’deki gibi lezzet.',
    'Hocalar çok ilgili, çocuğumuz çok keyif aldı.',
    'Bireysel plan çıkardı, sonuçlar harika.',
    'Profesyonel ve güven veren bir uzman.',
    'Hafta içi siparişler hızla geliyor, ev tadında.',
    'Doğal ışıkla harika çekimler yaptı, çok memnun kaldık.',
    'Vize ve şirket konusunda çok ayrıntılı yardım etti.',
    'Çocuğum çok keyif alıyor ve konuşma seviyesi arttı.',
    'Eşyalara çok özen gösterdiler, tavsiye ediyorum.',
    'Markamız için yaptığı tasarımlar çok beğenildi.',
    'Apartman içinde, hızlı ve kaliteli hizmet.',
    'Aynı gün teslim ediyorlar, fiyatları da uygun.',
    'Çocuğum çok eğleniyor, hocalar çok ilgili.',
    'Sosyal medya yönetimimizde çok değer kattı.',
    'Detaylı planlama ile düğünümüz çok güzel geçti.',
    'Çocuğumuz çok mutlu, öğretmenler çok ilgili.',
    'Doğal ürünler kullanıyor ve cilt için çok iyi.',
    'Logo ve kurumsal kimlik konusunda harika çalışma.',
    'Cilt sorunlarımız için çözüm odaklı çalışıyor.',
    'Özel günler için sipariş alıyor, tatlar harika.',
    'Eski mobilyaları neredeyse yeni gibi yaptı.',
    'Hızlı geldi, fiyatı uygun ve dürüst bir usta.',
    'Sakin ve rahatlatıcı bir spa deneyimi.',
    'Çocuklar için yaratıcı resim atölyeleri.'
  ];
  v_categories text[] := array['Yeme & İçme','Sağlık','Eğitim','Güzellik','Hizmet','Çocuk','Etkinlik'];
  v_locations text[] := array['Dubai Marina','Jumeirah','Downtown Dubai','Business Bay','Al Barsha','JVC','JLT','Palm Jumeirah','Dubai Hills'];
  i int;
  v_status public.content_status;
  v_source public.source_type;
begin
  for i in 1..30 loop
    v_status := case when i % 6 = 0 then 'pending'::public.content_status else 'approved'::public.content_status end;
    v_source := case when i % 5 = 0 then 'whatsapp_summary'::public.source_type else 'user_submitted'::public.source_type end;

    insert into public.recommendations (
      user_id, title, category, description, location, instagram_url, whatsapp_number,
      display_name, show_name, status, source_type, created_at, updated_at
    ) values (
      case when v_source = 'whatsapp_summary' then null else v_user_ids[1 + ((i - 1) % array_length(v_user_ids, 1))] end,
      v_titles[i],
      v_categories[1 + ((i - 1) % array_length(v_categories, 1))],
      v_descriptions[i],
      v_locations[1 + ((i - 1) % array_length(v_locations, 1))],
      case when i % 3 = 0 then 'https://instagram.com/onerilen_' || i else null end,
      case when i % 4 = 0 then '+971 5' || ((i % 9))::text || ' *** ** ' || lpad((10 + (i % 60))::text, 2, '0') else null end,
      case when i % 2 = 0 then 'Ayşe Y.' else null end,
      i % 2 = 0,
      v_status,
      v_source,
      now() - (i || ' days')::interval,
      now() - (i || ' days')::interval
    );
  end loop;
end $$;

-- =====================================================
-- REPORTS (5)
-- =====================================================

do $$
declare
  v_target uuid;
  v_user uuid := '00000000-0000-0000-0000-000000000010';
  reasons text[] := array['Yanıltıcı içerik','Uygunsuz dil','Spam reklam','Çift ilan','Kişisel veri paylaşımı'];
  i int;
begin
  for i in 1..5 loop
    select id into v_target from public.posts where status = 'approved' order by random() limit 1;
    if v_target is not null then
      insert into public.reports (user_id, item_type, item_id, reason, description, status)
      values (
        v_user,
        'post'::public.item_type,
        v_target,
        reasons[i],
        'Topluluk kurallarına aykırı olabilir, lütfen kontrol edin.',
        'pending'::public.report_status
      );
    end if;
  end loop;
end $$;
