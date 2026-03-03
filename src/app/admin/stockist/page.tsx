'use client';

import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

const REGIONS = [
  'Semenanjung Malaysia',
  'Sabah & Sarawak',
  'Singapura',
  'Antarabangsa',
] as const;

type Stockist = {
  id: string;
  name: string;
  area: string;
  type: string;
  region: string;
  url: string | null;
  visible: boolean;
  sort_order: number;
  created_at?: string;
};

type Region = (typeof REGIONS)[number];

const emptyForm: { name: string; area: string; type: string; region: Region; url: string; visible: boolean; sort_order: number } = {
  name: '',
  area: '',
  type: '',
  region: REGIONS[0],
  url: '',
  visible: true,
  sort_order: 0,
};

export default function AdminStockistPage() {
  const [items, setItems] = useState<Stockist[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Stockist | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function fetchItems() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('stockists')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      console.error(error);
      setItems([]);
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(row: Stockist) {
    setEditing(row);
    setForm({
      name: row.name ?? '',
      area: row.area ?? '',
      type: row.type ?? '',
      region: (REGIONS.includes(row.region as Region) ? row.region : REGIONS[0]) as Region,
      url: row.url ?? '',
      visible: row.visible ?? true,
      sort_order: row.sort_order ?? 0,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = getSupabaseBrowser();
    const payload = { ...form, url: form.url || null };
    if (editing) {
      const { error } = await supabase.from('stockists').update(payload).eq('id', editing.id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from('stockists').insert(payload);
      if (error) console.error(error);
    }
    setSaving(false);
    setModalOpen(false);
    fetchItems();
  }

  async function handleDelete(row: Stockist) {
    if (!confirm('Padam stockist ini?')) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('stockists').delete().eq('id', row.id);
    if (error) console.error(error);
    fetchItems();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Stockist</h1>
          <p className="text-stone-500 text-xs mt-1">Senarai stockist & pengedar di halaman /stockist. Dikelompok ikut region — ada URL untuk beli online.</p>
        </div>
        <div className="flex items-center gap-2">
        <a href="/stockist" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          Preview
        </a>
        <button
          onClick={openAdd}
          className="rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-sm text-herb-gold hover:border-herb-gold/50 transition"
        >
          + Tambah
        </button>
        </div>
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm">Memuatkan...</p>
      ) : (
        <AdminTable<Stockist>
          columns={[
            { key: 'name', label: 'Nama' },
            { key: 'area', label: 'Area' },
            { key: 'type', label: 'Type' },
            { key: 'region', label: 'Region' },
            { key: 'visible', label: 'Visible', render: (r) => (r.visible ? 'Ya' : 'Tidak') },
            { key: 'sort_order', label: 'Urutan' },
          ]}
          rows={items}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModalOpen(false)}>
          <div
            className="w-full max-w-lg rounded-xl border border-stone-700 bg-herb-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-lg font-bold text-stone-100 mb-4">
              {editing ? 'Edit Stockist' : 'Tambah Stockist'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-stone-400 mb-1">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Area</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Type</label>
                <input
                  type="text"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value as (typeof REGIONS)[number] })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 focus:border-herb-gold/50 focus:outline-none"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r} className="bg-herb-surface text-stone-100">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">URL</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-stone-400">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                  className="rounded border-stone-600 text-herb-gold focus:ring-herb-gold"
                />
                <span className="text-sm">Visible</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400 hover:text-stone-200"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-4 py-2 text-sm text-herb-gold hover:bg-herb-gold/30 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
