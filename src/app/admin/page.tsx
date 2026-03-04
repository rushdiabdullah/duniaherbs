'use client';

import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';

const sections = [
  { label: 'Produk', href: '/admin/produk', desc: 'Senarai 8 produk lotion — gambar, harga, heat level', preview: '/#produk', icon: '📦' },
  { label: 'FAQ', href: '/admin/faq', desc: 'Soalan lazim — 3 teratas dipaparkan di homepage', preview: '/faq', icon: '❓' },
  { label: 'Testimonial', href: '/admin/testimonial', desc: 'Testimoni pelanggan — slider di homepage', preview: '/', icon: '💬' },
  { label: 'Stockist', href: '/admin/stockist', desc: 'Stockist & pengedar — ikut region', preview: '/stockist', icon: '📍' },
  { label: 'Site Content', href: '/admin/content', desc: 'Semua teks — hero, footer, CTA, benefits, polisi, bersalin', preview: '/', icon: '✏️' },
  { label: 'Timeline', href: '/admin/milestones', desc: 'Sejarah syarikat — di homepage & /tentang', preview: '/tentang', icon: '📅' },
  { label: 'Video', href: '/admin/video', desc: 'Video duta (7 grid bento) & iklan komersial (8 video) di homepage', preview: '/', icon: '🎬' },
  { label: 'Info AM', href: '/admin/knowledge', desc: 'Info untuk halaman /info & AI — paparan awam', preview: '/info', icon: '📋' },
  { label: 'Sales', href: '/admin/sales', desc: 'Teknik jualan — AI only, admin sahaja', icon: '💰' },
  { label: 'Fasha Landing', href: '/admin/fasha', desc: 'Landing page /fasha — hero, quote, picks', preview: '/fasha', icon: '⭐' },
  { label: 'Selepas Bersalin', href: '/admin/bersalin', desc: 'Halaman /bersalin — gambar, galeri 6 foto, quote tradisional', preview: '/bersalin', icon: '🤱' },
  { label: 'Seisi Keluarga', href: '/admin/seisi-keluarga', desc: 'Halaman /seisi-keluarga — Losyen Pati Halia Legend & Haruman', preview: '/seisi-keluarga', icon: '👨‍👩‍👧‍👦' },
  { label: 'Bentuk Badan', href: '/admin/bentuk-badan', desc: 'Halaman /bentuk-badan — Set Mini Sauna Legend', preview: '/bentuk-badan', icon: '💪' },
  { label: 'Produk Minuman', href: '/admin/produk-minuman', desc: 'Halaman /produk-minuman — Mustajab Extra Daytox & produk minuman', preview: '/produk-minuman', icon: '🥤' },
  { label: 'Pesanan', href: '/admin/orders', desc: 'Lihat semua pesanan & status pembayaran Billplz', icon: '🧾' },
  { label: 'Media', href: '/admin/media', desc: 'Upload & urus gambar/video — drag & drop', icon: '🖼️' },
  { label: 'Users', href: '/admin/users', desc: 'Pengguna admin dashboard', icon: '👥' },
];

export default function AdminDashboard() {
  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-stone-50">Dashboard Admin</h1>
        <p className="text-stone-500 text-sm mt-1">Pilih seksyen untuk edit. Setiap kad ada link Preview untuk lihat hasilnya di website.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div
            key={s.href}
            className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-5 transition hover:border-herb-gold/30 group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              {s.preview && (
                <a
                  href={s.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-stone-500 hover:text-herb-gold transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Preview
                </a>
              )}
            </div>
            <Link href={s.href}>
              <h2 className="font-semibold text-stone-100 group-hover:text-herb-gold transition">{s.label}</h2>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">{s.desc}</p>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-5">
        <h3 className="text-stone-300 text-sm font-medium mb-2">Panduan Ringkas untuk Staf</h3>
        <ul className="text-stone-500 text-xs space-y-1.5 leading-relaxed">
          <li><span className="text-stone-400">Produk:</span> Upload gambar terus — drag &amp; drop. Set harga, heat level, badge.</li>
          <li><span className="text-stone-400">Video:</span> Upload video terus — drag &amp; drop. Format portrait (9:16) paling cantik.</li>
          <li><span className="text-stone-400">Content:</span> Edit semua teks website. Setiap seksyen ada butang Preview.</li>
          <li><span className="text-stone-400">Media:</span> Tempat upload semua gambar/video. Copy URL untuk guna di tempat lain.</li>
          <li><span className="text-stone-400">Info AM:</span> Info untuk /info (awam) & AI. Sales di halaman Sales — admin sahaja.</li>
          <li><span className="text-stone-400">Sort Order:</span> Nombor kecil = paparan pertama. 1 di atas, 10 di bawah.</li>
          <li><span className="text-stone-400">Visible:</span> Untick untuk sembunyi tanpa padam.</li>
        </ul>
      </div>
    </AdminShell>
  );
}
