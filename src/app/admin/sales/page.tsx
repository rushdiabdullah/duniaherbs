'use client';

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
  title: '',
  content: '',
  visible: true,
  sort_order: 0,
};

export default function AdminSalesPage() {
  const [items, setItems] = useState<KBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KBItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function fetchItems() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('category', 'Sales')
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
    const payload = {
      category: 'Sales',
      title: form.title,
      content: form.content,
      visible: form.visible,
      sort_order: form.sort_order,
      updated_at: new Date().toISOString(),
    };
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
    if (!confirm('Padam info Sales ini?')) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('knowledge_base').delete().eq('id', row.id);
    if (error) console.error(error);
    fetchItems();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Sales</h1>
          <p className="text-stone-500 text-xs mt-1">Teknik jualan, upsell, handle bantahan — untuk train AI sahaja. Admin only, bukan untuk paparan awam.</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-sm text-herb-gold hover:border-herb-gold/50 transition"
        >
          + Tambah Sales
        </button>
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm">Memuatkan...</p>
      ) : items.length === 0 ? (
        <p className="text-stone-500 text-sm">Tiada info Sales. Tambah untuk train Emma bagaimana handle jualan, bantahan, upsell.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-stone-700/50 bg-herb-surface/80 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-400">Sales</span>
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
              {editing ? 'Edit Sales' : 'Tambah Sales Baru'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-stone-400 mb-1">Tajuk</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder='cth: Cara handle "mahal"'
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Kandungan</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tulis teknik jualan / upsell / handle bantahan — Emma akan rujuk untuk jawab pelanggan"
                  rows={5}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
                <p className="text-stone-600 text-xs mt-1">Untuk AI training sahaja — Emma rujuk bila handle soalan jualan.</p>
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
