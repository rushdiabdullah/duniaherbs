import Link from 'next/link';
import { getSiteContent } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hubungi — Dunia Herbs',
  description: 'Hubungi Dunia Herbs untuk pertanyaan produk dan penghantaran.',
};

export default async function ContactPage() {
  const content = await getSiteContent();
  const CONTACT_EMAIL = 'admin@duniaherbs.com.my';
  const EMAIL_LINK = `mailto:${CONTACT_EMAIL}`;
  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-stone-500 text-sm hover:text-herb-sage transition mb-8"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </Link>
      <h1 className="font-serif text-2xl font-bold text-stone-50 mb-2">{content.cs_title || 'Hubungi kami'}</h1>
      <p className="text-stone-500 mb-10">{content.cs_subtitle || 'Kami sedia membantu — tanya apa sahaja tentang produk atau penghantaran'}</p>

      <div className="space-y-6">
        <a
          href={EMAIL_LINK}
          className="flex items-center gap-4 rounded-2xl border border-stone-700/50 bg-herb-surface/80 p-6 transition hover:border-herb-gold/50"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-herb-gold/20 text-herb-gold">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-stone-100">Email</h3>
            <p className="text-sm text-stone-500">admin@duniaherbs.com.my</p>
          </div>
        </a>

        <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/80 p-6">
          <h3 className="font-semibold text-stone-100 mb-2">ChatBot</h3>
          <p className="text-sm text-stone-500">
            Klik ikon chat di sudut kanan bawah laman utama untuk tanya tentang produk & penghantaran.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/80 p-6">
          <h3 className="font-semibold text-stone-100 mb-2">Laman web</h3>
          <p className="text-sm text-stone-500">{content.footer_website || 'www.duniaherbs.com.my'}</p>
        </div>
      </div>
    </div>
  );
}
