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

const HARUMAN_IDS_KEY = 'bentuk_badan_product_ids';
const LEGEND_IDS_KEY = 'bentuk_badan_produk_legend_ids';

const DEFAULTS: Record<string, string> = {
  hero_badge: 'Produk Luaran',
  hero_title: 'Bentuk Badan',
  hero_title_highlight: 'Ideal',
  hero_desc: 'Set penjagaan badan yang memberi kesan panas seperti bersauna. Mengandungi losyen Mustajab Extra Hot, Super Hot dan Extreme Hot — tahap kepanasan berbeza untuk membantu metabolisme, bakar lemak dan kurangkan selulit.',
  intro_label: 'Set Mini Sauna Legend',
  intro_title: 'Kesan Panas Seperti Bersauna\nUntuk Bentuk Badan Yang Diingini',
  intro_p1: 'Sesuai dengan nama yang diberi, Set Mini Sauna adalah set penjagaan badan yang memberi kesan panas bagi mendapatkan khasiat seperti ketika anda sedang bersauna. Mengandungi 3 Losyen Mustajab — Extra Hot, Super Hot dan Extreme Hot — bersaiz 130ml setiap jenis.',
  intro_p2: 'Tahap kepanasan berbeza bertindak sebagai ejen yang dapat meningkatkan kadar metabolisme badan dan seterusnya boleh membantu membakar lemak serta membantu mengurangkan selulit di bahagian perut, peha, pinggul dan lain-lain tempat yang diperlukan.',
  tips_label: 'Khasiat & Kegunaan',
  tips_title: 'Kebaikan Set Mini Sauna',
  tip_1_icon: '🔥', tip_1_title: 'Tingkat Metabolisme', tip_1_desc: 'Kesan panas membantu meningkatkan kadar metabolisme badan untuk pembakaran lemak yang lebih efisien.',
  tip_2_icon: '💪', tip_2_title: 'Bakar Lemak', tip_2_desc: 'Digunakan bersama bengkung, korset atau girdle — amat digalakkan berserta senaman ringan untuk kesan optimum.',
  tip_3_icon: '✨', tip_3_title: 'Kurangkan Selulit', tip_3_desc: 'Sapu pada bahagian bermasalah seperti perut, lengan, peha dan pinggul — urutan pusingan seperti jam sebelum bengkung.',
  tip_4_icon: '🏃', tip_4_title: 'Sesuai Bersenam', tip_4_desc: 'Super Hot & Extreme Hot sesuai disapu ketika bersenam atau bersukan — kehangatan tahan lama membantu pembakaran.',
  tip_5_icon: '🩹', tip_5_title: 'Singkir Angin', tip_5_desc: 'Ekstrak halia membantu mengeluarkan angin dalam badan dan memberi keselesaan pada perut, urat dan otot.',
  tip_6_icon: '⏰', tip_6_title: 'Mudah & Praktikal', tip_6_desc: 'Boleh digunakan waktu pagi sebelum aktiviti atau bila-bila masa. Tidak berminyak, cepat menyerap.',
  article_1_title: 'Extra Hot — Tahap Panas 3', article_1_content: 'Diformulasikan dengan lebih ekstrak halia untuk tahap panas pertengahan. Amat sesuai untuk mereka yang inginkan bentuk badan yang ideal. Pemakaian bengkung atau korset amat digalakkan. Urutan pusingan seperti jam pada perut sebelum bengkung untuk kesan optimum.',
  article_2_title: 'Super Hot — Tahap Panas 4', article_2_content: 'Dengan tambahan Capsicum untuk kehangatan yang lebih tinggi. Sesuai untuk surirumah dengan aktiviti harian dan kegunaan ketika bersenam. Mengekalkan kehangatan ketika berpeluh dan membantu membakar lemak dengan lebih efisien. Boleh disapu nipis sebelum aktiviti bermula.',
  article_3_title: 'Extreme Hot — Tahap Panas 5', article_3_content: 'Tahap kepanasan paling tinggi dengan Iso Slim Complex. Menumpukan pada pembentukan dan kecantikan badan. Disyorkan sapu waktu malam sebelum tidur. Sesuai untuk mereka yang tahan panas dan mahukan kesan maksimum.',
  gallery_label: 'Galeri',
  gallery_title: 'Kegunaan & Cara Pakai',
  produk_label: 'Produk Disyorkan',
  produk_title: 'Set Mini Sauna Legend',
  produk_desc: 'Extra Hot, Super Hot & Extreme Hot — pilihan losyen untuk bentuk badan ideal',
  quote: 'Ketiga-tiga losyen ini adalah best seller dan kini hadir dalam Set Premium Mini Sauna Legend dengan harga mampu milik. Jaga pemakanan sihat, elakkan makanan manis dan bergas, serta lakukan senaman untuk kekal cergas dan cantik menawan.',
  quote_author: '— Dunia Herbs',
  cta_title: 'Dapatkan Bentuk Badan Ideal Anda',
  cta_desc: 'Hubungi kami untuk nasihat produk yang sesuai. Kami sedia membantu.',
};

