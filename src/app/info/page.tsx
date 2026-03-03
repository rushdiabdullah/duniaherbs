import Link from 'next/link';
import { getInfoAmArticles } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Info AM — Dunia Herbs',
  description: 'Tips kesihatan, cara guna produk, dan info Dunia Herbs.',
};

export default async function InfoAmPage() {
  const articles = await getInfoAmArticles();

  const byCategory = articles.reduce<Record<string, typeof articles>>((acc, a) => {
    const cat = a.category || 'Umum';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(a);
    return acc;
  }, {});

  const categories = Object.keys(byCategory).sort();

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-stone-500 text-sm hover:text-herb-gold transition mb-8"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </Link>
      <h1 className="font-serif text-2xl font-bold text-stone-50 mb-2">Info AM</h1>
      <p className="text-stone-500 mb-10">Tips kesihatan, cara guna produk, dan info Dunia Herbs</p>

      {articles.length === 0 ? (
        <p className="text-stone-500 text-sm">Tiada info buat masa ini.</p>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="text-stone-400 text-sm font-medium tracking-widest uppercase mb-4">{cat}</h2>
              <div className="space-y-3">
                {byCategory[cat].map((a) => (
                  <Link
                    key={a.id}
                    href={`/info/${a.id}`}
                    className="block rounded-2xl border border-stone-700/50 bg-herb-surface/80 p-5 backdrop-blur-sm hover:border-herb-gold/30 transition"
                  >
                    <p className="font-medium text-stone-200">{a.title}</p>
                    <p className="text-stone-500 text-sm mt-1 line-clamp-2">
                      {a.content.replace(/\n/g, ' ').length > 120
                        ? a.content.replace(/\n/g, ' ').slice(0, 120) + '...'
                        : a.content.replace(/\n/g, ' ')}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
