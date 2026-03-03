'use client';

import AdminShell from '@/components/admin/AdminShell';
import FileUpload from '@/components/admin/FileUpload';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

type Product = { id: string; name: string; tagline: string; price: string; heat: string; image_url?: string };

const FASHA_KEYS = [
  'fasha_visible',
  'fasha_hero_image',
  'fasha_hero_badge',
  'fasha_hero_title',
  'fasha_hero_subtitle',
  'fasha_hero_description',
  'fasha_quote',
  'fasha_cta_title',
  'fasha_cta_subtitle',
  'fasha_picks',
] as const;

const LABELS: Record<string, string> = {
  fasha_visible: 'Tunjuk landing page Fasha (1=ya, 0=sembunyi)',
  fasha_hero_image: 'URL gambar hero Fasha',
  fasha_hero_badge: 'Badge atas (cth: Duta Rasmi Dunia Herbs)',
  fasha_hero_title: 'Tajuk utama (cth: Fasha Sandha)',
  fasha_hero_subtitle: 'Subtitle (cth: × Dunia Herbs)',
  fasha_hero_description: 'Keterangan hero',
  fasha_quote: 'Quote/testimoni Fasha',
  fasha_cta_title: 'Tajuk CTA akhir',
  fasha_cta_subtitle: 'Subtitle CTA',
  fasha_picks: 'Product IDs untuk Fasha\'s Pick (auto dari pilihan bawah)',
};

export default function AdminFashaPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function fetchContent() {
    const supabase = getSupabaseBrowser();
    const { data: sc } = await supabase.from('site_content').select('id, value');
    const map: Record<string, string> = {};
    (sc ?? []).forEach((row: { id: string; value: string }) => {
      map[row.id] = row.value ?? '';
    });
    setContent(map);
    const picks = (map.fasha_picks || '').split(',').map((s) => s.trim()).filter(Boolean);
    setSelectedIds(picks);
  }

  async function fetchProducts() {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.from('products').select('id, name, tagline, price, heat, image_url').order('sort_order');
    setProducts(data ?? []);
  }

  useEffect(() => {
    Promise.all([fetchContent(), fetchProducts()]).then(() => setLoading(false));
  }, []);

  function updateKey(key: string, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function toggleProduct(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = getSupabaseBrowser();
    const picksStr = selectedIds.join(',');
    const toSave = { ...content, fasha_picks: picksStr };
    for (const key of FASHA_KEYS) {
      const value = key === 'fasha_picks' ? picksStr : ((toSave as Record<string, string>)[key] ?? '');
      const { error } = await supabase.from('site_content').upsert({ id: key, value }, { onConflict: 'id' });
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
          <h1 className="font-serif text-2xl font-bold text-stone-100">Fasha Landing Page</h1>
          <p className="text-stone-500 text-sm mt-1">Edit kandungan landing page /fasha</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-4 py-2 text-sm text-herb-gold hover:bg-herb-gold/30 disabled:opacity-50"
        >
          {saving ? 'Menyimpan...' : saved ? 'Disimpan!' : 'Simpan Semua'}
        </button>
      </div>

      <div className="space-y-8">
        <section className="rounded-xl border border-stone-700 bg-herb-surface/60 p-6">
          <h2 className="font-serif text-lg font-bold text-herb-gold mb-4">Hero</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_visible}</label>
              <input
                type="text"
                value={content.fasha_visible ?? '1'}
                onChange={(e) => updateKey('fasha_visible', e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_hero_image}</label>
              <FileUpload
                accept="image/*"
                folder="images"
                preview={content.fasha_hero_image || undefined}
                previewType="image"
                label="Upload gambar hero Fasha"
                onUpload={(url) => updateKey('fasha_hero_image', url)}
              />
              {content.fasha_hero_image && (
                <input
                  type="text"
                  value={content.fasha_hero_image}
                  onChange={(e) => updateKey('fasha_hero_image', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-xs"
                  placeholder="Atau masukkan URL manual..."
                />
              )}
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_hero_badge}</label>
              <input
                type="text"
                value={content.fasha_hero_badge ?? ''}
                onChange={(e) => updateKey('fasha_hero_badge', e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_hero_title}</label>
              <input
                type="text"
                value={content.fasha_hero_title ?? ''}
                onChange={(e) => updateKey('fasha_hero_title', e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_hero_subtitle}</label>
              <input
                type="text"
                value={content.fasha_hero_subtitle ?? ''}
                onChange={(e) => updateKey('fasha_hero_subtitle', e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_hero_description}</label>
              <textarea
                value={content.fasha_hero_description ?? ''}
                onChange={(e) => updateKey('fasha_hero_description', e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-stone-700 bg-herb-surface/60 p-6">
          <h2 className="font-serif text-lg font-bold text-herb-gold mb-4">Quote Fasha</h2>
          <div>
            <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_quote}</label>
            <textarea
              value={content.fasha_quote ?? ''}
              onChange={(e) => updateKey('fasha_quote', e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100"
            />
          </div>
        </section>

        <section className="rounded-xl border border-stone-700 bg-herb-surface/60 p-6">
          <h2 className="font-serif text-lg font-bold text-herb-gold mb-4">CTA Akhir</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_cta_title}</label>
              <input
                type="text"
                value={content.fasha_cta_title ?? ''}
                onChange={(e) => updateKey('fasha_cta_title', e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">{LABELS.fasha_cta_subtitle}</label>
              <input
                type="text"
                value={content.fasha_cta_subtitle ?? ''}
                onChange={(e) => updateKey('fasha_cta_subtitle', e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-stone-700 bg-herb-surface/60 p-6">
          <h2 className="font-serif text-lg font-bold text-herb-gold mb-2">Fasha&apos;s Pick</h2>
          <p className="text-stone-500 text-sm mb-4">Pilih produk yang akan dipaparkan di bahagian Fasha&apos;s Pick. Susunan ikut pilihan anda.</p>
          <div className="flex flex-wrap gap-3">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProduct(p.id)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selectedIds.includes(p.id)
                    ? 'border-herb-gold bg-herb-gold/20 text-herb-gold'
                    : 'border-stone-700 bg-herb-surface/60 text-stone-400 hover:border-stone-600'
                }`}
              >
                <span className="font-medium">{p.name}</span>
                <span className="block text-xs opacity-80">{p.price} • {p.heat}</span>
              </button>
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-stone-500 text-sm">Tiada produk. Tambah produk di halaman Produk dulu.</p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
