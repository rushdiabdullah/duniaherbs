'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { Promotion } from '@/lib/promotions';

type Product = { id: string; name: string; price?: string };

type PromosiForm = {
  name: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  applies_to: 'all' | 'single' | 'group';
  product_ids: string;
  group_key: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

const GROUP_OPTIONS: { value: string; label: string }[] = [
  { value: 'haruman', label: 'Koleksi Haruman (Homepage)' },
  { value: 'legend', label: 'Koleksi Legend (Homepage)' },
  { value: 'bersalin', label: 'Selepas Bersalin' },
  { value: 'bentuk_badan', label: 'Bentuk Badan Ideal' },
  { value: 'minuman', label: 'Produk Minuman' },
  { value: 'seisi_keluarga', label: 'Seisi Keluarga' },
];

const emptyForm: PromosiForm = {
  name: '',
  discount_type: 'percentage',
  discount_value: 10,
  applies_to: 'all',
  product_ids: '',
  group_key: '',
  start_date: '',
  end_date: '',
  is_active: true,
};

export default function AdminPromosiPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState<PromosiForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchPromotions() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      setPromotions([]);
    } else {
      setPromotions((data ?? []).map((r) => ({ ...r, discount_value: Number(r.discount_value) })) as Promotion[]);
    }
  }

  async function fetchProducts() {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.from('products').select('id, name, price').eq('visible', true).order('sort_order');
    setProducts((data ?? []) as Product[]);
  }

  useEffect(() => {
    Promise.all([fetchPromotions(), fetchProducts()]).finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p: Promotion) {
    setEditing(p);
    setForm({
      name: p.name,
      discount_type: p.discount_type,
      discount_value: p.discount_value,
      applies_to: (p.applies_to === 'products' ? 'single' : p.applies_to) as 'all' | 'single' | 'group',
      product_ids: p.product_ids || '',
      group_key: (p as { group_key?: string }).group_key || '',
      start_date: p.start_date || '',
      end_date: p.end_date || '',
      is_active: p.is_active,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.applies_to === 'group' && !form.group_key.trim()) {
      alert('Sila pilih kumpulan produk.');
      return;
    }
    if (form.applies_to === 'single' && !form.product_ids.trim()) {
      alert('Sila pilih sekurang-kurangnya satu produk.');
      return;
    }
    setSubmitting(true);
    const supabase = getSupabaseBrowser();
    try {
      const payload = {
        name: form.name.trim(),
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        applies_to: form.applies_to,
        product_ids: form.applies_to === 'single' ? form.product_ids.trim() || null : null,
        group_key: form.applies_to === 'group' ? form.group_key.trim() || null : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      };
      if (editing) {
        const { error } = await supabase.from('promotions').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('promotions').insert(payload);
        if (error) throw error;
      }
      await fetchPromotions();
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Gagal simpan. Sila cuba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Padam kempen ini?')) return;
    setDeleting(id);
    const supabase = getSupabaseBrowser();
    try {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
      await fetchPromotions();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  }

  function formatDiscount(p: Promotion) {
    if (p.discount_type === 'percentage') return `${p.discount_value}% off`;
    return `RM ${p.discount_value} off`;
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-100">Promosi</h1>
            <p className="text-stone-500 text-xs mt-1">Urus kempen & diskaun. Diskaun akan mempengaruhi harga di halaman produk & checkout.</p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-sm font-medium text-herb-gold hover:border-herb-gold/50 transition"
          >
            Tambah Kempen
          </button>
        </div>

        {loading ? (
          <p className="text-stone-500 text-sm">Memuatkan...</p>
        ) : promotions.length === 0 ? (
          <div className="rounded-xl border border-stone-700 bg-herb-surface p-8 text-center text-stone-500">
            Tiada kempen. Klik &quot;Tambah Kempen&quot; untuk mula.
          </div>
        ) : (
          <div className="space-y-3">
            {promotions.map((p) => (
              <div key={p.id} className="rounded-xl border border-stone-700 bg-herb-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-100">{p.name}</p>
                    <p className="text-sm text-herb-gold mt-0.5">{formatDiscount(p)}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`inline-flex rounded-lg px-2 py-0.5 text-xs ${p.is_active ? 'bg-green-900/40 text-green-400' : 'bg-stone-700/50 text-stone-500'}`}>
                        {p.is_active ? 'Aktif' : 'Tidak aktif'}
                      </span>
                      <span className="text-xs text-stone-600">
                        {p.applies_to === 'all' ? 'Semua produk' : p.applies_to === 'group'
                          ? `Kumpulan: ${GROUP_OPTIONS.find((g) => g.value === (p as { group_key?: string }).group_key)?.label || (p as { group_key?: string }).group_key || '-'}`
                          : 'Produk terpilih (single)'}
                      </span>
                      {(p.start_date || p.end_date) && (
                        <span className="text-xs text-stone-600">
                          {p.start_date || '...'} → {p.end_date || '...'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="rounded-lg px-3 py-1.5 text-sm text-herb-gold hover:bg-herb-gold/10 transition">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-800/20 transition disabled:opacity-50"
                    >
                      {deleting === p.id ? '...' : 'Padam'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={closeModal}>
          <div className="bg-herb-dark border border-stone-700 rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl font-bold text-stone-100 mb-4">{editing ? 'Edit Kempen' : 'Tambah Kempen'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Nama kempen</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Cth: Raya 2025"
                  className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Jenis diskaun</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                    className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm"
                  >
                    <option value="percentage">Peratus (%)</option>
                    <option value="fixed_amount">Amaun tetap (RM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Nilai</label>
                  <input
                    type="number"
                    min={0}
                    step={form.discount_type === 'percentage' ? 1 : 0.01}
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm"
                    required
                  />
                  <p className="text-[10px] text-stone-600 mt-0.5">{form.discount_type === 'percentage' ? '10 = 10% off' : '5 = RM 5 off'}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">Berkenaan</label>
                <select
                  value={form.applies_to}
                  onChange={(e) => setForm({ ...form, applies_to: e.target.value as 'all' | 'single' | 'group', product_ids: '', group_key: '' })}
                  className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm"
                >
                  <option value="all">Semua produk</option>
                  <option value="single">Produk terpilih (single)</option>
                  <option value="group">Kumpulan produk (group)</option>
                </select>
              </div>
              {form.applies_to === 'single' && (
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Pilih produk (single)</label>
                  <select
                    multiple
                    value={form.product_ids.split(',').map((s) => s.trim()).filter(Boolean)}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                      setForm({ ...form, product_ids: selected.join(',') });
                    }}
                    className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm min-h-[100px]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.price})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-stone-600 mt-0.5">Tahan Ctrl/Cmd untuk pilih banyak</p>
                </div>
              )}
              {form.applies_to === 'group' && (
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Pilih kumpulan</label>
                  <select
                    value={form.group_key}
                    onChange={(e) => setForm({ ...form, group_key: e.target.value })}
                    className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm"
                  >
                    <option value="">Pilih kumpulan...</option>
                    {GROUP_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-stone-600 mt-0.5">Produk dalam kumpulan ini dipilih dari Admin halaman berkaitan</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Mula</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Tamat</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-stone-600"
                />
                <label htmlFor="is_active" className="text-sm text-stone-300">Aktif</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400 hover:bg-stone-800 transition">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="flex-1 rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-4 py-2 text-sm text-herb-gold hover:bg-herb-gold/30 disabled:opacity-50 transition">
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
