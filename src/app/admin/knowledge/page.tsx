'use client';

import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

type KBItem = {
  id: string;
  category: string;
  title: string;
  content: string;
  visible: boolean;
  sort_order: number;
  updated_at?: string;
};

const emptyForm = {
  category: 'Umum',
  title: '',
  content: '',
  visible: true,
  sort_order: 0,
};

const categories = ['Produk', 'Harga', 'Cara Guna', 'Keselamatan', 'Penghantaran', 'Stockist', 'Syarikat', 'FAQ', 'Complaint', 'Promosi', 'Umum'];

export default function AdminKnowledgePage() {
  const [items, setItems] = useState<KBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KBItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('Semua');

  async function fetchItems() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .neq('category', 'Sales')
      .order('sort_order', { ascending: true });
    if (error) {
      console.error(error);
      setItems([]);
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(row: KBItem) {
    setEditing(row);
    setForm({
      category: row.category ?? 'Umum',
      title: row.title ?? '',
      content: row.content ?? '',
      visible: row.visible ?? true,
      sort_order: row.sort_order ?? 0,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.content) {
      alert('Sila isi tajuk dan kandungan.');
      return;
    }
    setSaving(true);
    const supabase = getSupabaseBrowser();
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editing) {
      const { error } = await supabase.from('knowledge_base').update(payload).eq('id', editing.id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from('knowledge_base').insert(payload);
      if (error) console.error(error);
    }
    setSaving(false);
    setModalOpen(false);
    fetchItems();
  }

  async function handleDelete(row: KBItem) {
    if (!confirm('Padam info ini?')) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('knowledge_base').delete().eq('id', row.id);
    if (error) console.error(error);
    fetchItems();
  }

  const filtered = filterCat === 'Semua' ? items : items.filter((i) => i.category === filterCat);
  const usedCategories = ['Semua', ...Array.from(new Set(items.map((i) => i.category)))];

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Info AM</h1>
          <p className="text-stone-500 text-xs mt-1">Info yang AI rujuk & dipaparkan di /info. Sales diurus di halaman Sales.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/info" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Lihat Info AM
          </Link>
          <button
            onClick={openAdd}
            className="rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-sm text-herb-gold hover:border-herb-gold/50 transition"
          >
            + Tambah Info
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {usedCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              filterCat === cat
                ? 'bg-herb-gold/20 text-herb-gold border border-herb-gold/50'
                : 'bg-herb-surface border border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm">Memuatkan...</p>
      ) : filtered.length === 0 ? (
        <p className="text-stone-500 text-sm">Tiada info dalam kategori ini.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border border-stone-700/50 bg-herb-surface/80 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-herb-gold/10 border border-herb-gold/30 px-2 py-0.5 text-[10px] text-herb-gold">{item.category}</span>
                    {!item.visible && <span className="rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] text-red-400">Hidden</span>}
                  </div>
                  <h3 className="font-medium text-stone-100 text-sm">{item.title}</h3>
                  <p className="text-stone-500 text-xs mt-1 line-clamp-2">{item.content}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="text-xs text-stone-400 hover:text-herb-gold transition">Edit</button>
                  <button onClick={() => handleDelete(item)} className="text-xs text-stone-400 hover:text-red-400 transition">Padam</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-xl border border-stone-700 bg-herb-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-lg font-bold text-stone-100 mb-4">
              {editing ? 'Edit Info' : 'Tambah Info Baru'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-stone-400 mb-1">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 focus:border-herb-gold/50 focus:outline-none"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Tajuk</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="cth: Cara guna untuk ibu bersalin"
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Kandungan</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tulis info lengkap yang Emma boleh rujuk..."
                  rows={5}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
                <p className="text-stone-600 text-xs mt-1">Tulis macam nak explain kat kawan — Emma akan adapt jadi bahasa santai.</p>
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Urutan</label>
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
                <span className="text-sm">Active (Emma boleh rujuk)</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400 hover:text-stone-200">Batal</button>
              <button onClick={handleSave} disabled={saving} className="rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-4 py-2 text-sm text-herb-gold hover:bg-herb-gold/30 disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
