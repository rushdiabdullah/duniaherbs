import Link from 'next/link';
import { getFaqs, getSiteContent } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'FAQ — Dunia Herbs',
  description: 'Soalan lazim tentang produk Lotion Mustajab dan penghantaran.',
};

const faqsFallback = [
  { question: 'Adakah produk Dunia Herbs halal?', answer: 'Ya, semua produk diluluskan Halal oleh JAKIM dan KKM.' },
  { question: 'Bagaimana cara menggunakan Lotion Mustajab?', answer: 'Sapu pada sendi, otot atau abdomen. Untuk luaran sahaja. Jangan guna pada bayi.' },
  { question: 'Bagaimana nak hubungi customer service?', answer: 'Email kami di admin@duniaherbs.com.my atau gunakan ChatBot di laman utama. Kami jawab dalam BM.' },
];

export default async function FAQPage() {
  const [faqs, content] = await Promise.all([getFaqs(), getSiteContent()]);
  const items = faqs.length > 0 ? faqs : faqsFallback;
  const EMAIL_LINK = 'mailto:admin@duniaherbs.com.my';

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
      <h1 className="font-serif text-2xl font-bold text-stone-50 mb-2">{content.faq_preview_title || 'Soalan lazim'}</h1>
      <p className="text-stone-500 mb-10">{content.cs_subtitle || 'Jawapan untuk soalan biasa tentang produk & penghantaran'}</p>
      <div className="space-y-6">
        {items.map((f, i) => (
          <div
            key={f.question || i}
            className="rounded-2xl border border-stone-700/50 bg-herb-surface/80 p-5 backdrop-blur-sm"
          >
            <p className="font-medium text-stone-200">{f.question}</p>
            <p className="text-stone-500 text-sm mt-2">{f.answer}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-stone-500 text-sm">
        Masih ada soalan?{' '}
        <a href={EMAIL_LINK} className="text-herb-gold hover:underline">
          Email kami
        </a>
      </p>
    </div>
  );
}
