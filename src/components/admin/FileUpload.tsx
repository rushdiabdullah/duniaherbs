'use client';

import { useCallback, useRef, useState } from 'react';

type FileUploadProps = {
  accept?: string;
  folder?: string;
  onUpload: (url: string) => void;
  preview?: string;
  previewType?: 'image' | 'video';
  label?: string;
  multiple?: boolean;
  onMultiUpload?: (urls: string[]) => void;
};

export default function FileUpload({
  accept = 'image/*',
  folder = 'images',
  onUpload,
  preview,
  previewType = 'image',
  label = 'Upload Fail',
  multiple = false,
  onMultiUpload,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!files.length) return;
      setUploading(true);
      const urls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`${i + 1}/${files.length} — ${file.name}`);
        const ext = file.name.split('.').pop() ?? 'bin';
        const safeName = `${folder}/${Date.now()}-${i}.${ext}`;

        try {
          // Get a pre-signed upload URL from the server (bypasses RLS)
          const res = await fetch('/api/upload/signed-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: safeName, contentType: file.type }),
          });

          if (!res.ok) {
            const err = await res.json();
            alert(`Gagal upload ${file.name}: ${err.error ?? 'Unknown error'}`);
            continue;
          }

          const { signedUrl, publicUrl } = await res.json();

          // Upload directly to Supabase Storage using the signed URL
          const uploadRes = await fetch(signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
          });

          if (!uploadRes.ok) {
            alert(`Gagal upload ${file.name}: HTTP ${uploadRes.status}`);
            continue;
          }

          urls.push(publicUrl);
        } catch (err) {
          alert(`Gagal upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      if (multiple && onMultiUpload && urls.length > 0) {
        onMultiUpload(urls);
      } else if (urls.length > 0) {
        onUpload(urls[0]);
      }

      setUploading(false);
      setProgress('');
      if (inputRef.current) inputRef.current.value = '';
    },
    [folder, multiple, onUpload, onMultiUpload],
  );

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) uploadFiles(files);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files?.length) uploadFiles(files);
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
          dragging
            ? 'border-herb-gold bg-herb-gold/10'
            : 'border-stone-700 hover:border-stone-500 bg-herb-surface/40'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        {preview ? (
          <div className="relative group">
            {previewType === 'video' ? (
              <video
                src={preview}
                className="w-full max-h-48 rounded-xl object-cover"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-48 rounded-xl object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition">
              <span className="text-white text-sm font-medium">
                {uploading ? progress : 'Klik atau drag untuk tukar'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <svg
              className={`h-10 w-10 mb-3 ${dragging ? 'text-herb-gold' : 'text-stone-600'}`}
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
              {uploading ? progress : label}
            </p>
            <p className="text-stone-600 text-xs mt-1">
              Drag & drop atau klik untuk pilih
            </p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="h-1 w-full rounded-full bg-stone-800 overflow-hidden">
          <div className="h-full bg-herb-gold rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  );
}
