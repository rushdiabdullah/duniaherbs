'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type MediaFile = {
  name: string;
  path: string;
  publicUrl: string;
};

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchFiles() {
    const supabase = getSupabaseBrowser();
    const folders = ['', 'images', 'videos', 'products'];
    const allItems: MediaFile[] = [];

    for (const folder of folders) {
      const { data } = await supabase.storage.from('media').list(folder, { limit: 500 });
      if (data) {
        for (const f of data) {
          if (!f.name || f.name.startsWith('.') || f.id === null) continue;
          const path = folder ? `${folder}/${f.name}` : f.name;
          const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
          allItems.push({ name: f.name, path, publicUrl: urlData.publicUrl });
        }
      }
    }
    setFiles(allItems);
    setLoading(false);
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    if (!fileList.length) return;
    setUploading(true);
    const supabase = getSupabaseBrowser();

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgress(`${i + 1}/${fileList.length} — ${file.name}`);
      const ext = file.name.split('.').pop() ?? 'bin';
      const isVid = /^video\//i.test(file.type);
      const folder = isVid ? 'videos' : 'images';
      const safeName = `${folder}/${Date.now()}-${i}.${ext}`;

      const { error } = await supabase.storage.from('media').upload(safeName, file, {
        cacheControl: '31536000',
        upsert: false,
      });
      if (error) alert(`Gagal upload ${file.name}: ${error.message}`);
    }

    setUploading(false);
    setUploadProgress('');
    if (inputRef.current) inputRef.current.value = '';
    fetchFiles();
  }, []);

  async function handleDelete(path: string) {
    if (!confirm('Padam fail ini?')) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.storage.from('media').remove([path]);
    if (error) console.error(error);
    fetchFiles();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(name);
  const isVideo = (name: string) => /\.(mp4|webm|mov|avi|mkv)$/i.test(name);

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-stone-100">Media</h1>
        <p className="text-stone-500 text-xs mt-1">Semua gambar dan video yang diupload disimpan di sini. Copy URL dan paste di halaman Produk, Content, atau Video.</p>
      </div>

      {/* Drag & Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative mb-6 cursor-pointer rounded-xl border-2 border-dashed transition-all ${
          dragging
            ? 'border-herb-gold bg-herb-gold/10'
            : 'border-stone-700 hover:border-stone-500 bg-herb-surface/30'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <svg
            className={`h-12 w-12 mb-3 ${dragging ? 'text-herb-gold' : 'text-stone-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-stone-400 text-sm font-medium">
            {uploading ? uploadProgress : 'Drag & drop gambar atau video di sini'}
          </p>
          <p className="text-stone-600 text-xs mt-1">
            Atau klik untuk pilih fail dari komputer
          </p>
        </div>
      </div>

      {uploading && (
        <div className="h-1.5 w-full rounded-full bg-stone-800 overflow-hidden mb-6">
          <div className="h-full bg-herb-gold rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      )}

      {loading ? (
        <p className="text-stone-500 text-sm">Memuatkan...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((f) => (
            <div
              key={f.path}
              className="rounded-xl border border-stone-700 bg-herb-surface/60 overflow-hidden group"
            >
              <div className="aspect-square bg-stone-800/50 flex items-center justify-center relative">
                {isImage(f.name) ? (
                  <img src={f.publicUrl} alt={f.name} className="w-full h-full object-cover" />
                ) : isVideo(f.name) ? (
                  <video
                    src={f.publicUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <span className="text-stone-500 text-xs">{f.name.split('.').pop()?.toUpperCase()}</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-stone-400 text-xs truncate mb-2" title={f.path}>
                  {f.path}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyUrl(f.publicUrl); }}
                    className="flex-1 rounded-lg border border-stone-700 px-2 py-1 text-xs text-herb-gold hover:border-herb-gold/50"
                  >
                    {copied === f.publicUrl ? 'Disalin!' : 'Copy URL'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(f.path); }}
                    className="rounded-lg border border-stone-700 px-2 py-1 text-xs text-red-400 hover:border-red-500/50"
                  >
                    Padam
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && files.length === 0 && (
        <p className="text-stone-500 text-sm py-8 text-center">Tiada media. Drag & drop fail untuk bermula.</p>
      )}
    </AdminShell>
  );
}
