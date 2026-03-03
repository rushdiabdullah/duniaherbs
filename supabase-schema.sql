-- ============================
-- DuniaHerbs Database Schema
-- Run this in Supabase SQL Editor
-- ============================

-- 1. Site content (hero, about, etc.)
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default content — SEMUA teks yang dipaparkan di website
INSERT INTO site_content (id, value) VALUES
  -- ═══════════════════════════════════════
  -- HERO (bahagian paling atas homepage)
  -- ═══════════════════════════════════════
  ('hero_badge', '20 Tahun di Pasaran Malaysia'),
  ('hero_subtitle', 'Dunia Herbs • Trusted Since 2005'),
  ('hero_title', 'Memang Mustajab'),
  ('hero_description', 'Lotion Mustajab Pati Halia — produk #1 herba halia di Malaysia. KKM & Halal JAKIM.'),
  ('hero_image', ''),
  ('hero_cta_whatsapp', 'WhatsApp Kami'),
  ('hero_cta_produk', 'Lihat Produk'),

  -- ═══════════════════════════════════════
  -- DUTA (seksyen video duta di homepage)
  -- ═══════════════════════════════════════
  ('duta_label', 'Duta Rasmi'),
  ('duta_title', 'Fasha Sandha × Dunia Herbs'),
  ('duta_desc', 'Tonton video eksklusif daripada duta rasmi kami — Fasha Sandha'),
  ('duta_link_text', 'Lihat landing page khas Fasha →'),

  -- ═══════════════════════════════════════
  -- PRODUK (tajuk seksyen produk homepage)
  -- ═══════════════════════════════════════
  ('produk_label', 'Koleksi Unggulan'),
  ('produk_title', 'Produk Mustajab'),
  ('produk_subtitle', 'Lotion pati halia 130ml — luaran sahaja'),

  -- ═══════════════════════════════════════
  -- SEJARAH (tajuk timeline di homepage)
  -- ═══════════════════════════════════════
  ('sejarah_label', 'Legasi Kami'),
  ('sejarah_title', 'Sejak 2005'),

  -- ═══════════════════════════════════════
  -- TESTIMONIAL (tajuk seksyen testimoni)
  -- ═══════════════════════════════════════
  ('testimonial_label', 'Kata Pelanggan'),
  ('testimonial_title', 'Dipercayai Ramai'),

  -- ═══════════════════════════════════════
  -- BENEFITS (5 kebaikan di homepage)
  -- ═══════════════════════════════════════
  ('benefits_label', 'Khasiat Semula Jadi'),
  ('benefits_title', 'Kebaikan'),
  ('benefits_subtitle', 'Multi-purpose lotion untuk seluruh keluarga'),
  ('benefit_1_icon', '🩹'),
  ('benefit_1_title', 'Ketidakselesaan sendi & otot'),
  ('benefit_1_desc', 'Membantu melegakan ketidakselesaan dengan pati halia semula jadi'),
  ('benefit_2_icon', '🔥'),
  ('benefit_2_title', 'Bakar lemak'),
  ('benefit_2_desc', 'Bantu proses pembakaran lemak & shaping'),
  ('benefit_3_icon', '🤱'),
  ('benefit_3_title', 'Ibu bersalin'),
  ('benefit_3_desc', 'Sesuai untuk urutan postpartum'),
  ('benefit_4_icon', '✨'),
  ('benefit_4_title', 'Selulit & kedut'),
  ('benefit_4_desc', 'Kurangkan penampilan selulit'),
  ('benefit_5_icon', '🩸'),
  ('benefit_5_title', 'Senggugut'),
  ('benefit_5_desc', 'Legakan kekejangan & kembung perut'),

  -- ═══════════════════════════════════════
  -- CUSTOMER SERVICE (seksyen CS homepage)
  -- ═══════════════════════════════════════
  ('cs_label', 'Sokongan Pelanggan'),
  ('cs_title', 'Customer Service'),
  ('cs_subtitle', 'Kami sedia membantu — tanya apa sahaja'),
  ('faq_preview_title', 'Soalan lazim'),
  ('faq_link_text', 'Lihat semua FAQ'),

  -- ═══════════════════════════════════════
  -- FOOTER (paling bawah setiap halaman)
  -- ═══════════════════════════════════════
  ('footer_tagline', 'Memang Mustajab • 20 Tahun Legenda • www.duniaherbs.com.my'),
  ('footer_brand_desc', 'Memang Mustajab — Perintis lotion pati halia di Malaysia sejak 2005. KKM & Halal JAKIM.'),
  ('footer_copyright', '© {year} Dunia Herbs. Hak cipta terpelihara.'),
  ('footer_website', 'www.duniaherbs.com.my'),

  -- ═══════════════════════════════════════
  -- MARQUEE (teks bergerak di homepage)
  -- ═══════════════════════════════════════
  ('marquee_items', 'Halal JAKIM|KKM Diluluskan|20+ Tahun Legenda|40+ Stockist|Perintis Lotion Halia Malaysia|Eksport ke Arab Saudi|Produk Semula Jadi|Memang Mustajab'),

  -- ═══════════════════════════════════════
  -- COUNTER (angka statistik animasi)
  -- ═══════════════════════════════════════
  ('counter_stats', '{"stats":[{"value":20,"suffix":"+","label":"Tahun di Pasaran"},{"value":40,"suffix":"+","label":"Stockist Seluruh Dunia"},{"value":80,"suffix":"K+","label":"Pelanggan Setia"},{"value":8,"suffix":"","label":"Variasi Produk"}]}'),

  -- ═══════════════════════════════════════
  -- VIDEO
  -- ═══════════════════════════════════════
  ('video_url', ''),

  -- ═══════════════════════════════════════
  -- CONTACT & SOCIAL MEDIA
  -- ═══════════════════════════════════════
  ('whatsapp', '60123456789'),
  ('instagram', 'https://www.instagram.com/duniaherbsofficial'),
  ('tiktok', 'https://www.tiktok.com/@duniaherbsofficial'),
  ('facebook', 'https://www.facebook.com/DuniaHerbsOfficial'),

  -- ═══════════════════════════════════════
  -- ABOUT (halaman /tentang)
  -- ═══════════════════════════════════════
  ('about_quote', 'Saya mulakan Dunia Herbs selepas lebih 20 tahun mencuba pelbagai bisnes. Apa yang bermula dari kegagalan, menjadi kekuatan. Setiap botol Lotion Mustajab mengandungi semangat untuk membantu orang lain.'),
  ('about_founder', 'Rushdi Abdullah'),
  ('about_description', 'Bermula dari kegigihan seorang usahawan Malaysia, Dunia Herbs diasaskan dengan satu matlamat — menghasilkan produk herba semula jadi yang benar-benar berkesan. Lebih 20 tahun kemudian, Lotion Mustajab Pati Halia telah menjadi legenda di pasaran Malaysia.'),

  -- ═══════════════════════════════════════
  -- POLISI (halaman /polisi)
  -- ═══════════════════════════════════════
  ('polisi_privacy', 'Dunia Herbs menghormati privasi pelanggan kami. Maklumat peribadi yang dikumpul (nama, telefon, alamat) hanya digunakan untuk tujuan penghantaran dan komunikasi berkaitan pesanan.\n\nKami tidak akan menjual, menyewa atau berkongsi maklumat peribadi anda kepada pihak ketiga tanpa kebenaran.\n\nData pembayaran diproses melalui gateway pembayaran yang selamat dan tidak disimpan oleh kami.'),
  ('polisi_shipping', 'Semenanjung Malaysia: 2–5 hari bekerja.\nSabah & Sarawak: 5–10 hari bekerja.\nSingapura: 3–7 hari bekerja (melalui stockist).\n\nKos penghantaran bergantung kepada lokasi dan berat bungkusan. Penghantaran percuma mungkin ditawarkan untuk pesanan melebihi jumlah tertentu.'),
  ('polisi_return', 'Pemulangan diterima dalam tempoh 7 hari dari tarikh penerimaan, tertakluk kepada syarat berikut:\n• Produk belum dibuka dan dalam keadaan asal.\n• Bungkusan tidak rosak.\n• Resit atau bukti pembelian disertakan.\n\nUntuk memulakan pemulangan, hubungi kami melalui email admin@duniaherbs.com.my.'),
  ('polisi_cookie', 'Laman web ini mungkin menyimpan data di peranti anda (cookies atau localStorage) untuk fungsi asas seperti troli beli-belah dan maklumat checkout.\n\n• Data troli & maklumat pelanggan disimpan dalam penyemak imbas anda (localStorage) — hanya untuk memudahkan pembelian anda.\n\n• Kami tidak menggunakan cookies untuk iklan atau penjejakan pihak ketiga.\n\n• Anda boleh kosongkan data dengan mengosongkan troli atau menghapus data laman web dalam tetapan penyemak imbas anda.\n\nUntuk maklumat lanjut, rujuk Polisi Privasi kami.'),
  ('polisi_terms', 'Dengan menggunakan laman web Dunia Herbs (www.duniaherbs.com.my), anda bersetuju dengan syarat-syarat berikut:\n\n1. Penggunaan laman web\nAnda bersetuju menggunakan laman ini untuk tujuan yang sah sahaja. Dilarang menyalahgunakan kandungan, sistem atau maklumat kami.\n\n2. Pesanan & pembayaran\nPesanan tertakluk kepada ketersediaan stok. Harga yang dipaparkan adalah muktamad pada masa checkout. Pembayaran diproses melalui gateway yang selamat (Billplz).\n\n3. Ketepatan maklumat\nAnda bertanggungjawab memastikan maklumat penghantaran dan pembayaran yang diberikan adalah tepat.\n\n4. Had liabiliti\nDunia Herbs tidak bertanggungjawab atas kerosakan tidak langsung akibat penggunaan laman web atau produk. Produk kami untuk kegunaan luaran sahaja — rujuk doktor untuk nasihat kesihatan.\n\n5. Perubahan\nKami berhak mengemas kini polisi dan syarat ini dari semasa ke semasa. Perubahan akan dipaparkan di halaman ini.\n\n6. Undang-undang\nSyarat ini tertakluk kepada undang-undang Malaysia. Sebarang pertikaian akan diselesaikan di mahkamah Malaysia.\n\nHubungi kami: admin@duniaherbs.com.my'),
  ('polisi_usage', 'Semua produk Dunia Herbs adalah untuk kegunaan luaran sahaja.\n\nTidak sesuai untuk bayi dan kanak-kanak kecil.\n\nSila rujuk doktor jika anda mengandung atau mempunyai keadaan kulit yang sensitif sebelum menggunakan produk ini.\n\nHentikan penggunaan jika berlaku kerengsaan kulit.'),

  -- ═══════════════════════════════════════
  -- FASHA LANDING PAGE (/fasha)
  -- ═══════════════════════════════════════
  ('fasha_visible', '1'),
  ('fasha_hero_image', 'https://upload.wikimedia.org/wikipedia/commons/0/04/Fasha_Sandha_on_MeleTOP.jpg'),
  ('fasha_hero_badge', 'Duta Rasmi Dunia Herbs'),
  ('fasha_hero_title', 'Fasha Sandha'),
  ('fasha_hero_subtitle', '× Dunia Herbs'),
  ('fasha_hero_description', 'Pelakon & selebriti terkenal Malaysia. Fasha sendiri pilih dan percayai Lotion Mustajab — produk pati halia #1 di Malaysia sejak 2005.'),
  ('fasha_quote', 'Saya pilih Dunia Herbs sebab produk ni memang proven — 20 tahun di pasaran, halal, dan berkesan. Sesuai untuk urutan berpantang dan rutin harian.'),
  ('fasha_cta_title', 'Ikut Pilihan Fasha'),
  ('fasha_cta_subtitle', 'Order sekarang melalui WhatsApp atau platform pilihan anda.'),
  ('fasha_picks', '')
