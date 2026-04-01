'use client';

import AdminShell from '@/components/admin/AdminShell';
import FileUpload from '@/components/admin/FileUpload';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

type ContentGroup = {
  keys: string[];
  guide: string;
  preview?: string;
};

const CONTENT_GROUPS: Record<string, ContentGroup> = {
  Hero: {
    keys: ['hero_badge_image', 'hero_badge', 'hero_subtitle', 'hero_title', 'hero_description', 'hero_image', 'hero_cta_whatsapp', 'hero_cta_produk'],
    guide: 'Bahagian PALING ATAS di homepage — logo/badge atas sekali, teks besar "Memang Mustajab", butang WhatsApp & Lihat Produk',
    preview: '/',
  },
  Duta: {
    keys: ['duta_label', 'duta_title', 'duta_desc', 'duta_link_text'],
    guide: 'Seksyen video duta di homepage — di bawah hero. Tajuk "Fasha Sandha × Dunia Herbs" dan link ke /fasha',
    preview: '/',
  },
  'Produk — Koleksi Haruman (atas)': {
    keys: ['produk_label', 'produk_title', 'produk_subtitle', 'produk_ids'],
    guide: 'Seksyen ATAS di homepage — "KOLEKSI HARUMAN". produk_ids = UUID dipisah koma. Kosong = semua produk. Atau pilih dari Admin → Produk (toggle Haruman).',
    preview: '/#produk',
  },
  'Produk — Koleksi Legend (bawah)': {
    keys: ['produk_legend_label', 'produk_legend_title', 'produk_legend_subtitle', 'produk_legend_ids'],
    guide: 'Seksyen BAWAH di homepage — "KOLEKSI LEGEND". produk_legend_ids = UUID produk dipisah koma. Kosong = auto (Mild/berbadge).',
    preview: '/#produk-legend',
  },
  Sejarah: {
    keys: ['sejarah_label', 'sejarah_title'],
    guide: 'Tajuk seksyen timeline/sejarah di homepage & halaman Tentang. Milestone diurus di halaman Timeline',
    preview: '/tentang',
  },
  Testimonial: {
    keys: ['testimonial_label', 'testimonial_title'],
    guide: 'Tajuk seksyen testimoni di homepage — "Kata Pelanggan" / "Dipercayai Ramai"',
    preview: '/',
  },
  Benefits: {
    keys: ['benefits_label', 'benefits_title', 'benefits_subtitle', 'benefit_1_icon', 'benefit_1_title', 'benefit_1_desc', 'benefit_2_icon', 'benefit_2_title', 'benefit_2_desc', 'benefit_3_icon', 'benefit_3_title', 'benefit_3_desc', 'benefit_4_icon', 'benefit_4_title', 'benefit_4_desc', 'benefit_5_icon', 'benefit_5_title', 'benefit_5_desc'],
    guide: '5 kotak kebaikan produk di homepage — icon emoji + tajuk + penerangan. Contoh: 🩹 Ketidakselesaan sendi, 🔥 Bakar lemak, 🤱 Ibu bersalin',
    preview: '/',
  },
  'Customer Service': {
    keys: ['cs_label', 'cs_title', 'cs_subtitle', 'faq_preview_title', 'faq_link_text'],
    guide: 'Seksyen customer service & FAQ preview di bawah homepage — kotak WhatsApp, FAQ, ChatBot',
    preview: '/',
  },
  Footer: {
    keys: ['footer_tagline', 'footer_brand_desc', 'footer_copyright', 'footer_website'],
    guide: 'Footer paling bawah setiap halaman — teks brand, copyright, URL website',
    preview: '/',
  },
  Marquee: {
    keys: ['marquee_items'],
    guide: 'Teks bergerak (ticker) di homepage — pisahkan dengan | . Contoh: "Halal JAKIM|KKM Diluluskan|20+ Tahun"',
    preview: '/',
  },
  Counter: {
    keys: ['counter_stats'],
    guide: 'Angka statistik animasi di homepage — "20+ Tahun", "40+ Stockist", dll. Format JSON',
    preview: '/',
  },
  Video: {
    keys: ['video_label', 'video_title', 'video_subtitle', 'video_url'],
    guide: 'Seksyen video iklan komersial di homepage (selepas Produk, sebelum Sejarah). Video sendiri diurus di halaman Video',
    preview: '/',
  },
  Contact: {
    keys: ['whatsapp'],
    guide: 'Nombor WhatsApp untuk butang-butang WhatsApp di seluruh website. Format: 60123456789',
    preview: '/contact',
  },
  'Social Media': {
    keys: ['instagram', 'tiktok', 'facebook'],
    guide: 'Link akaun social media — dipaparkan di footer homepage',
    preview: '/',
  },
  About: {
    keys: ['about_quote', 'about_founder', 'about_description'],
    guide: 'Halaman Tentang — quote pengasas, nama pengasas, penerangan syarikat',
    preview: '/tentang',
  },
  Polisi: {
    keys: ['polisi_privacy', 'polisi_shipping', 'polisi_return', 'polisi_cookie', 'polisi_terms', 'polisi_usage'],
    guide: 'Halaman Polisi — privasi, penghantaran, pemulangan, cookies, ToS, syarat guna produk',
    preview: '/polisi',
  },
  'Selepas Bersalin': {
    keys: ['bersalin_hero_image', 'bersalin_gallery_1', 'bersalin_gallery_2', 'bersalin_gallery_3', 'bersalin_quote'],
    guide: 'Halaman khas ibu berpantang /bersalin — hero image, 3 galeri gambar, dan quote',
    preview: '/bersalin',
  },
};