const SECTIONS = [
  {
    label: 'Hero',
    keys: [
      { id: 'hero_badge', hint: 'Badge atas. Cth: Produk Luaran' },
      { id: 'hero_title', hint: 'Tajuk baris 1. Cth: Bentuk Badan' },
      { id: 'hero_title_highlight', hint: 'Tajuk baris 2 (gold). Cth: Ideal' },
      { id: 'hero_desc', hint: 'Penerangan bawah tajuk', long: true },
    ],
  },
  {
    label: 'Gambar & Pengenalan',
    keys: [
      { id: 'hero_image', hint: 'Gambar utama sebelah kiri artikel', image: true },
      { id: 'intro_label', hint: 'Label kecil. Cth: Set Mini Sauna Legend' },
      { id: 'intro_title', hint: 'Tajuk pengenalan. Guna \\n untuk baris baru', long: true },
      { id: 'intro_p1', hint: 'Perenggan 1', long: true },
      { id: 'intro_p2', hint: 'Perenggan 2', long: true },
    ],
  },
  {
    label: 'Tips & Khasiat (6 kad)',
    keys: [
      { id: 'tips_label', hint: 'Label seksyen' },
      { id: 'tips_title', hint: 'Tajuk seksyen. Cth: Kebaikan Set Mini Sauna' },
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
      { id: 'produk_title', hint: 'Tajuk. Cth: Set Mini Sauna Legend' },
      { id: 'produk_desc', hint: 'Penerangan ringkas', long: true },
    ],
  },
  {
    label: 'Quote & CTA',
    keys: [
      { id: 'quote', hint: 'Quote', long: true },
      { id: 'quote_author', hint: 'Sumber quote. Cth: — Dunia Herbs' },
      { id: 'cta_title', hint: 'Tajuk CTA. Cth: Dapatkan Bentuk Badan Ideal Anda' },
      { id: 'cta_desc', hint: 'Penerangan CTA', long: true },
    ],
  },
];

const SECTION_KEYS = SECTIONS.flatMap((s) => s.keys.map((k) => `bentuk_badan_${k.id}`));
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100&h=100&fit=crop';

export default function AdminBentukBadanPage() {
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

    const allKeys = [...SECTION_KEYS, HARUMAN_IDS_KEY, LEGEND_IDS_KEY];
    for (const key of allKeys) {
      const val = content[key] ?? '';
      const { error } = await supabase.from('site_content').upsert({ id: key, value: val }, { onConflict: 'id' });
      if (error) { console.error(`Gagal simpan ${key}:`, error.message); errors++; }
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
          <h1 className="font-serif text-2xl font-bold text-stone-100">Bentuk Badan Ideal</h1>
          <p className="text-stone-500 text-xs mt-1">Semua teks, gambar & produk untuk halaman /bentuk-badan (Set Mini Sauna Legend)</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/bentuk-badan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview
          </a>
          {emptyTextCount > 0 && (
            <button
              onClick={() => {
                const empty = SECTION_KEYS.filter((k) => !content[k]);
                empty.forEach((k) => {
                  const shortKey = k.replace('bentuk_badan_', '');
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
                const fullKey = `bentuk_badan_${field.id}`;
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
                        folder="bentuk-badan"
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
              <p className="text-stone-500 text-[11px] mt-0.5">Pilih produk untuk seksyen ATAS (Koleksi Haruman). Kosong = guna dari Site Content homepage atau auto Hot/Extreme.</p>
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
              <p className="text-stone-500 text-[11px] mt-0.5">Pilih produk untuk seksyen BAWAH (Koleksi Legend). Kosong = guna dari Site Content homepage atau auto Mild/berbadge.</p>
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
