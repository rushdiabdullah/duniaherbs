'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

const nav = [
  { label: 'Dashboard', href: '/admin', preview: '/', desc: 'Ringkasan admin' },
  { label: 'Produk', href: '/admin/produk', preview: '/#produk', desc: 'Senarai produk lotion' },
  { label: 'FAQ', href: '/admin/faq', preview: '/faq', desc: 'Soalan lazim' },
  { label: 'Testimonial', href: '/admin/testimonial', preview: '/', desc: 'Kata pelanggan di homepage' },
  { label: 'Stockist', href: '/admin/stockist', preview: '/stockist', desc: 'Senarai stockist & pengedar' },
  { label: 'Content', href: '/admin/content', preview: '/', desc: 'Teks hero, footer, CTA, dll' },
  { label: 'Timeline', href: '/admin/milestones', preview: '/tentang', desc: 'Sejarah syarikat' },
  { label: 'Video', href: '/admin/video', preview: '/', desc: 'Video duta & iklan di homepage' },
  { label: 'Info AM', href: '/admin/knowledge', preview: '/info', desc: 'Info untuk /info & AI' },
  { label: 'Sales', href: '/admin/sales', desc: 'Teknik jualan — AI only, admin sahaja' },
  { label: 'Fasha Landing', href: '/admin/fasha', preview: '/fasha', desc: 'Landing page Fasha' },
  { label: 'Selepas Bersalin', href: '/admin/bersalin', preview: '/bersalin', desc: 'Halaman ibu berpantang' },
  { label: 'Pesanan', href: '/admin/orders', desc: 'Pesanan & pembayaran Billplz' },
  { label: 'Media', href: '/admin/media', desc: 'Upload gambar & video' },
  { label: 'Users', href: '/admin/users', desc: 'Pengguna admin' },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowser();
      // INITIAL_SESSION kadang lebih cepat (dari cache) — set ready segera
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'INITIAL_SESSION' && session) setReady(true);
      });
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          router.replace('/admin/login');
        } else {
          setReady(true);
        }
      }).catch(() => {
        router.replace('/admin/login');
      });
      return () => subscription.unsubscribe();
    } catch {
      router.replace('/admin/login');
    }
  }, [router]);

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  // Papar sidebar serta-merta — jangan block seluruh skrin. Auth check jalan selari.
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-stone-800 bg-herb-surface/50 p-4 flex flex-col">
        <Link href="/" className="font-serif text-herb-gold font-bold text-lg mb-6">
          DuniaHerbs
        </Link>
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-herb-gold/10 text-herb-gold font-medium'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-herb-surface'
                  }`}
                >
                  {item.label}
                  {active && item.desc && (
                    <span className="block text-[10px] font-normal text-stone-500 mt-0.5">{item.desc}</span>
                  )}
                </Link>
                {active && item.preview && (
                  <a
                    href={item.preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 text-[10px] text-stone-500 hover:text-herb-gold transition"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Lihat di website
                  </a>
                )}
              </div>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 rounded-lg px-3 py-2 text-sm text-stone-500 hover:text-red-400 transition text-left"
        >
          Log Keluar
        </button>
      </aside>
      {/* Main — loading hanya di kawasan kandungan, sidebar sentiasa nampak */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {ready ? children : (
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-stone-500 text-sm">Memuatkan...</p>
          </div>
        )}
      </main>
    </div>
  );
}
