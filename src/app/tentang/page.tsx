import Link from 'next/link';
import { getSiteContent, getMilestones } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tentang — Dunia Herbs',
  description: 'Cerita 20 tahun Dunia Herbs — perintis lotion pati halia di Malaysia.',
};

const milestonesFallback = [
  { year: '2005', title: 'Pelancaran', desc: 'Lotion Mustajab Pati Halia dilancarkan. Produk perintis lotion halia pertama di Malaysia.' },
  { year: '2014', title: 'Eksport', desc: 'Produk memasuki pasaran Arab Saudi.' },
  { year: '2024', title: '20 Tahun', desc: '40+ stockist, dipercayai generasi.' },
];

export default async function TentangPage() {
  const [content, dbMilestones] = await Promise.all([getSiteContent(), getMilestones()]);

  const milestones =
    dbMilestones.length > 0
      ? dbMilestones.map((m) => ({
          year: m.year || '',
          title: m.title || '',
          desc: m.description || '',
        }))
      : milestonesFallback;

  const aboutQuote = content.about_quote || 'Saya mulakan Dunia Herbs selepas lebih 20 tahun mencuba pelbagai bisnes. Apa yang bermula dari kegagalan, menjadi kekuatan. Setiap botol Lotion Mustajab mengandungi semangat untuk membantu orang lain.';
  const aboutFounder = content.about_founder || 'Rushdi Abdullah';
  const aboutDescription = content.about_description || 'Bermula dari kegigihan seorang usahawan Malaysia, Dunia Herbs diasaskan dengan satu matlamat — menghasilkan produk herba semula jadi yang benar-benar berkesan. Lebih 20 tahun kemudian, Lotion Mustajab Pati Halia telah menjadi legenda di pasaran Malaysia.';
  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-stone-500 text-sm hover:text-herb-gold transition mb-8"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </Link>

      {/* Hero */}
      <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">Sejak 2005</p>
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-50 mb-4">Cerita Dunia Herbs</h1>
      <p className="text-stone-400 leading-relaxed max-w-2xl">
        {aboutDescription}
      </p>

      {/* Founder */}
      <div className="mt-12 rounded-2xl border border-herb-gold/20 bg-herb-surface/60 p-8 backdrop-blur-md">
        <p className="text-herb-gold/60 text-4xl font-serif leading-none mb-4">"</p>
        <p className="text-stone-300 italic leading-relaxed text-lg">
          {aboutQuote}
        </p>
        <p className="mt-4 text-herb-gold font-medium">{aboutFounder}</p>
        <p className="text-stone-500 text-sm">Pengasas, Dunia Herbs</p>
      </div>

      {/* Values */}
      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md">
          <span className="text-herb-gold text-2xl">✦</span>
          <h3 className="font-semibold text-stone-100 mt-3">Semula Jadi</h3>
          <p className="text-stone-500 text-sm mt-1">100% bahan semula jadi. Pati halia tulen tanpa bahan kimia berbahaya.</p>
        </div>
        <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md">
          <span className="text-herb-gold text-2xl">✦</span>
          <h3 className="font-semibold text-stone-100 mt-3">Halal & Selamat</h3>
          <p className="text-stone-500 text-sm mt-1">Diluluskan JAKIM dan KKM. Selamat untuk seluruh keluarga.</p>
        </div>
        <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md">
          <span className="text-herb-gold text-2xl">✦</span>
          <h3 className="font-semibold text-stone-100 mt-3">Terbukti Berkesan</h3>
          <p className="text-stone-500 text-sm mt-1">20 tahun di pasaran. Dipercayai lebih 80,000 pelanggan setia.</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-16">
        <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.sejarah_label || 'Perjalanan Kami'}</p>
        <h2 className="font-serif text-2xl font-bold text-stone-50 mb-8">{content.sejarah_title || '20 Tahun Sejarah'}</h2>
        <div className="space-y-6">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex-shrink-0 w-16 text-center">
                <span className="font-serif text-xl font-bold text-herb-gold">{m.year}</span>
              </div>
              <div className="flex-1 rounded-2xl border border-herb-gold/15 bg-herb-surface/50 p-5 backdrop-blur-sm">
                <h3 className="font-semibold text-stone-100">{m.title}</h3>
                <p className="text-stone-500 text-sm mt-1">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
