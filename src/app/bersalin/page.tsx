import Image from 'next/image';
import Link from 'next/link';
import { AnimateIn, AnimateStagger, AnimateStaggerItem } from '@/components/AnimateIn';
import { ProductCard } from '@/components/ProductCard';
import { getProducts, getSiteContent, getActivePromotions } from '@/lib/data';
import { applyPromoToProducts } from '@/lib/promotions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Selepas Bersalin & Berpantang — Dunia Herbs',
  description: 'Panduan penjagaan wanita selepas bersalin dengan losyen pati halia semula jadi. Menggantikan param & pilis tradisional.',
  openGraph: {
    title: 'Selepas Bersalin & Berpantang — Dunia Herbs',
    description: 'Panduan penjagaan wanita selepas bersalin dengan losyen pati halia semula jadi.',
  },
};

const D = {
  hero_badge: 'Panduan Ibu Berpantang',
  hero_title: 'Penjagaan Wanita',
  hero_title_highlight: 'Selepas Bersalin',
  hero_desc: 'Petua tradisional Melayu dalam sentuhan moden — losyen pati halia semula jadi untuk ibu-ibu yang baru melahirkan dan sedang berpantang.',
  intro_label: 'Losyen Pati Halia',
  intro_title: 'Sangat Sinonim Untuk\nKegunaan Wanita Selepas Bersalin',
  intro_p1: 'Losyen Mustajab Pati Halia Limau Nipis yang menggunakan ramuan utama pati limau nipis dan pati halia mempunyai pelbagai kegunaan hanya di dalam satu produk sahaja.',
  intro_p2: 'Bauan aroma limau nipis dan halia yang sangat menyegarkan, ditambah pula dengan sedikit bauan \'mint\' dapat membantu menceriakan emosi ibu-ibu selepas bersalin yang biasanya lesu dan tidak bermaya.',
  tips_label: 'Khasiat & Kegunaan',
  tips_title: 'Kebaikan Untuk Ibu Berpantang',
  tip_1_icon: '🌿', tip_1_title: 'Menggantikan Param & Pilis', tip_1_desc: 'Losyen Mustajab Pati Halia Limau Nipis memudahkan ibu-ibu berpantang tanpa perlu sediakan param dan pilis secara tradisional.',
  tip_2_icon: '💆‍♀️', tip_2_title: 'Urutan Lembut', tip_2_desc: 'Lakukan sedikit urutan menggunakan losyen untuk membantu pengaliran darah yang lebih lancar dan menghilangkan rasa kebas.',
  tip_3_icon: '🩹', tip_3_title: 'Membuang Angin', tip_3_desc: 'Pati halia dan limau nipis membantu membuang angin dalam badan — masalah utama wanita selepas bersalin.',
  tip_4_icon: '✨', tip_4_title: 'Mengempiskan Perut', tip_4_desc: 'Sesuai digunakan bersama bengkung untuk mendapatkan kesan optimum mengempiskan perut selepas bersalin.',
  tip_5_icon: '🧘‍♀️', tip_5_title: 'Menyegarkan Badan', tip_5_desc: 'Aroma limau nipis dan halia yang menyegarkan membantu menceriakan emosi ibu-ibu yang lesu selepas bersalin.',
  tip_6_icon: '🕐', tip_6_title: 'Jimat Masa', tip_6_desc: 'Tidak berminyak dan mudah menyerap — memudahkan ibu yang berpantang sendiri tanpa tukang urut.',
  article_1_title: 'Petua Turun-Temurun, Kemudahan Moden', article_1_content: 'Sejak zaman nenek moyang, wanita Melayu mengamalkan petua berpantang menggunakan halia, limau nipis, dan rempah ratus semula jadi. Dunia Herbs menggabungkan kebijaksanaan tradisional ini dalam bentuk losyen moden yang mudah digunakan — tanpa perlu menumbuk param atau menyediakan pilis.',
  article_2_title: 'Kenapa Pati Halia?', article_2_content: 'Halia dikenali sebagai "ratu herba" dalam perubatan tradisional Melayu. Ia membantu melancarkan peredaran darah, mengurangkan bengkak, membuang angin, dan memberikan kehangatan semula jadi pada badan. Losyen Mustajab menggunakan pati halia tulen 100% — bukan perisa atau bahan sintetik.',
  article_3_title: 'Sesuai Untuk Semua Ibu', article_3_content: 'Sama ada bersalin normal atau pembedahan, losyen ini sesuai untuk semua ibu. Sapuan lembut pada perut, pinggang, dan anggota badan sudah memadai. Ditambah dengan pemakaian bengkung, hasilnya lebih berkesan. Sesuai juga untuk ibu yang berpantang sendiri tanpa bantuan tukang urut.',
  gallery_label: 'Galeri',
  gallery_title: 'Kegunaan & Cara Pakai',
  produk_label: 'Produk Disyorkan',
  produk_title: 'Sesuai Untuk Ibu Berpantang',
  produk_desc: 'Pilihan losyen yang lembut dan sesuai untuk kegunaan wanita selepas bersalin',
  quote: 'Limau nipis biasa digunakan oleh wanita selepas bersalin semasa dalam pantang sebagai salah satu bahan untuk mengempiskan perut dan menyegarkan badan yang lesu.',
  quote_author: '— Petua Tradisional Melayu',
  cta_title: 'Mula Berpantang Dengan Cara Moden',
  cta_desc: 'Hubungi kami untuk nasihat produk yang sesuai untuk anda. Kami sedia membantu.',
};

