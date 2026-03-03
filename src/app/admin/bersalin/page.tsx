'use client';

import AdminShell from '@/components/admin/AdminShell';
import FileUpload from '@/components/admin/FileUpload';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  tagline?: string;
  price?: string;
  badge?: string;
  heat?: string;
  image_url?: string;
};

const PRODUCT_IDS_KEY = 'bersalin_product_ids';

const DEFAULTS: Record<string, string> = {
  hero_badge: 'Panduan Ibu Berpantang',
  hero_title: 'Penjagaan Wanita',
  hero_title_highlight: 'Selepas Bersalin',
  hero_desc: 'Petua tradisional Melayu dalam sentuhan moden — losyen pati halia semula jadi untuk ibu-ibu yang baru melahirkan dan sedang berpantang.',
  intro_label: 'Losyen Pati Halia',
  intro_title: 'Sangat Sinonim Untuk\nKegunaan Wanita Selepas Bersalin',
  intro_p1: 'Losyen Mustajab Pati Halia Limau Nipis yang menggunakan ramuan utama pati limau nipis dan pati halia mempunyai pelbagai kegunaan hanya di dalam satu produk sahaja.',
  intro_p2: 'Bauan aroma limau nipis dan halia yang sangat menyegarkan, ditambah pula dengan sedikit bauan \'mint\' dapat membantu menceriakan emosi ibu-ibu selepas bersalin yang biasanya lesu dan tidak bermaya.',
  tips_label: 'Khasiat & Kegunaan',
  tips_title: 'Kebaikan Untuk Ibu Berpantang',
  tip_1_icon: '🌿', tip_1_title: 'Menggantikan Param & Pilis', tip_1_desc: 'Losyen Mustajab Pati Halia Limau Nipis memudahkan ibu-ibu berpantang tanpa perlu sediakan param dan pilis secara tradisional.',
  tip_2_icon: '💆‍♀️', tip_2_title: 'Urutan Lembut', tip_2_desc: 'Lakukan sedikit urutan menggunakan losyen untuk membantu pengaliran darah yang lebih lancar dan menghilangkan rasa kebas.',
  tip_3_icon: '🩹', tip_3_title: 'Membuang Angin', tip_3_desc: 'Pati halia dan limau nipis membantu membuang angin dalam badan — masalah utama wanita selepas bersalin.',
  tip_4_icon: '✨', tip_4_title: 'Mengempiskan Perut', tip_4_desc: 'Sesuai digunakan bersama bengkung untuk mendapatkan kesan optimum mengempiskan perut selepas bersalin.',
  tip_5_icon: '🧘‍♀️', tip_5_title: 'Menyegarkan Badan', tip_5_desc: 'Aroma limau nipis dan halia yang menyegarkan membantu menceriakan emosi ibu-ibu yang lesu selepas bersalin.',
  tip_6_icon: '🕐', tip_6_title: 'Jimat Masa', tip_6_desc: 'Tidak berminyak dan mudah menyerap — memudahkan ibu yang berpantang sendiri tanpa tukang urut.',
  article_1_title: 'Petua Turun-Temurun, Kemudahan Moden', article_1_content: 'Sejak zaman nenek moyang, wanita Melayu mengamalkan petua berpantang menggunakan halia, limau nipis, dan rempah ratus semula jadi. Dunia Herbs menggabungkan kebijaksanaan tradisional ini dalam bentuk losyen moden yang mudah digunakan — tanpa perlu menumbuk param atau menyediakan pilis.',
  article_2_title: 'Kenapa Pati Halia?', article_2_content: 'Halia dikenali sebagai "ratu herba" dalam perubatan tradisional Melayu. Ia membantu melancarkan peredaran darah, mengurangkan bengkak, membuang angin, dan memberikan kehangatan semula jadi pada badan. Losyen Mustajab menggunakan pati halia tulen 100% — bukan perisa atau bahan sintetik.',
  article_3_title: 'Sesuai Untuk Semua Ibu', article_3_content: 'Sama ada bersalin normal atau pembedahan, losyen ini sesuai untuk semua ibu. Sapuan lembut pada perut, pinggang, dan anggota badan sudah memadai. Ditambah dengan pemakaian bengkung, hasilnya lebih berkesan. Sesuai juga untuk ibu yang berpantang sendiri tanpa bantuan tukang urut.',
  gallery_label: 'Galeri',
  gallery_title: 'Kegunaan & Cara Pakai',
  produk_label: 'Produk Disyorkan',
  produk_title: 'Sesuai Untuk Ibu Berpantang',
  produk_desc: 'Pilihan losyen yang lembut dan sesuai untuk kegunaan wanita selepas bersalin',
  quote: 'Limau nipis biasa digunakan oleh wanita selepas bersalin semasa dalam pantang sebagai salah satu bahan untuk mengempiskan perut dan menyegarkan badan yang lesu.',
  quote_author: '— Petua Tradisional Melayu',
  cta_title: 'Mula Berpantang Dengan Cara Moden',
  cta_desc: 'Hubungi kami untuk nasihat produk yang sesuai untuk anda. Kami sedia membantu.',
};