const FIELD_HINTS: Record<string, string> = {
  hero_badge_image: 'Upload logo syarikat — akan dipaparkan di paling atas homepage. Kalau kosong, teks badge dipaparkan',
  hero_badge: 'Teks badge (kalau takde logo). Contoh: "20 Tahun di Pasaran Malaysia"',
  hero_subtitle: 'Contoh: "Dunia Herbs • Trusted Since 2005"',
  hero_title: 'Teks besar utama. Contoh: "Memang Mustajab"',
  hero_description: 'Penerangan di bawah tajuk hero',
  hero_image: 'Gambar utama hero (sebelah kanan tajuk)',
  hero_cta_whatsapp: 'Teks butang hijau. Contoh: "WhatsApp Kami"',
  hero_cta_produk: 'Teks butang emas. Contoh: "Lihat Produk"',
  duta_label: 'Label kecil atas. Contoh: "Duta Rasmi"',
  duta_title: 'Contoh: "Fasha Sandha × Dunia Herbs"',
  duta_desc: 'Penerangan ringkas seksyen duta',
  duta_link_text: 'Contoh: "Lihat landing page khas Fasha →"',
  produk_label: 'Label kecil. Contoh: "Koleksi Unggulan"',
  produk_title: 'Contoh: "KOLEKSI HARUMAN"',
  produk_subtitle: 'Contoh: "Lotion pati halia 130ml — luaran sahaja"',
  produk_ids: 'UUID produk untuk Koleksi Haruman (atas). Kosong = semua. Atau pilih dari Admin → Produk',
  produk_legend_label: 'Label seksyen legend. Contoh: "Koleksi"',
  produk_legend_title: 'Contoh: "KOLEKSI LEGEND"',
  produk_legend_subtitle: 'Contoh: "Produk ikonik yang menjadi pilihan sejak 2005"',
  produk_legend_ids: 'UUID produk untuk Koleksi Legend (bawah). Kosong = auto (Mild/berbadge). Atau pilih dari Admin → Produk',
  sejarah_label: 'Contoh: "Legasi Kami"',
  sejarah_title: 'Contoh: "Sejak 2005"',
  testimonial_label: 'Contoh: "Kata Pelanggan"',
  testimonial_title: 'Contoh: "Dipercayai Ramai"',
  benefits_label: 'Contoh: "Khasiat Semula Jadi"',
  benefits_title: 'Contoh: "Kebaikan"',
  benefits_subtitle: 'Contoh: "Multi-purpose lotion untuk seluruh keluarga"',
  benefit_1_icon: 'Emoji. Contoh: 🩹',
  benefit_1_title: 'Contoh: "Ketidakselesaan sendi & otot"',
  benefit_1_desc: 'Contoh: "Membantu melegakan ketidakselesaan dengan pati halia semula jadi"',
  cs_label: 'Contoh: "Sokongan Pelanggan"',
  cs_title: 'Contoh: "Customer Service"',
  cs_subtitle: 'Contoh: "Kami sedia membantu — tanya apa sahaja"',
  faq_preview_title: 'Contoh: "Soalan lazim"',
  faq_link_text: 'Contoh: "Lihat semua FAQ"',
  footer_tagline: 'Tagline di footer',
  footer_brand_desc: 'Penerangan brand di footer kiri',
  footer_copyright: 'Guna {year} untuk tahun auto. Contoh: "© {year} Dunia Herbs"',
  footer_website: 'Contoh: "www.duniaherbs.com.my"',
  marquee_items: 'Pisahkan dengan | . Contoh: "Halal JAKIM|KKM Diluluskan|20+ Tahun"',
  counter_stats: 'JSON format. Contoh: {"stats":[{"value":20,"suffix":"+","label":"Tahun"}]}',
  video_label: 'Label kecil atas seksyen video. Contoh: "Tonton"',
  video_title: 'Tajuk seksyen video. Contoh: "Video Iklan"',
  video_subtitle: 'Penerangan ringkas. Contoh: "Koleksi video komersial Dunia Herbs"',
  video_url: 'URL video utama (opsional)',
  whatsapp: 'Format nombor tanpa +. Contoh: 60123456789',
  about_quote: 'Quote pengasas di halaman Tentang',
  about_founder: 'Nama pengasas. Contoh: "Rushdi Abdullah"',
  about_description: 'Penerangan syarikat di halaman Tentang',
  polisi_privacy: 'Teks polisi privasi penuh',
  polisi_shipping: 'Teks polisi penghantaran penuh',
  polisi_return: 'Teks polisi pemulangan penuh',
  polisi_cookie: 'Teks polisi cookies — localStorage, cookies, penjejakan',
  polisi_terms: 'Teks Terms of Service (syarat penggunaan laman web)',
  polisi_usage: 'Teks syarat penggunaan produk',
  bersalin_hero_image: 'Gambar utama halaman bersalin (sebelah kiri artikel). Upload gambar ibu/produk',
  bersalin_gallery_1: 'Gambar galeri 1 — kegunaan/cara pakai',
  bersalin_gallery_2: 'Gambar galeri 2',
  bersalin_gallery_3: 'Gambar galeri 3',
  bersalin_quote: 'Quote/petua tradisional yang dipaparkan di halaman bersalin',
};

