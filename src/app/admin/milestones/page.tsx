'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Milestone = {
  id: string;
  year: string;
  title: string;
  description: string;
  sort_order: number;
  created_at?: string;
};

export default function AdminMilestonesPage() {
  const [items, setItems] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [form, setForm] = useState({
    year: '',
    title: '',
    description: '',
    sort_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchItems() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('milestones')
      .select('id, year, title, description, sort_order, created_at')
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

  function openCreate() {
    setEditing(null);
    setForm({ year: '', title: '', description: '', sort_order: items.length });
    setModalOpen(true);
  }

  function openEdit(item: Milestone) {
    setEditing(item);
    setForm({
      year: item.year,
      title: item.title,
      description: item.description || '',
      sort_order: item.sort_order,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = getSupabaseBrowser();
    try {
      if (editing) {
        const { error } = await supabase
          .from('milestones')
          .update({
            year: form.year,
            title: form.title,
            description: form.description,
            sort_order: form.sort_order,
          })
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('milestones').insert({
          year: form.year,
          title: form.title,
          description: form.description,
          sort_order: form.sort_order,
        });
        if (error) throw error;
      }
      await fetchItems();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Padam timeline ini?')) return;
    setDeleting(id);
    const supabase = getSupabaseBrowser();
    try {
      const { error } = await supabase.from('milestones').delete().eq('id', id);
      if (error) throw error;
      await fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-100">Timeline / Sejarah</h1>
            <p className="text-stone-500 text-sm mt-1">Paparkan di bahagian Legasi Kami di homepage</p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-sm font-medium text-herb-gold hover:border-herb-gold/50 transition"
          >
            Tambah Timeline
          </button>
        </div>

        {loading ? (
          <p className="text-stone-500 text-sm">Memuatkan...</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-stone-700 bg-herb-surface p-8 text-center text-stone-500">
            Tiada timeline. Klik &quot;Tambah Timeline&quot; untuk mula.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-stone-700 bg-herb-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-herb-gold">{item.year}</span>
                      <span className="font-medium text-stone-100">{item.title}</span>
                    </div>
                    <p className="text-sm text-stone-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-xs text-stone-600 mt-2 inline-block">
                      Urutan: {item.sort_order}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded-lg px-3 py-1.5 text-sm text-herb-gold hover:bg-herb-gold/10 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                    >
                      {deleting === item.id ? 'Memadam...' : 'Padam'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-stone-700 bg-herb-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl font-bold text-stone-100 mb-4">
              {editing ? 'Edit Timeline' : 'Tambah Timeline'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Tahun
                </label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                  placeholder="cth: 2005"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Tajuk
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                  placeholder="cth: Pelancaran"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Keterangan
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none resize-none"
                  placeholder="Keterangan timeline..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Urutan
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sort_order: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400 hover:text-stone-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-4 py-2 text-sm font-medium text-herb-gold hover:bg-herb-gold/30 transition disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