ON CONFLICT (id) DO NOTHING;

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  badge TEXT DEFAULT '',
  heat TEXT DEFAULT 'Mild',
  size TEXT DEFAULT '130ml',
  description TEXT DEFAULT '',
  benefits TEXT[] DEFAULT '{}',
  usage_info TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  packaging_color TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default products (8 variasi Lotion Mustajab)
INSERT INTO products (name, tagline, price, badge, heat, size, description, benefits, usage_info, sort_order) VALUES
  ('Lotion Mustajab Pati Halia', 'Multi-purpose • Sesuai ibu bersalin', 'RM 22.90', 'Bestseller', 'Mild', '130ml',
   'Lotion Mustajab Pati Halia ialah produk perintis Dunia Herbs yang telah menjadi kegemaran ramai selama lebih 20 tahun. Formula pati halia semula jadi yang mudah diserap, tidak berminyak dan sesuai untuk seluruh keluarga termasuk ibu bersalin.',
   ARRAY['Membantu melegakan ketidakselesaan sendi & otot','Sesuai untuk urutan postpartum','Kurangkan kembung perut','Mudah diserap, tidak berminyak'],
   'Sapu pada bahagian yang dikehendaki — sendi, otot atau abdomen. Untuk luaran sahaja. Tidak sesuai untuk bayi.', 1),

  ('Lotion Mustajab Lime & Ginger', 'Pati halia + limau nipis', 'RM 22.90', '', 'Mild', '130ml',
   'Gabungan pati halia dan limau nipis untuk kesan yang menyegarkan. Multi-purpose lotion yang sesuai untuk sendi, otot dan abdomen.',
   ARRAY['Gabungan halia & limau nipis','Segar dan menyegarkan','Membantu melegakan ketidakselesaan sendi & otot','Sesuai untuk seluruh keluarga'],
   'Sapu pada sendi, otot atau abdomen. Untuk luaran sahaja. Tidak sesuai untuk bayi.', 2),

  ('Lotion Mustajab Super Hot', 'Dengan capsicum • Untuk workout', 'RM 24.90', 'Popular', 'Hot', '130ml',
   'Diformulasi khas dengan capsicum untuk tahap kehangatan yang lebih tinggi. Sesuai untuk workout, sukan lasak dan mereka yang mahukan kesan haba yang lebih kuat.',
   ARRAY['Capsicum untuk haba maksimum','Sesuai untuk workout & sukan','Bantu proses pembakaran lemak','Kehangatan tahan lama'],
   'Sapu sebelum atau selepas senaman. Untuk luaran sahaja. Elakkan kawasan sensitif.', 3),

  ('Lotion Mustajab Extra Hot', 'Shaping • Extra halia', 'RM 23.90', '', 'Hot', '130ml',
   'Versi extra hot dengan kandungan halia yang lebih pekat. Fokus pada shaping dan pembakaran lemak dengan kehangatan yang berterusan.',
   ARRAY['Extra halia untuk kesan lebih kuat','Fokus shaping & pembakaran lemak','Kurangkan penampilan selulit','Kehangatan secara beransur-ansur'],
   'Sapu pada abdomen dan kawasan yang ingin dibentuk. Untuk luaran sahaja.', 4),

  ('Lotion Mustajab Extreme Hot', 'Kepanasan maksimum • Untuk sukan lasak', 'RM 25.90', 'Terbaru', 'Extreme', '130ml',
   'Tahap kehangatan paling tinggi dalam rangkaian Mustajab. Diformulasi untuk atlet dan peminat sukan lasak yang memerlukan kesan haba yang intens.',
   ARRAY['Kehangatan tahap maksimum','Untuk sukan lasak & atlet','Pembakaran lemak intensif','Legakan otot selepas senaman berat'],
   'Sapu pada otot sebelum/selepas sukan lasak. Untuk luaran sahaja. Elakkan kawasan sensitif.', 5),

  ('Lotion Mustajab Extra Ginger', 'Halia berganda • Kehidupan aktif', 'RM 23.90', '', 'Hot', '130ml',
   'Mengandungi halia berganda untuk mereka yang menjalani kehidupan aktif. Kehangatan yang berpanjangan tanpa rasa berminyak.',
   ARRAY['Halia berganda untuk kesan lebih','Sesuai untuk kehidupan aktif','Tidak berminyak, mudah diserap','Kehangatan berpanjangan'],
   'Sapu pada sendi dan otot. Untuk luaran sahaja.', 6),

  ('Lotion Mustajab Pati Halia 65ml', 'Saiz mini • Travel size', 'RM 14.90', 'Jimat', 'Mild', '65ml',
   'Produk Pati Halia saiz mini 65ml. Limited — bukan semua jenis ada. Senang bawa, sesuai try dulu atau travel.',
   ARRAY['Saiz mini 65ml','Limited','Formula sama dengan Pati Halia 130ml','Senang bawa'],
   'Sapu pada sendi, otot atau abdomen. Untuk luaran sahaja. Tidak sesuai untuk bayi.', 7),

  ('Lotion Mustajab Super Hot 65ml', 'Saiz mini • Capsicum workout', 'RM 15.90', '', 'Hot', '65ml',
   'Versi Super Hot saiz mini 65ml. Limited. Capsicum untuk kehangatan maksimum, senang bawa.',
   ARRAY['Saiz mini 65ml','Limited','Capsicum untuk haba kuat','Travel size'],
   'Sapu sebelum atau selepas senaman. Untuk luaran sahaja. Elakkan kawasan sensitif.', 8);

