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

const HARUMAN_IDS_KEY = 'seisi_keluarga_product_ids';
const LEGEND_IDS_KEY = 'seisi_keluarga_produk_legend_ids';

const DEFAULTS: Record<string, string> = {
  hero_badge: 'Losyen Pati Halia',
  hero_title: 'Kegunaan',
  hero_title_highlight: 'Seisi Keluarga',
  hero_desc: 'Losyen Mustajab Ekstrak Halia adalah losyen pertama keluaran Dunia Herbs seterusnya menjadi peneraju utama dalam pengeluaran losyen hangat berasaskan halia. Kegunaan seisi keluarga dan losyen serbaguna — harus dimiliki oleh setiap isi rumah.',
  intro_label: 'Losyen Mustajab Pati Halia',
  intro_title: 'Perintis Losyen Pati Halia\nSejak 2005',
  intro_p1: 'Sejak mula diperkenalkan pada tahun 2005, Losyen Mustajab Pati Halia Dunia Herbs menjadi perintis bagi produk losyen berasaskan pati halia. Losyen ini bersifat tidak melekit dan cepat meresap pada kulit serta mempunyai kehangatan yang sederhana.',
  intro_p2: 'Halia atau nama saintifiknya Zingiber officinale dari keluarga Zingiberaceae kaya dengan kandungan kalium, fosforus dan kalsium, protein, karbohidrat, gentian, vitamin C dan niasin. Khasiat halia dalam merawat pelbagai penyakit bukan saja diketahui menerusi kaedah tradisional malah telah dibuktikan oleh pakar-pakar perubatan moden.',
  tips_label: 'Khasiat & Kegunaan',
  tips_title: 'Kebaikan Losyen Pati Halia',
  tip_1_icon: '💆', tip_1_title: 'Digunakan Untuk Tujuan Urutan', tip_1_desc: 'Sesuai untuk urutan badan, sendi dan otot. Kehangatan halia membantu melancarkan pengaliran darah dan melegakan ketidakselesaan.',
  tip_2_icon: '🔄', tip_2_title: 'Boleh Digunakan Sekerap Mungkin', tip_2_desc: 'Tidak berminyak dan cepat meresap. Gunakan secara konsisten dibantu dengan senaman ringan untuk kesan optimum.',
  tip_3_icon: '👨‍👩‍👧‍👦', tip_3_title: 'Kegunaan Seisi Keluarga', tip_3_desc: 'Sesuai untuk pelbagai lapisan masyarakat. Kecuali bayi. Mudah dibawa kemana sahaja.',
  tip_4_icon: '🩹', tip_4_title: 'Legakan Ketidakselesaan', tip_4_desc: 'Kandungan aktif Gingeroles dalam halia memberi kesan apabila meresap ke dalam badan. Membantu melegakan sendi dan otot.',
  tip_5_icon: '✨', tip_5_title: 'Serbaguna & Praktikal', tip_5_desc: 'Satu produk untuk pelbagai kegunaan — urutan, ketidakselesaan badan, angin dalam badan. Sesuai untuk rutin harian.',
  tip_6_icon: '🕐', tip_6_title: '20 Tahun Di Pasaran', tip_6_desc: 'Produk perintis Dunia Herbs yang telah dipercayai ramai sejak 2005. KKM & Halal JAKIM.',
  article_1_title: 'Perintis Losyen Pati Halia', article_1_content: 'Losyen Mustajab Pati Halia ialah produk pertama keluaran Dunia Herbs dan seterusnya menjadi peneraju utama dalam pengeluaran losyen hangat berasaskan halia di Malaysia. Losyen serbaguna yang harus dimiliki oleh setiap isi rumah.',
  article_2_title: 'Khasiat Halia & Gingeroles', article_2_content: 'Menurut kajian, kandungan aktif dalam halia yang dikenali sebagai Gingeroles memberi kesan apabila ia meresap ke dalam badan. Halia membantu melancarkan peredaran darah, mengurangkan bengkak, membuang angin, dan memberikan kehangatan semula jadi.',
  article_3_title: 'Sesuai Untuk Semua', article_3_content: 'Dari remaja hingga warga emas, losyen ini sesuai untuk pelbagai lapisan masyarakat. Sapuan pada sendi, otot atau abdomen. Untuk luaran sahaja. Tidak sesuai untuk bayi. Harga: SM RM23.00 / SS RM26.00. Kandungan: 130ml.',
  umrah_title: 'Kegunaan Semasa Umrah & Haji',
  umrah_content: 'Losyen Mustajab Pati Halia amat sesuai dibawa bersama semasa menunaikan umrah atau haji di tanah suci Mekah. Cuaca panas dan perjalanan jauh boleh menyebabkan ketidakselesaan sendi, otot dan angin dalam badan. Sapuan losyen pada bahagian yang dikehendaki dapat membantu melegakan ketidakselesaan dan memberi kehangatan yang menyegarkan. Saiz 130ml mudah dibawa dalam bagasi. Halal JAKIM — sesuai untuk jemaah.',
  gallery_label: 'Galeri',
  gallery_title: 'Kegunaan & Cara Pakai',
  produk_label: 'Produk Disyorkan',
  produk_haruman_title: 'KOLEKSI HARUMAN',
  produk_legend_title: 'KOLEKSI LEGEND',
  produk_desc: 'Pilihan losyen pati halia kuning — Legend & Haruman. Sesuai untuk kegunaan seisi keluarga.',
  quote: 'Losyen Mustajab Pati Halia memiliki banyak kelebihan serta kegunaannya. Ianya mudah dibawa kemana sahaja dan sesuai untuk pelbagai lapisan masyarakat. Gunakan secara konsisten dan dibantu dengan senaman ringan, pasti peroleh kesan yang optimum.',
  quote_author: '— Dunia Herbs',
  cta_title: 'Dapatkan Losyen Pati Halia Anda',
  cta_desc: 'Hubungi kami untuk nasihat produk yang sesuai. Kami sedia membantu.',
};

