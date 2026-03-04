'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import FileUpload from '@/components/admin/FileUpload';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Product = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  badge?: string;
  heat?: string;
  size: string;
  description: string;
  benefits: string[];
  usage_info: string;
  image_url: string;
  packaging_color?: string;
  sort_order: number;
  visible: boolean;
};

const HEAT_OPTIONS = [
  { value: 'None', label: 'None' },
  { value: 'Mild', label: 'Mild (Tahap 1)' },
  { value: 'Hot', label: 'Hot (Tahap 2)' },
  { value: 'Extra Hot', label: 'Extra Hot (Tahap 3)' },
  { value: 'Super Hot', label: 'Super Hot (Tahap 4)' },
  { value: 'Extreme', label: 'Extreme Hot (Tahap 5)' },
  { value: 'Mix', label: 'Mix (Set campur tahap kepanasan)' },
  { value: 'Produk minuman/makanan', label: 'Produk minuman/makanan' },
];

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  tagline: '',
  price: '',
  badge: '',
  heat: 'Mild',
  size: '130ml',
  description: '',
  benefits: [],
  usage_info: '',
  image_url: '',
  packaging_color: '',
  sort_order: 0,
  visible: true,
};

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [harumanIds, setHarumanIds] = useState<string[]>([]);
  const [legendIds, setLegendIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCollectionIds();
  }, []);

  async function fetchCollectionIds() {
    const supabase = getSupabaseBrowser();
    const [haruman, legend] = await Promise.all([
      supabase.from('site_content').select('value').eq('id', 'produk_ids').single(),
      supabase.from('site_content').select('value').eq('id', 'produk_legend_ids').single(),
    ]);
    setHarumanIds((haruman.data?.value || '').split(',').map((s) => s.trim()).filter(Boolean));
    setLegendIds((legend.data?.value || '').split(',').map((s) => s.trim()).filter(Boolean));
  }

  async function toggleHaruman(productId: string) {
    const isIn = harumanIds.length === 0 || harumanIds.includes(productId);
    let next: string[];
    if (isIn) {
      if (harumanIds.length === 0) {
        next = products.map((p) => p.id).filter((id) => id !== productId);
      } else {
        next = harumanIds.filter((id) => id !== productId);
      }
    } else {
      next = [...harumanIds, productId];
    }
    setHarumanIds(next);
    const supabase = getSupabaseBrowser();
    await supabase.from('site_content').upsert({ id: 'produk_ids', value: next.join(',') }, { onConflict: 'id' });
  }

  async function toggleLegend(productId: string) {
    const isIn = legendIds.includes(productId);
    const next = isIn ? legendIds.filter((id) => id !== productId) : [...legendIds, productId];
    setLegendIds(next);
    const supabase = getSupabaseBrowser();
    await supabase.from('site_content').upsert({ id: 'produk_legend_ids', value: next.join(',') }, { onConflict: 'id' });
  }

  async function fetchProducts() {
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setProducts((data as Product[]) ?? []);
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyProduct);
    setError('');
    setModalOpen(true);
  }

  function openEdit(row: Product) {
    setEditing(row);
    setForm({
      name: row.name,
      tagline: row.tagline ?? '',
      price: row.price ?? '',
      badge: row.badge ?? '',
      heat: row.heat ?? 'Mild',
      size: row.size ?? '130ml',
      description: row.description ?? '',
      benefits: row.benefits ?? [],
      usage_info: row.usage_info ?? '',
      image_url: row.image_url ?? '',
      packaging_color: row.packaging_color ?? '',
      sort_order: row.sort_order ?? 0,
      visible: row.visible ?? true,
    });
    setError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyProduct);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const supabase = getSupabaseBrowser();
      const payload = {
        name: form.name,
        tagline: form.tagline,
        price: form.price,
        badge: form.badge || null,
        heat: form.heat,
        size: form.size,
        description: form.description,
        benefits: form.benefits.filter(Boolean),
        usage_info: form.usage_info,
        image_url: form.image_url || null,
        packaging_color: form.packaging_color || null,
        sort_order: form.sort_order,
        visible: form.visible,
      };

      if (editing) {
        const { error: err } = await supabase.from('products').update(payload).eq('id', editing.id);
        if (err) {
          setError(err.message);
          return;
        }
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p)),
        );
      } else {
        const { data: inserted, error: err } = await supabase
          .from('products')
          .insert(payload)
          .select()
          .single();
        if (err) {
          setError(err.message);
          return;
        }
        if (inserted) {
          setProducts((prev) => [...prev, inserted as Product].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
        } else {
          fetchProducts();
        }
      }
      closeModal();
    } catch (ex) {
      const msg = ex instanceof Error ? ex.message : String(ex);
      setError(msg || 'Ralat tidak diketahui');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: Product) {
    if (!confirm(`Padam "${row.name}"?`)) return;
    const supabase = getSupabaseBrowser();
    const { error: err } = await supabase.from('products').delete().eq('id', row.id);
    if (err) {
      alert(err.message);
      return;
    }
    fetchProducts();
  }

  const benefitsText = form.benefits.join('\n');
  const setBenefitsText = (s: string) =>
    setForm((f) => ({ ...f, benefits: s ? s.split(/\r?\n/) : [] }));

  const inputClass =
    'w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:border-herb-gold focus:outline-none';
  const labelClass = 'text-stone-400 text-sm mb-1 block';

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Produk</h1>
          <p className="text-stone-500 text-xs mt-1">Homepage ada dua seksyen: <strong className="text-stone-400">Koleksi Haruman</strong> (atas — semua produk) & <strong className="text-stone-400">Koleksi Legend</strong> (bawah). Toggle "Legend" untuk pilih produk yang dipaparkan di Koleksi Legend.</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/#produk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Haruman
          </a>
          <a
            href="/#produk-legend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Legend
          </a>
          <button
            onClick={openAdd}
            className="rounded-xl bg-herb-gold px-4 py-2.5 text-sm font-semibold text-herb-dark transition hover:bg-herb-goldLight"
          >
            Tambah
          </button>
        </div>
      </div>
      <div className="mb-6 rounded-lg border border-stone-800 bg-stone-900/50 px-4 py-3 space-y-2">
        <p className="text-stone-500 text-xs leading-relaxed">
          <span className="text-stone-400 font-medium">Guide:</span> Setiap produk ada gambar, nama, harga, heat level (Tahap 1-5), dan badge. Upload gambar terus — drag &amp; drop. Sort order menentukan susunan.
        </p>
        <p className="text-stone-500 text-xs leading-relaxed">
          <span className="text-herb-gold font-medium">Haruman & Legend:</span> Toggle untuk pilih produk dalam setiap koleksi. <strong>Haruman</strong> (atas) — kosong = semua produk. <strong>Legend</strong> (bawah) — kosong = auto (Mild/berbadge).
        </p>
      </div>

      {error && !modalOpen && (
        <div className="mb-4 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-red-400 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-300">×</button>
        </div>
      )}

      {loading ? (
        <p className="text-stone-500 text-sm">Memuatkan...</p>
      ) : (
        <AdminTable<Product>
          columns={[
            {
              key: 'image_url',
              label: '',
              render: (row) =>
                row.image_url ? (
                  <img src={row.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-stone-800 flex items-center justify-center text-stone-600 text-xs">—</div>
                ),
            },
            { key: 'name', label: 'Nama' },
            { key: 'price', label: 'Harga' },
            { key: 'badge', label: 'Badge' },
            { key: 'heat', label: 'Heat' },
            { key: 'size', label: 'Saiz' },
            {
              key: 'visible',
              label: 'Visible',
              render: (row) => (
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    row.visible
                      ? 'bg-herb-gold/20 text-herb-gold'
                      : 'bg-stone-700/50 text-stone-500'
                  }`}
                >
                  {row.visible ? 'Ya' : 'Tidak'}
                </span>
              ),
            },
            {
              key: 'haruman',
              label: 'Haruman',
              render: (row) => {
                const inHaruman = harumanIds.length === 0 || harumanIds.includes(row.id);
                return (
                  <button
                    type="button"
                    onClick={() => toggleHaruman(row.id)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                      inHaruman
                        ? 'bg-herb-gold/30 text-herb-gold border border-herb-gold/50'
                        : 'bg-stone-800 text-stone-500 border border-stone-700 hover:border-stone-600'
                    }`}
                  >
                    {inHaruman ? '✓ Haruman' : 'Haruman'}
                  </button>
                );
              },
            },
            {
              key: 'legend',
              label: 'Legend',
              render: (row) => {
                const inLegend = legendIds.includes(row.id);
                return (
                  <button
                    type="button"
                    onClick={() => toggleLegend(row.id)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                      inLegend
                        ? 'bg-herb-gold/30 text-herb-gold border border-herb-gold/50'
                        : 'bg-stone-800 text-stone-500 border border-stone-700 hover:border-stone-600'
                    }`}
                  >
                    {inLegend ? '✓ Legend' : 'Legend'}
                  </button>
                );
              },
            },
          ]}
          rows={products}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !saving && closeModal()}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-stone-700 bg-herb-surface shadow-2xl">
            <div className="sticky top-0 border-b border-stone-700 bg-herb-surface/95 px-6 py-4">
              <h2 className="font-serif text-xl font-bold text-herb-gold">
                {editing ? 'Edit Produk' : 'Tambah Produk'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div>
                <label className={labelClass}>Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Harga</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className={inputClass}
                    placeholder="RM 22.90"
                  />
                </div>
                <div>
                  <label className={labelClass}>Badge</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    className={inputClass}
                    placeholder="Bestseller, Popular, dll"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Heat Level</label>
                  <select
                    value={form.heat}
                    onChange={(e) => setForm((f) => ({ ...f, heat: e.target.value }))}
                    className={inputClass}
                  >
                    {HEAT_OPTIONS.map((h) => (
                      <option key={h.value} value={h.value}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Saiz</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                    className={inputClass}
                    placeholder="130ml"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={`${inputClass} min-h-[80px]`}
                  rows={3}
                />
              </div>
              <div>
                <label className={labelClass}>Benefits (satu per baris)</label>
                <textarea
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.stopPropagation();
                  }}
                  className={`${inputClass} min-h-[100px]`}
                  placeholder="Satu benefit per baris"
                  rows={4}
                />
              </div>
              <div>
                <label className={labelClass}>Usage Info</label>
                <textarea
                  value={form.usage_info}
                  onChange={(e) => setForm((f) => ({ ...f, usage_info: e.target.value }))}
                  className={`${inputClass} min-h-[60px]`}
                  rows={2}
                />
              </div>
              <div>
                <label className={labelClass}>Warna Tiub/Botol (untuk AI chatbot)</label>
                <input
                  type="text"
                  value={form.packaging_color}
                  onChange={(e) => setForm((f) => ({ ...f, packaging_color: e.target.value }))}
                  className={inputClass}
                  placeholder="Cth: Botol putih, label hijau & kuning. Tiub putih."
                />
                <p className="text-stone-600 text-xs mt-1">Emma akan guna maklumat ini bila pelanggan tanya warna packaging.</p>
              </div>
              <div>
                <label className={labelClass}>Gambar Produk</label>
                <FileUpload
                  accept="image/*"
                  folder="products"
                  preview={form.image_url || undefined}
                  previewType="image"
                  label="Upload gambar produk"
                  onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
                />
                {form.image_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={form.image_url}
                      onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                      className={`${inputClass} text-xs`}
                      placeholder="Atau masukkan URL manual..."
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
                      className="text-red-400 hover:text-red-300 text-xs whitespace-nowrap"
                    >
                      Padam
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))
                    }
                    className={inputClass}
                    min={0}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.visible}
                      onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
                      className="rounded border-stone-600 bg-herb-surface text-herb-gold focus:ring-herb-gold"
                    />
                    <span className="text-stone-300 text-sm">Visible</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-stone-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-herb-gold px-5 py-2.5 text-sm font-semibold text-herb-dark transition hover:bg-herb-goldLight disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-stone-600 px-5 py-2.5 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