-- 3. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT DEFAULT '',
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO testimonials (quote, author, role, sort_order) VALUES
  ('Produk ni memang berkesan. Saya guna untuk ketidakselesaan lutut, lega dalam masa singkat.', 'Siti A.', 'Pelanggan sejak 2019', 1),
  ('Lotion Mustajab pilihan keluarga kami. Halal, selamat dan berkesan.', 'Ahmad R.', 'Bapa 3 anak', 2),
  ('Lepas bersalin saya guna Pati Halia. Memang mustajab untuk urutan badan.', 'Nurul H.', 'Ibu baru', 3),
  ('Saya pakai Super Hot sebelum gym. Badan cepat panas, peluh lebih banyak.', 'Faizal M.', 'Gym enthusiast', 4),
  ('Dah 5 tahun guna. Satu keluarga pakai produk ni — dari nenek sampai cucu.', 'Aminah Y.', 'Pelanggan setia', 5),
  ('Ketidakselesaan pinggang saya kurang selepas seminggu guna. Recommended sangat!', 'Rahman K.', 'Pemandu lori', 6),
  ('Produk halal dan selamat. Saya percaya Dunia Herbs sejak dulu lagi.', 'Zainab S.', 'Surirumah', 7),
  ('Extreme Hot memang gila panas! Sesuai lepas main futsal. Otot tak cramp.', 'Izzat D.', 'Pemain futsal', 8),
  ('Mak saya yang recommend. Sekarang saya pun dah jadi pelanggan tetap!', 'Haslinda W.', 'Pelanggan sejak 2021', 9),
  ('Bau wangi halia, tak melekit. Memang selesa pakai setiap hari.', 'Kamal J.', 'Pekerja pejabat', 10),
  ('Saya beli untuk ibu. Dia kata ketidakselesaan sendi dah kurang banyak. Terbaik!', 'Liyana T.', 'Anak yang prihatin', 11),
  ('Guna masa mengandung pun selamat. Doktor kata OK sebab luaran sahaja.', 'Farihah N.', 'Ibu mengandung', 12),
  ('Kawan office semua dah mula pakai. Viral sebab memang berkesan.', 'Daniel L.', 'Eksekutif IT', 13),
  ('Saya runner. Lepas lari 10km, sapu lotion ni terus rasa lega otot kaki.', 'Syafiq B.', 'Pelari marathon', 14),
  ('Dulu selalu pergi urut. Sekarang jimat, pakai Dunia Herbs je dah cukup.', 'Rokiah M.', 'Pesara kerajaan', 15),
  ('Packaging cantik, kualiti terjamin. Sesuai buat hadiah untuk orang tersayang.', 'Aiman Z.', 'Pembeli pertama', 16);