const SECTIONS = [
  {
    label: 'Hero',
    keys: [
      { id: 'hero_badge', hint: 'Badge atas. Cth: Panduan Ibu Berpantang' },
      { id: 'hero_title', hint: 'Tajuk baris 1. Cth: Penjagaan Wanita' },
      { id: 'hero_title_highlight', hint: 'Tajuk baris 2 (gold). Cth: Selepas Bersalin' },
      { id: 'hero_desc', hint: 'Penerangan bawah tajuk', long: true },
    ],
  },
  {
    label: 'Gambar & Pengenalan',
    keys: [
      { id: 'hero_image', hint: 'Gambar utama sebelah kiri artikel', image: true },
      { id: 'intro_label', hint: 'Label kecil. Cth: Losyen Pati Halia' },
      { id: 'intro_title', hint: 'Tajuk pengenalan. Guna \\n untuk baris baru', long: true },
      { id: 'intro_p1', hint: 'Perenggan 1', long: true },
      { id: 'intro_p2', hint: 'Perenggan 2', long: true },
    ],
  },
  {
    label: 'Tips & Khasiat (6 kad)',
    keys: [
      { id: 'tips_label', hint: 'Label seksyen. Cth: Khasiat & Kegunaan' },
      { id: 'tips_title', hint: 'Tajuk seksyen. Cth: Kebaikan Untuk Ibu Berpantang' },
      { id: 'tip_1_icon', hint: 'Emoji tip 1' }, { id: 'tip_1_title', hint: 'Tajuk tip 1' }, { id: 'tip_1_desc', hint: 'Keterangan tip 1', long: true },
      { id: 'tip_2_icon', hint: 'Emoji tip 2' }, { id: 'tip_2_title', hint: 'Tajuk tip 2' }, { id: 'tip_2_desc', hint: 'Keterangan tip 2', long: true },
      { id: 'tip_3_icon', hint: 'Emoji tip 3' }, { id: 'tip_3_title', hint: 'Tajuk tip 3' }, { id: 'tip_3_desc', hint: 'Keterangan tip 3', long: true },
      { id: 'tip_4_icon', hint: 'Emoji tip 4' }, { id: 'tip_4_title', hint: 'Tajuk tip 4' }, { id: 'tip_4_desc', hint: 'Keterangan tip 4', long: true },
      { id: 'tip_5_icon', hint: 'Emoji tip 5' }, { id: 'tip_5_title', hint: 'Tajuk tip 5' }, { id: 'tip_5_desc', hint: 'Keterangan tip 5', long: true },
      { id: 'tip_6_icon', hint: 'Emoji tip 6' }, { id: 'tip_6_title', hint: 'Tajuk tip 6' }, { id: 'tip_6_desc', hint: 'Keterangan tip 6', long: true },
    ],
  },
  {
    label: 'Artikel (3 bahagian)',
    keys: [
      { id: 'article_1_title', hint: 'Tajuk artikel 1' }, { id: 'article_1_content', hint: 'Isi artikel 1', long: true },
      { id: 'article_2_title', hint: 'Tajuk artikel 2' }, { id: 'article_2_content', hint: 'Isi artikel 2', long: true },
      { id: 'article_3_title', hint: 'Tajuk artikel 3' }, { id: 'article_3_content', hint: 'Isi artikel 3', long: true },
    ],
  },
  {
    label: 'Galeri (6 gambar)',
    keys: [
      { id: 'gallery_label', hint: 'Label seksyen. Cth: Galeri' },
      { id: 'gallery_title', hint: 'Tajuk seksyen. Cth: Kegunaan & Cara Pakai' },
      { id: 'gallery_1', hint: 'Gambar 1', image: true },
      { id: 'gallery_2', hint: 'Gambar 2', image: true },
      { id: 'gallery_3', hint: 'Gambar 3', image: true },
      { id: 'gallery_4', hint: 'Gambar 4', image: true },
      { id: 'gallery_5', hint: 'Gambar 5', image: true },
      { id: 'gallery_6', hint: 'Gambar 6', image: true },
    ],
  },
  {
    label: 'Teks Seksyen Produk',
    keys: [
      { id: 'produk_label', hint: 'Label. Cth: Produk Disyorkan' },
      { id: 'produk_title', hint: 'Tajuk. Cth: Sesuai Untuk Ibu Berpantang' },
      { id: 'produk_desc', hint: 'Penerangan ringkas', long: true },
    ],
  },
  {
    label: 'Quote & CTA',
    keys: [
      { id: 'quote', hint: 'Quote/petua tradisional', long: true },
      { id: 'quote_author', hint: 'Sumber quote. Cth: — Petua Tradisional Melayu' },
      { id: 'cta_title', hint: 'Tajuk CTA. Cth: Mula Berpantang Dengan Cara Moden' },
      { id: 'cta_desc', hint: 'Penerangan CTA', long: true },
    ],
  },
];

