'use client';

import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  visible: boolean;
  sort_order: number;
  created_at?: string;
};

const emptyForm = {
  quote: '',
  author: '',
  role: '',
  visible: true,
  sort_order: 0,
};

export default function AdminTestimonialPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function fetchItems() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('testimonials')
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

  function openEdit(row: Testimonial) {
    setEditing(row);
    setForm({
      quote: row.quote ?? '',
      author: row.author ?? '',
      role: row.role ?? '',
      visible: row.visible ?? true,
      sort_order: row.sort_order ?? 0,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = getSupabaseBrowser();
    if (editing) {
      const { error } = await supabase
        .from('testimonials')
        .update(form)
        .eq('id', editing.id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from('testimonials').insert(form);
      if (error) console.error(error);
    }
    setSaving(false);
    setModalOpen(false);
    fetchItems();
  }

  async function handleDelete(row: Testimonial) {
    if (!confirm('Padam testimonial ini?')) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('testimonials').delete().eq('id', row.id);
    if (error) console.error(error);
    fetchItems();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Testimonial</h1>
          <p className="text-stone-500 text-xs mt-1">Testimoni pelanggan — auto-slider di homepage seksyen "Dipercayai Ramai". 2 testimoni per slide.</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-sm text-herb-gold hover:border-herb-gold/50 transition"
        >
          + Tambah
        </button>
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm">Memuatkan...</p>
      ) : (
        <AdminTable<Testimonial>
          columns={[
            { key: 'quote', label: 'Quote', render: (r) => <span className="line-clamp-2">{r.quote}</span> },
            { key: 'author', label: 'Author' },
            { key: 'role', label: 'Role' },
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
              {editing ? 'Edit Testimonial' : 'Tambah Testimonial'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-stone-400 mb-1">Quote</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
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