-- 4. FAQ
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Adakah produk Dunia Herbs halal?', 'Ya, semua produk diluluskan Halal oleh JAKIM dan KKM.', 1),
  ('Bagaimana cara menggunakan Lotion Mustajab?', 'Sapu pada sendi, otot atau abdomen. Untuk luaran sahaja. Jangan guna pada bayi.', 2),
  ('Berapa lama masa penghantaran?', '2–5 hari bekerja (Semenanjung Malaysia). Sabah/Sarawak mungkin lebih lama.', 3),
  ('Apakah perbezaan antara Super Hot dan Extra Hot?', 'Super Hot mengandungi capsicum, sesuai untuk workout. Extra Hot lebih fokus pada shaping dengan extra halia.', 4),
  ('Bolehkah ibu mengandung guna?', 'Sesuai untuk ibu bersalin (postpartum). Sila rujuk doktor jika mengandung.', 5),
  ('Bagaimana nak hubungi customer service?', 'WhatsApp kami atau gunakan ChatBot di laman utama. Kami jawab dalam BM.', 6);

-- 5. Stockists
CREATE TABLE IF NOT EXISTS stockists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT DEFAULT '',
  type TEXT DEFAULT '',
  region TEXT NOT NULL DEFAULT 'Semenanjung Malaysia',
  url TEXT DEFAULT '',
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO stockists (name, area, type, region, url, sort_order) VALUES
  ('R Pharmacy', 'Pelbagai cawangan seluruh Malaysia', 'Farmasi', 'Semenanjung Malaysia', '', 1),
  ('Alpro Pharmacy', 'Pelbagai cawangan seluruh Malaysia', 'Farmasi', 'Semenanjung Malaysia', '', 2),
  ('Kaisar Pharmacy', 'Pelbagai cawangan', 'Farmasi', 'Semenanjung Malaysia', '', 3),
  ('Permata Herba', 'Online & kedai', 'Herba', 'Semenanjung Malaysia', '', 4),
  ('Shopee Malaysia', 'Cari "Dunia Herbs Lotion Mustajab"', 'Online', 'Semenanjung Malaysia', 'https://shopee.com.my/search?keyword=dunia%20herbs%20losyen%20mustajab', 5),
  ('Lazada Malaysia', 'Cari "Dunia Herbs Lotion Mustajab"', 'Online', 'Semenanjung Malaysia', 'https://www.lazada.com.my/tag/dunia-herb-losyen-mustajab/', 6),
  ('TikTok Shop', '@duniaherbsofficial', 'Online', 'Semenanjung Malaysia', 'https://www.tiktok.com/@duniaherbsofficial', 7),
  ('Al Barakah Health & Beauty Mart', 'Online & kedai — Singapura', 'Herba', 'Singapura', '', 8),
  ('Stockist Arab Saudi', 'Eksport sejak 2014', 'Eksport', 'Antarabangsa', '', 9);

