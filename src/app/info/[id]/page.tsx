import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInfoAmArticle } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const article = await getInfoAmArticle(id);
  if (!article) return { title: 'Info tidak dijumpai — Dunia Herbs' };
  return {
    title: `${article.title} — Dunia Herbs`,
    description: article.content.slice(0, 160).replace(/\n/g, ' '),
  };
}

export default async function InfoAmDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await getInfoAmArticle(id);

  if (!article) notFound();

  const dateStr = article.updated_at
    ? new Date(article.updated_at).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <article className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <Link
        href="/info"
        className="inline-flex items-center gap-2 text-stone-500 text-sm hover:text-herb-gold transition mb-8"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Info AM
      </Link>

      <header className="mb-8">
        <span className="text-herb-gold text-sm font-medium">{article.category}</span>
        <h1 className="font-serif text-2xl font-bold text-stone-50 mt-2">{article.title}</h1>
        {dateStr && <p className="text-stone-500 text-sm mt-2">{dateStr}</p>}
      </header>

      <div className="prose prose-invert prose-stone max-w-none">
        <div className="text-stone-300 whitespace-pre-wrap leading-relaxed">{article.content}</div>
      </div>

      <p className="mt-10 text-center">
        <Link href="/info" className="text-herb-gold hover:underline text-sm">
          ← Lihat semua info
        </Link>
      </p>
    </article>
  );
}