const SECTIONS = [
  {
    label: 'Hero',
    keys: [
      { id: 'hero_badge', hint: 'Badge atas. Cth: Losyen Pati Halia' },
      { id: 'hero_title', hint: 'Tajuk baris 1. Cth: Kegunaan' },
      { id: 'hero_title_highlight', hint: 'Tajuk baris 2 (gold). Cth: Seisi Keluarga' },
      { id: 'hero_desc', hint: 'Penerangan bawah tajuk', long: true },
    ],
  },
  {
    label: 'Gambar & Pengenalan',
    keys: [
      { id: 'hero_image', hint: 'Gambar utama sebelah kiri artikel', image: true },
      { id: 'intro_label', hint: 'Label kecil. Cth: Losyen Mustajab Pati Halia' },
      { id: 'intro_title', hint: 'Tajuk pengenalan. Guna \\n untuk baris baru', long: true },
      { id: 'intro_p1', hint: 'Perenggan 1', long: true },
      { id: 'intro_p2', hint: 'Perenggan 2', long: true },
    ],
  },
  {
    label: 'Tips & Khasiat (6 kad)',
    keys: [
      { id: 'tips_label', hint: 'Label seksyen. Cth: Khasiat & Kegunaan' },
      { id: 'tips_title', hint: 'Tajuk seksyen. Cth: Kebaikan Losyen Pati Halia' },
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
    label: 'Segmen Umrah & Haji (bonus)',
    keys: [
      { id: 'umrah_title', hint: 'Tajuk segmen. Cth: Kegunaan Semasa Umrah & Haji' },
      { id: 'umrah_content', hint: 'Kandungan segmen — kegunaan losyen semasa umrah/haji di Mekah', long: true },
    ],
  },
  {
    label: 'Galeri (3 gambar)',
    keys: [
      { id: 'gallery_label', hint: 'Label seksyen. Cth: Galeri' },
      { id: 'gallery_title', hint: 'Tajuk seksyen. Cth: Kegunaan & Cara Pakai' },
      { id: 'gallery_1', hint: 'Gambar 1', image: true },
      { id: 'gallery_2', hint: 'Gambar 2', image: true },
      { id: 'gallery_3', hint: 'Gambar 3', image: true },
    ],
  },
  {
    label: 'Teks Seksyen Produk',
    keys: [
      { id: 'produk_label', hint: 'Label. Cth: Produk Disyorkan' },
      { id: 'produk_haruman_title', hint: 'Tajuk Koleksi Haruman. Cth: KOLEKSI HARUMAN' },
      { id: 'produk_legend_title', hint: 'Tajuk Koleksi Legend. Cth: KOLEKSI LEGEND' },
      { id: 'produk_desc', hint: 'Penerangan ringkas', long: true },
    ],
  },
  {
    label: 'Quote & CTA',
    keys: [
      { id: 'quote', hint: 'Quote', long: true },
      { id: 'quote_author', hint: 'Sumber quote. Cth: — Dunia Herbs' },
      { id: 'cta_title', hint: 'Tajuk CTA. Cth: Dapatkan Losyen Pati Halia Anda' },
      { id: 'cta_desc', hint: 'Penerangan CTA', long: true },
    ],
  },
];

const SECTION_KEYS = SECTIONS.flatMap((s) => s.keys.map((k) => `seisi_keluarga_${k.id}`));
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100&h=100&fit=crop';

export default function AdminSeisiKeluargaPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [harumanIds, setHarumanIds] = useState<string[]>([]);
  const [legendIds, setLegendIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function fetchAll() {
    const supabase = getSupabaseBrowser();
    const [{ data: siteData }, { data: prodData }] = await Promise.all([
      supabase.from('site_content').select('id, value'),
      supabase.from('products').select('id, name, tagline, price, badge, heat, image_url').eq('visible', true).order('sort_order', { ascending: true }),
    ]);

    const map: Record<string, string> = {};
    (siteData ?? []).forEach((row: { id: string; value: string }) => { map[row.id] = row.value ?? ''; });
    setContent(map);
    setAllProducts((prodData as Product[]) ?? []);

    const hIds = (map[HARUMAN_IDS_KEY] || '').split(',').map((s) => s.trim()).filter(Boolean);
    const lIds = (map[LEGEND_IDS_KEY] || '').split(',').map((s) => s.trim()).filter(Boolean);
    setHarumanIds(hIds);
    setLegendIds(lIds);
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

  function toggleHaruman(id: string) {
    setHarumanIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      updateKey(HARUMAN_IDS_KEY, next.join(','));
      return next;
    });
    setSaved(false);
  }

  function toggleLegend(id: string) {
    setLegendIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      updateKey(LEGEND_IDS_KEY, next.join(','));
      return next;
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = getSupabaseBrowser();
    let errors = 0;

    for (const key of SECTION_KEYS) {
      const val = content[key] ?? '';
      const { error } = await supabase.from('site_content').upsert({ id: key, value: val }, { onConflict: 'id' });
      if (error) { console.error(`Gagal simpan ${key}:`, error.message); errors++; }
    }
    const { error: errH } = await supabase.from('site_content').upsert({ id: HARUMAN_IDS_KEY, value: harumanIds.join(',') }, { onConflict: 'id' });
    if (errH) { console.error('Gagal simpan Haruman:', errH.message); errors++; }
    const { error: errL } = await supabase.from('site_content').upsert({ id: LEGEND_IDS_KEY, value: legendIds.join(',') }, { onConflict: 'id' });
    if (errL) { console.error('Gagal simpan Legend:', errL.message); errors++; }

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
          <h1 className="font-serif text-2xl font-bold text-stone-100">Seisi Keluarga</h1>
          <p className="text-stone-500 text-xs mt-1">Semua teks, gambar, produk & content untuk halaman /seisi-keluarga (Losyen Pati Halia — Legend & Haruman)</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/seisi-keluarga" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview
          </a>
          {emptyTextCount > 0 && (
            <button
              onClick={() => {
                const empty = SECTION_KEYS.filter((k) => !content[k]);
                empty.forEach((k) => {
                  const shortKey = k.replace('seisi_keluarga_', '');
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
                const fullKey = `seisi_keluarga_${field.id}`;
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
                        folder="seisi-keluarga"
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

        {/* ── Koleksi Haruman ── */}
        <section className="rounded-xl border border-amber-700/30 bg-gradient-to-br from-amber-950/10 to-herb-surface/60 p-5">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
            <div>
              <h3 className="text-stone-200 text-sm font-semibold">Koleksi Haruman ({harumanIds.length} dipilih)</h3>
              <p className="text-stone-500 text-[11px] mt-0.5">Produk untuk seksyen ATAS (Koleksi Haruman). Kosong = seksyen disembunyikan di halaman user.</p>
            </div>
          </div>
          {harumanIds.length > 0 && (
            <div className="mb-4">
              <p className="text-amber-400/70 text-[11px] uppercase tracking-wider mb-2">Susunan paparan:</p>
              <div className="flex flex-wrap gap-2">
                {harumanIds.map((id, idx) => {
                  const p = allProducts.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-900/20 border border-amber-700/30 px-2.5 py-1.5 text-xs text-amber-300">
                      <span className="text-amber-500/60 font-mono text-[10px]">{idx + 1}.</span>
                      {p.name}
                      <button onClick={() => toggleHaruman(id)} className="ml-1 text-amber-600 hover:text-red-400 transition">&times;</button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {allProducts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-stone-500 text-sm">Tiada produk. Tambah di <a href="/admin/produk" className="text-herb-gold hover:underline">Admin Produk</a>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allProducts.map((product) => {
                const isSelected = harumanIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleHaruman(product.id)}
                    className={`relative rounded-xl border text-left overflow-hidden transition-all ${
                      isSelected ? 'border-amber-600/60 bg-amber-900/15 ring-1 ring-amber-600/30' : 'border-stone-700 bg-herb-surface/40 hover:border-stone-600'
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

        {/* ── Koleksi Legend ── */}
        <section className="rounded-xl border border-amber-700/30 bg-gradient-to-br from-amber-950/10 to-herb-surface/60 p-5">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
            <div>
              <h3 className="text-stone-200 text-sm font-semibold">Koleksi Legend ({legendIds.length} dipilih)</h3>
              <p className="text-stone-500 text-[11px] mt-0.5">Produk untuk seksyen BAWAH (Koleksi Legend). Kosong = seksyen disembunyikan di halaman user.</p>
            </div>
          </div>
          {legendIds.length > 0 && (
            <div className="mb-4">
              <p className="text-amber-400/70 text-[11px] uppercase tracking-wider mb-2">Susunan paparan:</p>
              <div className="flex flex-wrap gap-2">
                {legendIds.map((id, idx) => {
                  const p = allProducts.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-900/20 border border-amber-700/30 px-2.5 py-1.5 text-xs text-amber-300">
                      <span className="text-amber-500/60 font-mono text-[10px]">{idx + 1}.</span>
                      {p.name}
                      <button onClick={() => toggleLegend(id)} className="ml-1 text-amber-600 hover:text-red-400 transition">&times;</button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {allProducts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-stone-500 text-sm">Tiada produk. Tambah di <a href="/admin/produk" className="text-herb-gold hover:underline">Admin Produk</a>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allProducts.map((product) => {
                const isSelected = legendIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleLegend(product.id)}
                    className={`relative rounded-xl border text-left overflow-hidden transition-all ${
                      isSelected ? 'border-amber-600/60 bg-amber-900/15 ring-1 ring-amber-600/30' : 'border-stone-700 bg-herb-surface/40 hover:border-stone-600'
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