const DEFAULT_VALUES: Record<string, string> = {
  hero_badge_image: '',
  hero_badge: '20 Tahun di Pasaran Malaysia',
  hero_subtitle: 'Dunia Herbs • Trusted Since 2005',
  hero_title: 'Memang Mustajab',
  hero_description: 'Lotion Mustajab Pati Halia — produk #1 herba halia di Malaysia. KKM & Halal JAKIM.',
  hero_image: '',
  hero_cta_whatsapp: 'WhatsApp Kami',
  hero_cta_produk: 'Lihat Produk',
  duta_label: 'Duta Rasmi',
  duta_title: 'Fasha Sandha × Dunia Herbs',
  duta_desc: 'Tonton video eksklusif daripada duta rasmi kami — Fasha Sandha',
  duta_link_text: 'Lihat landing page khas Fasha →',
  produk_label: 'Koleksi Unggulan',
  produk_title: 'KOLEKSI HARUMAN',
  produk_subtitle: 'Lotion pati halia 130ml — luaran sahaja',
  produk_ids: '',
  produk_legend_label: 'Koleksi',
  produk_legend_title: 'KOLEKSI LEGEND',
  produk_legend_subtitle: 'Produk ikonik yang menjadi pilihan sejak 2005',
  produk_legend_ids: '',
  sejarah_label: 'Legasi Kami',
  sejarah_title: 'Sejak 2005',
  testimonial_label: 'Kata Pelanggan',
  testimonial_title: 'Dipercayai Ramai',
  benefits_label: 'Khasiat Semula Jadi',
  benefits_title: 'Kebaikan',
  benefits_subtitle: 'Multi-purpose lotion untuk seluruh keluarga',
  benefit_1_icon: '🩹',
  benefit_1_title: 'Ketidakselesaan sendi & otot',
  benefit_1_desc: 'Membantu melegakan ketidakselesaan dengan pati halia semula jadi',
  benefit_2_icon: '🔥',
  benefit_2_title: 'Bakar lemak',
  benefit_2_desc: 'Bantu proses pembakaran lemak & shaping',
  benefit_3_icon: '🤱',
  benefit_3_title: 'Ibu bersalin',
  benefit_3_desc: 'Sesuai untuk urutan postpartum',
  benefit_4_icon: '✨',
  benefit_4_title: 'Selulit & kedut',
  benefit_4_desc: 'Kurangkan penampilan selulit',
  benefit_5_icon: '🩸',
  benefit_5_title: 'Senggugut',
  benefit_5_desc: 'Legakan kekejangan & kembung perut',
  cs_label: 'Sokongan Pelanggan',
  cs_title: 'Customer Service',
  cs_subtitle: 'Kami sedia membantu — tanya apa sahaja',
  faq_preview_title: 'Soalan lazim',
  faq_link_text: 'Lihat semua FAQ',
  footer_tagline: 'Memang Mustajab • 20 Tahun Legenda • www.duniaherbs.com.my',
  footer_brand_desc: 'Memang Mustajab — Perintis lotion pati halia di Malaysia sejak 2005. KKM & Halal JAKIM.',
  footer_copyright: '© {year} Dunia Herbs. Hak cipta terpelihara.',
  footer_website: 'www.duniaherbs.com.my',
  marquee_items: 'Halal JAKIM|KKM Diluluskan|20+ Tahun Legenda|40+ Stockist|Perintis Lotion Halia Malaysia|Eksport ke Arab Saudi|Produk Semula Jadi|Memang Mustajab',
  counter_stats: '{"stats":[{"value":20,"suffix":"+","label":"Tahun di Pasaran"},{"value":40,"suffix":"+","label":"Stockist Seluruh Dunia"},{"value":80,"suffix":"K+","label":"Pelanggan Setia"},{"value":8,"suffix":"","label":"Variasi Produk"}]}',
  video_label: 'Tonton',
  video_title: 'Video Iklan',
  video_subtitle: 'Koleksi video komersial Dunia Herbs',
  video_url: '',
  whatsapp: '60123456789',
  instagram: 'https://www.instagram.com/duniaherbsofficial',
  tiktok: 'https://www.tiktok.com/@duniaherbsofficial',
  facebook: 'https://www.facebook.com/DuniaHerbsOfficial',
  about_quote: 'Saya mulakan Dunia Herbs selepas lebih 20 tahun mencuba pelbagai bisnes. Apa yang bermula dari kegagalan, menjadi kekuatan. Setiap botol Lotion Mustajab mengandungi semangat untuk membantu orang lain.',
  about_founder: 'Rushdi Abdullah',
  about_description: 'Bermula dari kegigihan seorang usahawan Malaysia, Dunia Herbs diasaskan dengan satu matlamat — menghasilkan produk herba semula jadi yang benar-benar berkesan. Lebih 20 tahun kemudian, Lotion Mustajab Pati Halia telah menjadi legenda di pasaran Malaysia.',
  polisi_privacy: 'Dunia Herbs menghormati privasi pelanggan kami. Maklumat peribadi yang dikumpul (nama, telefon, alamat) hanya digunakan untuk tujuan penghantaran dan komunikasi berkaitan pesanan.\n\nKami tidak akan menjual, menyewa atau berkongsi maklumat peribadi anda kepada pihak ketiga tanpa kebenaran.\n\nData pembayaran diproses melalui gateway pembayaran yang selamat dan tidak disimpan oleh kami.',
  polisi_shipping: 'Semenanjung Malaysia: 2–5 hari bekerja.\nSabah & Sarawak: 5–10 hari bekerja.\nSingapura: 3–7 hari bekerja (melalui stockist).\n\nKos penghantaran bergantung kepada lokasi dan berat bungkusan. Penghantaran percuma mungkin ditawarkan untuk pesanan melebihi jumlah tertentu.',
  polisi_return: 'Pemulangan diterima dalam tempoh 7 hari dari tarikh penerimaan, tertakluk kepada syarat berikut:\n• Produk belum dibuka dan dalam keadaan asal.\n• Bungkusan tidak rosak.\n• Resit atau bukti pembelian disertakan.\n\nUntuk memulakan pemulangan, hubungi kami melalui email admin@duniaherbs.com.my.',
  polisi_cookie: 'Laman web ini mungkin menyimpan data di peranti anda (cookies atau localStorage) untuk fungsi asas seperti troli beli-belah dan maklumat checkout.\n\n• Data troli & maklumat pelanggan disimpan dalam penyemak imbas anda (localStorage) — hanya untuk memudahkan pembelian anda.\n\n• Kami tidak menggunakan cookies untuk iklan atau penjejakan pihak ketiga.\n\n• Anda boleh kosongkan data dengan mengosongkan troli atau menghapus data laman web dalam tetapan penyemak imbas anda.\n\nUntuk maklumat lanjut, rujuk Polisi Privasi kami.',
  polisi_terms: 'Dengan menggunakan laman web Dunia Herbs (www.duniaherbs.com.my), anda bersetuju dengan syarat-syarat berikut:\n\n1. Penggunaan laman web\nAnda bersetuju menggunakan laman ini untuk tujuan yang sah sahaja. Dilarang menyalahgunakan kandungan, sistem atau maklumat kami.\n\n2. Pesanan & pembayaran\nPesanan tertakluk kepada ketersediaan stok. Harga yang dipaparkan adalah muktamad pada masa checkout. Pembayaran diproses melalui gateway yang selamat (Billplz).\n\n3. Ketepatan maklumat\nAnda bertanggungjawab memastikan maklumat penghantaran dan pembayaran yang diberikan adalah tepat.\n\n4. Had liabiliti\nDunia Herbs tidak bertanggungjawab atas kerosakan tidak langsung akibat penggunaan laman web atau produk. Produk kami untuk kegunaan luaran sahaja — rujuk doktor untuk nasihat kesihatan.\n\n5. Perubahan\nKami berhak mengemas kini polisi dan syarat ini dari semasa ke semasa. Perubahan akan dipaparkan di halaman ini.\n\n6. Undang-undang\nSyarat ini tertakluk kepada undang-undang Malaysia. Sebarang pertikaian akan diselesaikan di mahkamah Malaysia.\n\nHubungi kami: admin@duniaherbs.com.my',
  polisi_usage: 'Semua produk Dunia Herbs adalah untuk kegunaan luaran sahaja.\n\nTidak sesuai untuk bayi dan kanak-kanak kecil.\n\nSila rujuk doktor jika anda mengandung atau mempunyai keadaan kulit yang sensitif sebelum menggunakan produk ini.\n\nHentikan penggunaan jika berlaku kerengsaan kulit.',
  fasha_visible: '1',
  fasha_hero_image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Fasha_Sandha_on_MeleTOP.jpg',
  fasha_hero_badge: 'Duta Rasmi Dunia Herbs',
  fasha_hero_title: 'Fasha Sandha',
  fasha_hero_subtitle: '× Dunia Herbs',
  fasha_hero_description: 'Pelakon & selebriti terkenal Malaysia. Fasha sendiri pilih dan percayai Lotion Mustajab — produk pati halia #1 di Malaysia sejak 2005.',
  fasha_quote: 'Saya pilih Dunia Herbs sebab produk ni memang proven — 20 tahun di pasaran, halal, dan berkesan. Sesuai untuk urutan berpantang dan rutin harian.',
  fasha_cta_title: 'Ikut Pilihan Fasha',
  fasha_cta_subtitle: 'Order sekarang melalui WhatsApp atau platform pilihan anda.',
  fasha_picks: '',
};