const SECTION_KEYS = SECTIONS.flatMap((s) => s.keys.map((k) => `bersalin_${k.id}`));
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100&h=100&fit=crop';

export default function AdminBersalinPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function fetchAll() {
    const supabase = getSupabaseBrowser();
    const [{ data: siteData }, { data: prodData }] = await Promise.all([
      supabase.from('site_content').select('id, value'),
      supabase.from('products').select('id, name, tagline, price, badge, heat, image_url').eq('visible', true).order('sort_order'),
    ]);

    const map: Record<string, string> = {};
    (siteData ?? []).forEach((row: { id: string; value: string }) => { map[row.id] = row.value ?? ''; });
    setContent(map);
    setAllProducts((prodData as Product[]) ?? []);

    const ids = (map[PRODUCT_IDS_KEY] || '').split(',').map((s) => s.trim()).filter(Boolean);
    setSelectedIds(ids);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  function updateKey(key: string, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function saveKey(key: string, value: string) {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('site_content').upsert({ id: key, value }, { onConflict: 'id' });
    if (error) { console.error(`Gagal simpan ${key}:`, error.message); alert(`Gagal simpan: ${error.message}`); }
  }

  function toggleProduct(id: string) {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      updateKey(PRODUCT_IDS_KEY, next.join(','));
      return next;
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = getSupabaseBrowser();
    let errors = 0;

    const allKeys = [...SECTION_KEYS, PRODUCT_IDS_KEY];
    for (const key of allKeys) {
      const val = content[key];
      if (val !== undefined && val !== '') {
        const { error } = await supabase.from('site_content').upsert({ id: key, value: val }, { onConflict: 'id' });
        if (error) { console.error(`Gagal simpan ${key}:`, error.message); errors++; }
      }
    }

    setSaving(false);
    if (errors > 0) {
      alert(`${errors} item gagal disimpan. Sila semak console untuk butiran.`);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (loading) {
    return <AdminShell><p className="text-stone-500 text-sm">Memuatkan...</p></AdminShell>;
  }

  const emptyTextCount = SECTION_KEYS.filter((k) => !content[k]).length;

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Selepas Bersalin</h1>
          <p className="text-stone-500 text-xs mt-1">Semua teks, gambar, produk & content untuk halaman /bersalin</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/bersalin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview
          </a>
          {emptyTextCount > 0 && (
            <button
              onClick={() => {
                const empty = SECTION_KEYS.filter((k) => !content[k]);
                empty.forEach((k) => {
                  const shortKey = k.replace('bersalin_', '');
                  if (DEFAULTS[shortKey]) updateKey(k, DEFAULTS[shortKey]);
                });
              }}
              className="rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition"
            >
              Isi Semua Default ({emptyTextCount} kosong)
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-4 py-2 text-sm text-herb-gold hover:bg-herb-gold/30 disabled:opacity-50 transition">
            {saving ? 'Menyimpan...' : saved ? '✓ Disimpan' : 'Simpan'}
          </button>
        </div>
      </div>

      <div className="space-y-6 mt-4">
        {SECTIONS.map((section) => (
          <section key={section.label} className="rounded-xl border border-stone-700 bg-herb-surface/60 p-5">
            <h3 className="text-stone-200 text-sm font-semibold mb-4 pb-2 border-b border-stone-800">{section.label}</h3>
            <div className="space-y-4">
              {section.keys.map((field) => {
                const fullKey = `bersalin_${field.id}`;
                const isImage = 'image' in field && field.image;
                const isLong = 'long' in field && field.long;
                const defaultVal = DEFAULTS[field.id] ?? '';
                const isEmpty = !content[fullKey];

                if (isImage) {
                  return (
                    <div key={fullKey}>
                      <label className="block text-xs text-stone-400 mb-1">{field.hint}</label>
                      <FileUpload
                        accept="image/*"
                        folder="bersalin"
                        preview={content[fullKey] || undefined}
                        label={field.hint}
                        onUpload={(url) => { updateKey(fullKey, url); saveKey(fullKey, url); }}
                      />
                      {content[fullKey] && (
                        <input type="text" value={content[fullKey]} onChange={(e) => updateKey(fullKey, e.target.value)} className="mt-1 w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-1.5 text-stone-300 text-xs focus:border-herb-gold/50 focus:outline-none" />
                      )}
                    </div>
                  );
                }

                return (
                  <div key={fullKey}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-stone-400">{field.hint}</label>
                      {isEmpty && defaultVal && (
                        <button type="button" onClick={() => updateKey(fullKey, defaultVal)} className="text-[10px] text-stone-600 hover:text-herb-gold transition">Isi default</button>
                      )}
                    </div>
                    {isLong ? (
                      <textarea value={content[fullKey] ?? ''} onChange={(e) => updateKey(fullKey, e.target.value)} rows={3} placeholder={defaultVal} className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
                    ) : (
                      <input type="text" value={content[fullKey] ?? ''} onChange={(e) => updateKey(fullKey, e.target.value)} placeholder={defaultVal} className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* ── Product Picker Section ── */}
        <section className="rounded-xl border border-amber-700/30 bg-gradient-to-br from-amber-950/10 to-herb-surface/60 p-5">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
            <div>
              <h3 className="text-stone-200 text-sm font-semibold">Pilih Produk ({selectedIds.length} dipilih)</h3>
              <p className="text-stone-500 text-[11px] mt-0.5">Klik untuk pilih produk yang akan dipaparkan di halaman Selepas Bersalin. Customer klik produk akan terus ke halaman produk untuk order.</p>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="mb-4">
              <p className="text-amber-400/70 text-[11px] uppercase tracking-wider mb-2">Susunan paparan:</p>
              <div className="flex flex-wrap gap-2">
                {selectedIds.map((id, idx) => {
                  const p = allProducts.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-900/20 border border-amber-700/30 px-2.5 py-1.5 text-xs text-amber-300">
                      <span className="text-amber-500/60 font-mono text-[10px]">{idx + 1}.</span>
                      {p.name}
                      <button onClick={() => toggleProduct(id)} className="ml-1 text-amber-600 hover:text-red-400 transition">&times;</button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {allProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500 text-sm">Tiada produk dalam database. Tambah produk di <a href="/admin/produk" className="text-herb-gold hover:underline">Admin Produk</a>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`relative rounded-xl border text-left overflow-hidden transition-all ${
                      isSelected
                        ? 'border-amber-600/60 bg-amber-900/15 ring-1 ring-amber-600/30'
                        : 'border-stone-700 bg-herb-surface/40 hover:border-stone-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                    <div className="relative aspect-square bg-stone-950">
                      <Image src={product.image_url || FALLBACK_IMG} alt={product.name} fill className="object-cover" sizes="150px" unoptimized />
                    </div>
                    <div className="p-2.5">
                      <p className={`text-xs font-medium truncate ${isSelected ? 'text-amber-300' : 'text-stone-300'}`}>{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {product.price && <span className="text-[10px] text-stone-500">{product.price}</span>}
                        {product.heat && <span className="text-[10px] text-stone-600">{product.heat}</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