-- 6. Timeline / milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO milestones (year, title, description, sort_order) VALUES
  ('2005', 'Pelancaran', 'Lotion Mustajab Pati Halia dilancarkan oleh Rushdi Abdullah — perintis lotion halia di Malaysia.', 1),
  ('2008', 'Pengembangan', 'Rangkaian produk berkembang — Super Hot dan Extra Hot diperkenalkan.', 2),
  ('2012', 'Farmasi', 'Produk mula dijual di rangkaian farmasi seluruh Malaysia — R Pharmacy, Alpro, Kaisar.', 3),
  ('2014', 'Eksport', 'Produk memasuki pasaran Arab Saudi — jenama pertama lotion halia Malaysia di Timur Tengah.', 4),
  ('2018', 'Singapura', 'Al Barakah Health & Beauty Mart mula menjadi stockist rasmi di Singapura.', 5),
  ('2022', 'Digital', 'Pelancaran di Shopee, Lazada dan TikTok Shop — memudahkan pembelian online.', 6),
  ('2024', '20 Tahun', '40+ stockist, 80K+ pelanggan setia, 8 variasi produk — dipercayai generasi.', 7),
  ('2025', 'Fasha Sandha', 'Fasha Sandha dilantik sebagai duta rasmi Dunia Herbs.', 8);

-- 7. Videos (duta, demo, etc.)
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT 'Duta Dunia Herbs',
  video_url TEXT NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'duta',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO videos (title, label, video_url, sort_order, type) VALUES
  ('Duta 1', 'Duta Dunia Herbs', '/IMG_0587.MP4', 1, 'duta'),
  ('Duta 2', 'Duta Dunia Herbs', '/IMG_0596.MP4', 2, 'duta'),
  ('Duta 3', 'Duta Dunia Herbs', '/IMG_0605.MP4', 3, 'duta'),
  ('Duta 4', 'Duta Dunia Herbs', '/IMG_0611.MP4', 4, 'duta'),
  ('Duta 5', 'Duta Dunia Herbs', '/IMG_0587.MP4', 5, 'duta'),
  ('Duta 6', 'Duta Dunia Herbs', '/IMG_0596.MP4', 6, 'duta'),
  ('Duta 7', 'Duta Dunia Herbs', '/IMG_0605.MP4', 7, 'duta'),
  ('Iklan 1', 'Iklan Dunia Herbs', '/IMG_0587.MP4', 1, 'iklan'),
  ('Iklan 2', 'Iklan Dunia Herbs', '/IMG_0596.MP4', 2, 'iklan'),
  ('Iklan 3', 'Iklan Dunia Herbs', '/IMG_0605.MP4', 3, 'iklan'),
  ('Iklan 4', 'Iklan Dunia Herbs', '/IMG_0611.MP4', 4, 'iklan'),
  ('Iklan 5', 'Iklan Dunia Herbs', '/IMG_0587.MP4', 5, 'iklan'),
  ('Iklan 6', 'Iklan Dunia Herbs', '/IMG_0596.MP4', 6, 'iklan'),
  ('Iklan 7', 'Iklan Dunia Herbs', '/IMG_0605.MP4', 7, 'iklan'),
  ('Iklan 8', 'Iklan Dunia Herbs', '/IMG_0611.MP4', 8, 'iklan');