type ContentMap = Record<string, string>;

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function fetchContent() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.from('site_content').select('id, value');
    if (error) {
      console.error(error);
      setContent({});
    } else {
      const map: ContentMap = {};
      (data ?? []).forEach((row: { id: string; value: string }) => {
        map[row.id] = row.value ?? '';
      });
      setContent(map);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchContent();
  }, []);

  function updateKey(key: string, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function fillDefaults() {
    const merged = { ...DEFAULT_VALUES };
    for (const [k, v] of Object.entries(content)) {
      if (v) merged[k] = v;
    }
    setContent(merged);
    setSaved(false);
  }

  const emptyCount = Object.values(CONTENT_GROUPS).flatMap(g => g.keys).filter(k => !content[k]).length;

  async function handleSave() {
    setSaving(true);
    const supabase = getSupabaseBrowser();
    const allKeys = Array.from(
      new Set([...Object.keys(content), ...Object.keys(DEFAULT_VALUES)])
    );
    for (const key of allKeys) {
      const val = content[key] ?? DEFAULT_VALUES[key] ?? '';
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: key, value: val }, { onConflict: 'id' });
      if (error) console.error(error);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <AdminShell>
        <p className="text-stone-500 text-sm">Memuatkan...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Site Content</h1>
          <p className="text-stone-500 text-xs mt-1">Semua teks, tajuk, dan penerangan yang dipaparkan di website. Setiap seksyen ada butang Preview untuk lihat hasilnya.</p>
        </div>
        <div className="flex items-center gap-2">
          {emptyCount > 0 && (
            <button
              onClick={fillDefaults}
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition"
            >
              Isi Default ({emptyCount} kosong)
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-4 py-2 text-sm text-herb-gold hover:bg-herb-gold/30 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : saved ? 'Disimpan!' : 'Simpan Semua'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(CONTENT_GROUPS).map(([category, group]) => (
          <section
            key={category}
            id={category.toLowerCase().replace(/\s+/g, '-')}
            className="rounded-xl border border-stone-700 bg-herb-surface/60 p-6 scroll-mt-20"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-herb-gold">{category}</h2>
                <p className="text-stone-500 text-xs mt-1 max-w-xl">{group.guide}</p>
              </div>
              {group.preview && (
                <a
                  href={group.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1 rounded-lg border border-stone-700 px-3 py-1.5 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </a>
              )}
            </div>
            <div className="space-y-4">
              {group.keys.map((key) => {
                const isLong = key.includes('desc') || key.includes('quote') || key.includes('stats') || key.includes('items') || key.startsWith('polisi_');
                const isImageField = key.includes('image') || key.includes('_url');
                const hint = FIELD_HINTS[key];
                const defaultVal = DEFAULT_VALUES[key] ?? '';
                const placeholder = defaultVal ? `Default: ${defaultVal.slice(0, 80)}${defaultVal.length > 80 ? '…' : ''}` : '';
                const isEmpty = !content[key];
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-sm text-stone-400">{key}</label>
                      {isEmpty && defaultVal && (
                        <button
                          type="button"
                          onClick={() => updateKey(key, defaultVal)}
                          className="text-[10px] text-stone-600 hover:text-herb-gold transition"
                        >
                          Isi default
                        </button>
                      )}
                    </div>
                    {hint && <p className="text-[11px] text-stone-600 mb-1.5">{hint}</p>}
                    {isImageField ? (
                      <div className="space-y-2">
                        <FileUpload
                          accept="image/*,video/*"
                          folder="images"
                          preview={content[key] || undefined}
                          previewType={key.includes('video') ? 'video' : 'image'}
                          label={`Upload untuk ${key}`}
                          onUpload={(url) => updateKey(key, url)}
                        />
                        <input
                          type="text"
                          value={content[key] ?? ''}
                          onChange={(e) => updateKey(key, e.target.value)}
                          className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-xs placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                          placeholder={placeholder || 'Masukkan URL manual...'}
                        />
                      </div>
                    ) : isLong ? (
                      <textarea
                        value={content[key] ?? ''}
                        onChange={(e) => updateKey(key, e.target.value)}
                        rows={key === 'counter_stats' ? 6 : key.startsWith('polisi_') ? 5 : 3}
                        className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none font-mono text-sm"
                        placeholder={placeholder}
                      />
                    ) : (
                      <input
                        type="text"
                        value={content[key] ?? ''}
                        onChange={(e) => updateKey(key, e.target.value)}
                        className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                        placeholder={placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
