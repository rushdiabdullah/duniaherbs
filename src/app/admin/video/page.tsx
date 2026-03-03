'use client';

import AdminShell from '@/components/admin/AdminShell';
import AdminTable from '@/components/admin/AdminTable';
import FileUpload from '@/components/admin/FileUpload';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

type Video = {
  id: string;
  title: string;
  label: string;
  video_url: string;
  visible: boolean;
  sort_order: number;
  type: string;
  created_at?: string;
};

type TabType = 'duta' | 'iklan';

const defaultLabels: Record<TabType, string> = {
  duta: 'Duta Dunia Herbs',
  iklan: 'Iklan Dunia Herbs',
};

export default function AdminVideoPage() {
  const [items, setItems] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('duta');
  const [form, setForm] = useState({
    title: '',
    label: defaultLabels.duta,
    video_url: '',
    visible: true,
    sort_order: 0,
    type: 'duta' as string,
  });

  async function fetchItems() {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from('videos')
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

  useEffect(() => { fetchItems(); }, []);

  const dutaVideos = items.filter(v => v.type === 'duta');
  const iklanVideos = items.filter(v => v.type === 'iklan');
  const currentVideos = activeTab === 'duta' ? dutaVideos : iklanVideos;

  function openAdd() {
    setEditing(null);
    setForm({
      title: '',
      label: defaultLabels[activeTab],
      video_url: '',
      visible: true,
      sort_order: currentVideos.length + 1,
      type: activeTab,
    });
    setModalOpen(true);
  }

  function openEdit(row: Video) {
    setEditing(row);
    setForm({
      title: row.title ?? '',
      label: row.label ?? defaultLabels[activeTab],
      video_url: row.video_url ?? '',
      visible: row.visible ?? true,
      sort_order: row.sort_order ?? 0,
      type: row.type ?? activeTab,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.video_url) {
      alert('Sila masukkan URL video atau upload video.');
      return;
    }
    setSaving(true);
    const supabase = getSupabaseBrowser();
    if (editing) {
      const { error } = await supabase.from('videos').update(form).eq('id', editing.id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from('videos').insert(form);
      if (error) console.error(error);
    }
    setSaving(false);
    setModalOpen(false);
    fetchItems();
  }

  async function handleDelete(row: Video) {
    if (!confirm('Padam video ini?')) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('videos').delete().eq('id', row.id);
    if (error) console.error(error);
    fetchItems();
  }

  const tabInfo = {
    duta: {
      icon: '🎥',
      title: 'Video Duta',
      desc: 'Grid bento portrait (9:16) — 7 video dipaparkan di homepage selepas Hero',
    },
    iklan: {
      icon: '📺',
      title: 'Video Iklan Komersial',
      desc: 'Grid landscape (16:9) macam YouTube — dipaparkan di homepage selepas Produk',
    },
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Video Duta &amp; Iklan</h1>
          <p className="text-stone-500 text-xs mt-1">Urus video untuk 2 seksyen berbeza di homepage</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['duta', 'iklan'] as TabType[]).map((tab) => {
          const info = tabInfo[tab];
          const count = tab === 'duta' ? dutaVideos.length : iklanVideos.length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-xl border p-4 text-left transition ${
                isActive
                  ? 'border-herb-gold/50 bg-herb-gold/5'
                  : 'border-stone-700/50 bg-stone-900/50 hover:border-stone-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{info.icon}</span>
                <h3 className={`text-sm font-semibold ${isActive ? 'text-herb-gold' : 'text-stone-300'}`}>
                  {info.title}
                </h3>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-herb-gold/20 text-herb-gold' : 'bg-stone-800 text-stone-500'}`}>
                  {count} video
                </span>
              </div>
              <p className="text-stone-500 text-xs">{info.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Add button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-stone-300 text-sm font-medium">
          {tabInfo[activeTab].title} ({currentVideos.length})
        </h3>
        <button onClick={openAdd} className="rounded-xl border border-stone-700 bg-herb-surface px-4 py-2 text-sm text-herb-gold hover:border-herb-gold/50 transition">
          + Tambah {activeTab === 'duta' ? 'Video Duta' : 'Video Iklan'}
        </button>
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm">Memuatkan...</p>
      ) : (
        <AdminTable<Video>
          columns={[
            { key: 'title', label: 'Tajuk' },
            { key: 'label', label: 'Label' },
            {
              key: 'video_url',
              label: 'Video',
              render: (r) => (
                <a href={r.video_url} target="_blank" rel="noopener noreferrer" className="text-herb-gold hover:underline text-xs truncate max-w-[200px] block">
                  {r.video_url.length > 40 ? r.video_url.slice(0, 40) + '...' : r.video_url}
                </a>
              ),
            },
            { key: 'visible', label: 'Visible', render: (r) => (r.visible ? 'Ya' : 'Tidak') },
            { key: 'sort_order', label: 'Urutan' },
          ]}
          rows={currentVideos}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-xl border border-stone-700 bg-herb-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-lg font-bold text-stone-100 mb-4">
              {editing ? 'Edit Video' : `Tambah ${activeTab === 'duta' ? 'Video Duta' : 'Video Iklan'}`}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-stone-400 mb-1">Tajuk</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={activeTab === 'duta' ? 'cth: Duta 1' : 'cth: Iklan Raya 2026'}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Label (ditunjukkan di website)</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-400 mb-1">Video</label>
                <FileUpload
                  accept="video/*"
                  folder="videos"
                  preview={form.video_url || undefined}
                  previewType="video"
                  label="Upload video — drag & drop atau klik"
                  onUpload={(url) => setForm({ ...form, video_url: url })}
                />
                {form.video_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={form.video_url}
                      onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                      placeholder="Atau masukkan URL manual..."
                      className="flex-1 rounded-xl border border-stone-700 bg-herb-surface px-3 py-2 text-stone-100 text-xs placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                    />
                    <button type="button" onClick={() => setForm({ ...form, video_url: '' })} className="text-red-400 hover:text-red-300 text-xs whitespace-nowrap">
                      Padam
                    </button>
                  </div>
                )}
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
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400 hover:text-stone-200">
                Batal
              </button>
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