-- 8. Knowledge Base (for AI chatbot reference)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'Umum',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO knowledge_base (category, title, content, sort_order) VALUES
  ('Produk', 'Apa itu Lotion Mustajab?', 'Lotion Mustajab ialah produk lotion pati halia pertama di Malaysia, dilancarkan pada 2005. Ia diperbuat daripada pati halia tulen 100% semula jadi. Untuk kegunaan LUARAN sahaja. Diluluskan Halal JAKIM dan KKM.', 1),
  ('Produk', 'Rangkaian Produk', 'Ada 8 variasi: Pati Halia (Mild), Lime & Ginger (Mild), Super Hot (Hot, ada capsicum), Extra Hot (Hot, fokus shaping), Extreme Hot (Extreme, paling panas), Extra Ginger (Hot, halia berganda), Pati Halia 65ml (saiz mini, limited), Super Hot 65ml (saiz mini, limited). Saiz utama 130ml. Saiz 65ml limited — bukan semua jenis ada.', 2),
  ('Produk', 'Perbezaan Heat Level', 'Mild = hangat lembut, sesuai semua orang termasuk ibu bersalin & warga emas. Hot = lebih panas, sesuai untuk gym & shaping. Extreme = paling panas, untuk atlet & sukan lasak. Sarankan pelanggan baru mulakan dengan Mild dulu.', 3),
  ('Harga', 'Senarai Harga', 'Pati Halia 130ml: RM22.90. Lime & Ginger 130ml: RM22.90. Super Hot 130ml: RM24.90. Extra Hot 130ml: RM23.90. Extreme Hot 130ml: RM25.90. Extra Ginger 130ml: RM23.90. Pati Halia 65ml: RM14.90 (limited). Super Hot 65ml: RM15.90 (limited).', 4),
  ('Cara Guna', 'Cara Penggunaan', 'Sapu pada bahagian yang dikehendaki — sendi, otot, abdomen, pinggang. Untuk LUARAN sahaja. Jangan sapu pada luka terbuka, mata, atau kawasan sensitif. Jangan guna pada bayi. Basuh tangan selepas guna.', 5),
  ('Cara Guna', 'Tips Penggunaan', 'Untuk urutan berpantang: sapu pada perut, pinggang & badan. Untuk gym: sapu sebelum workout untuk maximakan peluh. Untuk ketidakselesaan sendi: sapu dan urut perlahan pada kawasan yang tidak selesa. Boleh guna 2-3 kali sehari.', 6),
  ('Keselamatan', 'Kelulusan & Keselamatan', 'Semua produk diluluskan Halal JAKIM dan KKM. 100% bahan semula jadi, pati halia tulen. Tiada bahan kimia berbahaya. Selamat untuk ibu bersalin (postpartum). Ibu mengandung perlu rujuk doktor dulu. Untuk luaran sahaja, BUKAN ubat.', 7),
  ('Penghantaran', 'Info Penghantaran', 'Semenanjung Malaysia: 2-5 hari bekerja. Sabah & Sarawak: 5-10 hari bekerja. Penghantaran ke seluruh Malaysia. Boleh order melalui WhatsApp, Shopee, Lazada, atau TikTok Shop.', 8),
  ('Stockist', 'Senarai Stockist', '40+ stockist seluruh Malaysia. Farmasi: R Pharmacy, Alpro Pharmacy, Kaisar Pharmacy. Eksport ke Arab Saudi sejak 2014 dan Singapura (Al Barakah Health & Beauty Mart). Juga tersedia di Shopee, Lazada, dan TikTok Shop.', 9),
  ('Syarikat', 'Tentang Dunia Herbs', 'Diasaskan pada 2005 oleh Rushdi Abdullah. Perintis lotion pati halia No.1 di Malaysia. 20+ tahun di pasaran. 80,000+ pelanggan setia. Duta rasmi: Fasha Sandha.', 10),
  ('Syarikat', 'Duta Rasmi', 'Fasha Sandha — pelakon & selebriti terkenal Malaysia — adalah duta rasmi Dunia Herbs. Beliau sendiri menggunakan dan mempercayai produk Dunia Herbs.', 11),
  ('FAQ', 'Soalan Lazim', 'Boleh guna untuk apa? Ketidakselesaan sendi, otot, urutan berpantang, workout, shaping badan. Halal? Ya, JAKIM & KKM. Selamat untuk ibu mengandung? Rujuk doktor dulu, tapi selamat untuk lepas bersalin. Ada side effect? Rasa hangat/panas adalah normal. Jika alahan kulit, hentikan penggunaan.', 12),

  -- Soalan pelik / edge cases yang pelanggan selalu tanya
  ('FAQ', 'Boleh guna untuk anak kecil?', 'TIDAK disarankan untuk bayi dan kanak-kanak kecil. Untuk kanak-kanak bawah 12 tahun, perlu berhati-hati. Kalau nak guna, test sikit dulu di bahagian kecil kulit. Produk Mild paling sesuai. Jangan guna Extreme atau Super Hot untuk kanak-kanak.', 13),
  ('FAQ', 'Boleh guna untuk ibu mengandung?', 'Ibu MENGANDUNG perlu rujuk doktor dulu sebelum guna. Kami tak recommend tanpa nasihat doktor. Tapi untuk ibu LEPAS BERSALIN (postpartum), memang sangat sesuai — ramai ibu guna untuk urutan berpantang.', 14),
  ('FAQ', 'Boleh guna untuk muka?', 'TIDAK. Produk ini untuk BADAN sahaja — sendi, otot, abdomen, pinggang. Jangan sapu pada muka, mata, atau kawasan sensitif. Ini bukan skincare.', 15),
  ('FAQ', 'Kenapa rasa panas sangat?', 'Rasa hangat/panas adalah NORMAL — itu tanda produk sedang bekerja. Tahap panas bergantung pada jenis: Mild hangat je, Super Hot lebih panas, Extreme memang panas. Kalau baru pertama kali, mulakan dengan Mild. Kalau rasa tak selesa sangat, boleh cuci dengan air sabun. Jangan guna air panas sebab akan tambah rasa panas.', 16),
  ('FAQ', 'Ada expiry date?', 'Ya, semua produk ada tarikh luput yang tertera pada packaging. Biasanya tahan 2-3 tahun dari tarikh pembuatan. Simpan di tempat sejuk dan kering, jauhkan dari cahaya matahari terus.', 17),
  ('FAQ', 'Produk ni ubat ke?', 'BUKAN ubat. Ini produk penjagaan luaran (topical). Kami tak claim boleh rawat atau membantu melegakan penyakit. Khasiat utama: membantu melegakan ketidakselesaan sendi & otot, bantu urutan, memanaskan badan. Kalau ada masalah kesihatan serius, sila rujuk doktor.', 18),
  ('FAQ', 'Boleh guna setiap hari?', 'Boleh guna setiap hari, 2-3 kali sehari. Memang ramai pelanggan guna sebagai rutin harian — pagi sebelum kerja, malam sebelum tidur. Untuk workout, sapu sebelum exercise.', 19),
  ('FAQ', 'Ada bau tak?', 'Ada bau halia yang semula jadi. Lime & Ginger ada tambahan aroma limau nipis yang segar. Bau tak kuat sangat dan akan hilang selepas beberapa minit. Ramai pelanggan suka bau dia — soothing dan natural.', 20),

  -- Cara handle complaint
  ('Complaint', 'Pelanggan rasa produk tak berkesan', 'Tanya berapa lama dah guna dan guna produk mana. Kalau baru guna 1-2 kali, explain yang hasil mungkin ambil masa. Cadangkan naik ke level lebih panas kalau guna Mild. Tanya cara dia guna — mungkin tak sapu cukup atau tak urut. Jangan defensive, dengar dulu.', 21),
  ('Complaint', 'Pelanggan alah / gatal', 'Minta hentikan penggunaan serta-merta. Ini mungkin alahan pada halia — walaupun jarang berlaku. Minta basuh dengan air sabun. Kalau serius, rujuk doktor. Jangan blame pelanggan. Tunjukkan concern. Boleh cadangkan cuba Lime & Ginger yang lebih mild.', 22),
  ('Complaint', 'Pelanggan terima produk rosak / salah', 'Minta maaf dan minta pelanggan WhatsApp team dengan gambar bukti. Team akan arrange replacement secepat mungkin. Jangan suruh pelanggan beli baru. Kita jaga customer satisfaction.', 23),
  ('Complaint', 'Penghantaran lambat', 'Minta maaf atas kelewatan. Explain tempoh standard: Semenanjung 2-5 hari, Sabah/Sarawak 5-10 hari. Kalau dah lebih dari tu, minta pelanggan WhatsApp team dengan nombor tracking untuk semak status. Jangan blame courier, tunjukkan kita ambil berat.', 24),

  -- Perbandingan produk (supaya Emma boleh guide pilihan)
  ('Produk', 'Mild vs Hot vs Extreme', 'Mild (Pati Halia, Lime & Ginger): Hangat lembut, sesuai semua orang. Paling popular untuk ibu bersalin & warga emas. Hot (Super Hot, Extra Hot, Extra Ginger): Lebih panas, ada capsicum. Best untuk gym, shaping, orang aktif. Extreme (Extreme Hot): Paling panas. Untuk atlet hardcore & orang yang dah biasa Hot. Nasihat: SELALU start Mild dulu, nanti boleh naik level.', 25),
  ('Produk', 'Pati Halia vs Lime & Ginger', 'Dua-dua Mild level. Pati Halia — original bestseller, rasa hangat halia classic. Lime & Ginger — sama hangat tapi ada aroma limau nipis yang segar, lebih refreshing. Kalau customer suka bau segar, recommend Lime & Ginger. Kalau nak original proven, Pati Halia.', 26),
  ('Produk', 'Super Hot vs Extra Hot vs Extreme Hot', 'Super Hot — capsicum untuk haba max, best untuk gym & workout. Extra Hot — fokus shaping & anti-selulit. Extreme Hot — level paling panas, untuk hardcore user. Kalau customer nak bakar lemak masa gym, Super Hot. Nak slim & shape badan, Extra Hot. Nak paling power, Extreme Hot.', 27),
  ('Produk', '130ml vs 65ml', '130ml saiz utama, muat handbag, sesuai kegunaan harian. 65ml saiz mini — LIMITED, bukan semua jenis ada. Senang bawa, sesuai try dulu atau travel. Recommend 65ml untuk yang nak try dulu atau bawa travel.', 28),

  -- Tips close sale
  ('Sales', 'Teknik recommend ikut profil', 'Ibu bersalin/berpantang: Pati Halia (Mild) — lembut, selamat, proven ramai ibu guna. Warga emas ketidakselesaan sendi: Pati Halia atau Lime & Ginger — hangat selesa. Gym/fitness: Super Hot — capsicum power. Nak kurus/shape: Extra Hot — fokus shaping. Atlet/sukan: Extreme Hot — max heat. Nak try/travel: 65ml — limited, bukan semua jenis ada. First timer: SELALU Mild dulu.', 29),
  ('Sales', 'Cara handle "mahal"', 'RM22.90 untuk 130ml boleh tahan sebulan lebih. Banding pergi urut sekali dah RM80-150. Ni macam ada tukang urut sendiri di rumah. Kalau nak try dulu, ada 65ml lebih murah — limited je. Produk proven 20 tahun, bukan produk murah yang tak berkesan. Fasha Sandha pun guna — mesti ada kualiti dia.', 30),
  ('Sales', 'Cara handle "nak fikir dulu"', 'Jangan push. Cakap "takpe, ambil masa. Kalau ada soalan boleh tanya je". Boleh mention "btw ada jugak di Shopee kalau nak compare". Bagi space. Ramai yang fikir dulu pastu datang balik. Jangan spam follow up.', 31),
  ('Sales', 'Cara handle "ada produk lain yang lebih murah"', 'Jangan bash competitor. Fokus pada USP Dunia Herbs: 20 tahun di pasaran, Halal JAKIM & KKM, 100% bahan semula jadi, 80K+ pelanggan setia, Fasha Sandha jadi duta. Harga berpatutan untuk kualiti. Produk murah belum tentu selamat dan berkesan.', 32),
  ('Sales', 'Bila nak bagi WhatsApp link', 'HANYA bagi WhatsApp link bila: 1) Customer sendiri tanya macam mana nak order. 2) Customer dah jelas berminat — dah pilih produk, tanya stok, tanya payment method. 3) Customer tanya soalan teknikal yang team perlu jawab. JANGAN bagi setiap reply. Timing penting — bagi awal nampak desperate.', 33),
  ('Sales', 'Upsell & Cross-sell', 'Kalau customer nak try dulu atau travel, mention saiz 65ml — limited, bukan semua jenis ada. Kalau beli Mild & suka, mention boleh try Hot level next time. Kalau beli untuk sendiri, tanya "nak bagi mak/family try jugak?" — tapi sekali je, jangan ulang. Natural je, macam kawan suggest.', 34),

  -- Info tambahan
  ('Promosi', 'Promosi Semasa', 'Tiada promosi khas buat masa ini. Harga standard seperti senarai harga. Kalau customer tanya pasal diskaun, cakap "harga ni dah ok, tapi boleh check dgn team kadang ada promo seasonal". Jangan reka promosi yang tak wujud.', 35),
  ('Penghantaran', 'Cara Order', 'Boleh order melalui: 1) WhatsApp — terus chat dengan team. 2) Shopee — search "Dunia Herbs Official". 3) Lazada — search "Dunia Herbs". 4) TikTok Shop — @duniaherbsofficial. 5) Walk-in stockist — 40+ lokasi seluruh Malaysia. Payment: online banking, card, e-wallet (bergantung platform).', 36),
  ('Penghantaran', 'Kos penghantaran', 'Kos penghantaran bergantung pada platform dan lokasi. Shopee & Lazada selalu ada free shipping voucher. WhatsApp order biasanya guna J&T atau Pos Laju — kos bergantung berat dan lokasi. Untuk detail tepat, suruh customer WhatsApp team.', 37),
  ('Syarikat', 'Sejarah Dunia Herbs', 'Ditubuhkan tahun 2005 oleh Rushdi Abdullah. Bermula dengan satu produk — Lotion Mustajab Pati Halia. Perintis lotion pati halia di Malaysia. Kini ada 8 variasi produk. Dah export ke Arab Saudi (2014) dan Singapura. 40+ stockist seluruh Malaysia. Lebih 80,000 pelanggan setia. Duta rasmi Fasha Sandha. Brand yang trusted dan proven.', 38),
  ('Keselamatan', 'Bahan-bahan utama', 'Bahan utama: Pati halia tulen (Zingiber officinale). Bahan tambahan ikut variasi: Capsicum (Super Hot, Extreme Hot) untuk haba tambahan. Limau nipis/Lime (Lime & Ginger) untuk aroma segar. Semua bahan semula jadi, tiada paraben, tiada SLS, tiada bahan kimia keras. Diluluskan KKM dan Halal JAKIM.', 39);

-- 9. Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stockists ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read" ON products FOR SELECT USING (visible = true);
CREATE POLICY "Public read" ON testimonials FOR SELECT USING (visible = true);
CREATE POLICY "Public read" ON faqs FOR SELECT USING (visible = true);
CREATE POLICY "Public read" ON stockists FOR SELECT USING (visible = true);
CREATE POLICY "Public read" ON milestones FOR SELECT USING (true);
CREATE POLICY "Public read" ON videos FOR SELECT USING (visible = true);
CREATE POLICY "Public read" ON knowledge_base FOR SELECT USING (visible = true);

-- Authenticated full access (for admin)
CREATE POLICY "Auth full access" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON stockists FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON milestones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON knowledge_base FOR ALL USING (auth.role() = 'authenticated');

-- 8. Orders (Billplz)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_no TEXT NOT NULL UNIQUE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  amount_cents INT NOT NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_email TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  bill_code TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_ref TEXT,
  payment_channel TEXT,
  payment_time TIMESTAMPTZ,
  callback_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own order" ON orders FOR SELECT USING (true);
CREATE POLICY "Auth full access" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- 9. Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Auth upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