function c(content: Record<string, string>, key: string) {
  return content[`bersalin_${key}`] || D[key as keyof typeof D] || '';
}

const PRODUCT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop';

export default async function BersalinPage() {
  const [products, content, promotions] = await Promise.all([getProducts(), getSiteContent(), getActivePromotions()]);

  const byId = new Map(products.map((p) => [p.id, p]));
  const sortByOrder = <T extends { sort_order?: number }>(arr: T[]) =>
    [...arr].sort((a, b) => ((a as { sort_order?: number }).sort_order ?? 999) - ((b as { sort_order?: number }).sort_order ?? 999));

  // Koleksi Haruman & Legend — hanya papar produk yang admin pilih di Admin Bersalin. Tiada fallback.
  const harumanIds = (content.bersalin_produk_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const legendIds = (content.bersalin_produk_legend_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const harumanRaw = harumanIds.length > 0 ? sortByOrder(harumanIds.map((id) => byId.get(id)).filter(Boolean) as typeof products) : [];
  const legendRaw = legendIds.length > 0 ? sortByOrder(legendIds.map((id) => byId.get(id)).filter(Boolean) as typeof products) : [];
  const harumanProducts = applyPromoToProducts(harumanRaw, promotions);
  const legendProducts = applyPromoToProducts(legendRaw, promotions);

  const tips = [1, 2, 3, 4, 5, 6].map((i) => ({
    icon: c(content, `tip_${i}_icon`),
    title: c(content, `tip_${i}_title`),
    desc: c(content, `tip_${i}_desc`),
  }));

  const articles = [1, 2, 3].map((i) => ({
    title: c(content, `article_${i}_title`),
    content: c(content, `article_${i}_content`),
  }));

  return (
    <div className="relative min-h-screen" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      {/* Background standard — sama dengan Fasha page */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#0a0812]" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-amber-950/15 via-transparent to-rose-950/10" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(212,168,83,0.08),transparent_50%)]" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_60%_80%_at_90%_90%,rgba(190,120,140,0.06),transparent_40%)]" />

      <div className="relative z-10">
        {/* Hero */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent" />
          <div className="relative px-6 py-20 md:py-28 max-w-5xl mx-auto text-center">
            <AnimateIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-900/10 px-5 py-2 mb-8 backdrop-blur-sm">
                <span className="text-amber-400/80 text-xs font-medium tracking-[0.2em] uppercase">{c(content, 'hero_badge')}</span>
                <span className="text-amber-600/50">✦</span>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-stone-50 leading-tight">
                {c(content, 'hero_title')}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">{c(content, 'hero_title_highlight')}</span>
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="mt-6 text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{c(content, 'hero_desc')}</p>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/fasha" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:from-amber-600 hover:to-amber-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Fasha Sandha
                </Link>
                <Link href="/#produk" className="inline-flex items-center gap-2 rounded-xl border border-amber-600/40 px-6 py-3.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-900/20 hover:border-amber-500/50">
                  Lihat Semua Produk
                </Link>
              </div>
            </AnimateIn>
          </div>
        </header>

        <div className="flex items-center justify-center gap-4 py-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700/30" />
          <span className="text-amber-700/40 text-sm">✦ ✦ ✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700/30" />
        </div>

        {/* Image + intro */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <AnimateIn>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-amber-800/20 shadow-2xl shadow-amber-950/20">
                <Image src={content.bersalin_hero_image || PRODUCT_IMAGE_FALLBACK} alt="Losyen untuk ibu berpantang" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized={!!content.bersalin_hero_image} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <div>
                <p className="text-amber-400/70 text-xs tracking-[0.2em] uppercase mb-3">{c(content, 'intro_label')}</p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 mb-4 whitespace-pre-line">{c(content, 'intro_title')}</h2>
                <div className="space-y-4 text-stone-400 leading-relaxed">
                  <p>{c(content, 'intro_p1')}</p>
                  <p>{c(content, 'intro_p2')}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/20 border border-amber-700/20 px-3 py-1.5 text-xs text-amber-300"><span>🌿</span> 100% Semula Jadi</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/20 border border-amber-700/20 px-3 py-1.5 text-xs text-amber-300"><span>☪️</span> Halal JAKIM</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/20 border border-amber-700/20 px-3 py-1.5 text-xs text-amber-300"><span>🏥</span> KKM Diluluskan</span>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Tips */}
        <section className="px-6 py-16 bg-gradient-to-b from-amber-950/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <p className="text-amber-400/70 text-xs tracking-[0.2em] uppercase mb-2 text-center">{c(content, 'tips_label')}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 text-center mb-12">{c(content, 'tips_title')}</h2>
            </AnimateIn>
            <AnimateStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tips.map((tip, i) => (
                <AnimateStaggerItem key={i}>
                  <div className="rounded-2xl border border-amber-800/15 bg-gradient-to-br from-amber-950/10 to-stone-950/40 p-6 backdrop-blur-sm h-full">
                    <span className="text-2xl mb-3 block">{tip.icon}</span>
                    <h3 className="font-serif text-stone-100 font-semibold mb-2">{tip.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{tip.desc}</p>
                  </div>
                </AnimateStaggerItem>
              ))}
            </AnimateStagger>
          </div>
        </section>

        {/* Articles */}
        <section className="px-6 py-16 max-w-3xl mx-auto">
          <AnimateStagger className="space-y-12">
            {articles.map((section, i) => (
              <AnimateStaggerItem key={i}>
                <article className="relative pl-8 border-l-2 border-amber-800/20">
                  <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-amber-600/60 border-2 border-amber-800/40" />
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-100 mb-3">{section.title}</h3>
                  <p className="text-stone-400 leading-relaxed">{section.content}</p>
                </article>
              </AnimateStaggerItem>
            ))}
          </AnimateStagger>
        </section>

        {/* Gallery */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <AnimateIn>
            <p className="text-amber-400/70 text-xs tracking-[0.2em] uppercase mb-2 text-center">{c(content, 'gallery_label')}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 text-center mb-10">{c(content, 'gallery_title')}</h2>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <div className="relative aspect-square rounded-xl overflow-hidden border border-amber-800/15 bg-stone-950">
                  <Image src={content[`bersalin_gallery_${i}`] || PRODUCT_IMAGE_FALLBACK} alt={`Galeri bersalin ${i}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" unoptimized={!!content[`bersalin_gallery_${i}`]} />
                </div>
              </AnimateIn>
            ))}
          </div>
        </section>

        {/* Products — Koleksi Haruman (hanya papar jika admin pilih) */}
        {harumanProducts.length > 0 && (
        <section className="px-6 py-16 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <p className="text-amber-400/70 text-xs tracking-[0.2em] uppercase mb-2 text-center">{content.produk_label || 'Koleksi'}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 text-center mb-3">{content.produk_title || 'KOLEKSI HARUMAN'}</h2>
              <p className="text-stone-500 text-sm text-center mb-10 max-w-lg mx-auto">{content.produk_subtitle || c(content, 'produk_desc')}</p>
            </AnimateIn>
            <AnimateStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {harumanProducts.map((product) => (
                <AnimateStaggerItem key={product.id}>
                  <ProductCard product={product} />
                </AnimateStaggerItem>
              ))}
            </AnimateStagger>
          </div>
        </section>
        )}

        {/* Products — Koleksi Legend (hanya papar jika admin pilih) */}
        {legendProducts.length > 0 && (
        <section className="px-6 py-16 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <p className="text-amber-400/70 text-xs tracking-[0.2em] uppercase mb-2 text-center">{content.produk_legend_label || 'Koleksi'}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 text-center mb-3">{content.produk_legend_title || 'KOLEKSI LEGEND'}</h2>
              <p className="text-stone-500 text-sm text-center mb-10 max-w-lg mx-auto">{content.produk_legend_subtitle || 'Produk ikonik yang menjadi pilihan sejak 2005'}</p>
            </AnimateIn>
            <AnimateStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {legendProducts.map((product) => (
                <AnimateStaggerItem key={product.id}>
                  <ProductCard product={product} />
                </AnimateStaggerItem>
              ))}
            </AnimateStagger>
          </div>
        </section>
        )}

        {/* Quote */}
        <section className="px-6 py-16 max-w-3xl mx-auto text-center">
          <AnimateIn>
            <div className="rounded-2xl border border-amber-800/15 bg-amber-950/5 p-8 md:p-12 backdrop-blur-sm">
              <span className="text-4xl text-amber-600/40 font-serif">&ldquo;</span>
              <p className="font-serif text-xl md:text-2xl text-stone-200 italic leading-relaxed mt-2">{c(content, 'quote')}</p>
              <p className="text-amber-500/60 text-sm mt-4">{c(content, 'quote_author')}</p>
            </div>
          </AnimateIn>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 max-w-3xl mx-auto text-center">
          <AnimateIn>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 mb-4">{c(content, 'cta_title')}</h2>
            <p className="text-stone-400 mb-8 max-w-lg mx-auto">{c(content, 'cta_desc')}</p>
            <Link href="/fasha" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:from-amber-600 hover:to-amber-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Fasha Sandha
            </Link>
          </AnimateIn>
        </section>

        <div className="px-6 py-8 text-center">
          <Link href="/" className="text-stone-600 text-sm hover:text-amber-400 transition">← Kembali ke Laman Utama</Link>
        </div>
      </div>
    </div>
  );
}
