'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  visible: boolean;
  created_at?: string;
};

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState({
    question: '',
    answer: '',
    sort_order: 0,
    visible: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchFaqs() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('faqs')
      .select('id, question, answer, sort_order, visible, created_at')
      .order('sort_order', { ascending: true });
    if (error) {
      console.error(error);
      setFaqs([]);
    } else {
      setFaqs(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFaqs();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ question: '', answer: '', sort_order: faqs.length, visible: true });
    setModalOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
      visible: faq.visible,
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
          .from('faqs')
          .update({
            question: form.question,
            answer: form.answer,
            sort_order: form.sort_order,
            visible: form.visible,
          })
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('faqs').insert({
          question: form.question,
          answer: form.answer,
          sort_order: form.sort_order,
          visible: form.visible,
        });
        if (error) throw error;
      }
      await fetchFaqs();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Padam FAQ ini?')) return;
    setDeleting(id);
    const supabase = getSupabaseBrowser();
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      await fetchFaqs();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-100">FAQ</h1>
            <p className="text-stone-500 text-xs mt-1">Soalan lazim — urutan & visibiliti menentukan paparan di laman awam</p>
          </div>
          <div className="flex items-center gap-2">
          <a href="/faq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview
          </a>
          <button
            onClick={openCreate}
            className="rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-sm font-medium text-herb-gold hover:border-herb-gold/50 transition"
          >
            Tambah FAQ
          </button>
          </div>
        </div>

        <div className="rounded-xl border border-herb-gold/20 bg-herb-gold/5 p-4 text-sm">
          <h3 className="font-medium text-herb-gold mb-2">Panduan paparan FAQ</h3>
          <ul className="space-y-1.5 text-stone-400">
            <li><strong className="text-stone-300">Halaman /faq:</strong> Semua FAQ dengan &quot;Tampil&quot; dipaparkan mengikut urutan</li>
            <li><strong className="text-stone-300">Homepage (preview):</strong> 3 FAQ teratas (yang tampil) dipaparkan di bahagian bawah</li>
            <li><strong className="text-stone-300">Sembunyi:</strong> FAQ yang disembunyikan tidak muncul di mana-mana laman awam</li>
            <li><strong className="text-stone-300">Urutan:</strong> Nombor lebih kecil = muncul dahulu. Edit urutan untuk susun semula</li>
            <li><strong className="text-stone-300">Tajuk & pautan:</strong> &quot;Soalan lazim&quot;, &quot;Lihat semua FAQ&quot; dll. diset di Admin → Content</li>
          </ul>
        </div>

        {loading ? (
          <p className="text-stone-500 text-sm">Memuatkan...</p>
        ) : faqs.length === 0 ? (
          <div className="rounded-xl border border-stone-700 bg-herb-surface p-8 text-center text-stone-500">
            Tiada FAQ. Klik &quot;Tambah FAQ&quot; untuk mula.
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-xl border border-stone-700 bg-herb-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-100">{faq.question}</p>
                    <p className="text-sm text-stone-400 mt-1 line-clamp-2">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs ${
                          faq.visible
                            ? 'bg-green-900/40 text-green-400'
                            : 'bg-stone-700/50 text-stone-500'
                        }`}
                      >
                        {faq.visible ? 'Tampil' : 'Sembunyi'}
                      </span>
                      <span className="text-xs text-stone-600">
                        Urutan: {faq.sort_order}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(faq)}
                      className="rounded-lg px-3 py-1.5 text-sm text-herb-gold hover:bg-herb-gold/10 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      disabled={deleting === faq.id}
                      className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                    >
                      {deleting === faq.id ? 'Memadam...' : 'Padam'}
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
              {editing ? 'Edit FAQ' : 'Tambah FAQ'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Soalan
                </label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, question: e.target.value }))
                  }
                  required
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                  placeholder="Masukkan soalan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Jawapan
                </label>
                <textarea
                  value={form.answer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, answer: e.target.value }))
                  }
                  required
                  rows={4}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none resize-none"
                  placeholder="Masukkan jawapan"
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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visible"
                  checked={form.visible}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, visible: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-stone-600 bg-herb-surface text-herb-gold focus:ring-herb-gold/50"
                />
                <label htmlFor="visible" className="text-sm text-stone-300">
                  Tampil di laman awam
                </label>
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
