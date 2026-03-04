import Image from 'next/image';
import Link from 'next/link';
import { AnimateIn, AnimateStagger, AnimateStaggerItem } from '@/components/AnimateIn';
import { getProducts, getSiteContent } from '@/lib/data';
import { getHeatLabel } from '@/lib/heat';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Bentuk Badan Ideal (Produk Luaran) — Dunia Herbs',
  description: 'Set Mini Sauna Legend — losyen pati halia untuk kesan panas seperti bersauna. Extra Hot, Super Hot & Extreme Hot. Bantu metabolisme, bakar lemak, kurangkan selulit.',
  openGraph: {
    title: 'Bentuk Badan Ideal (Produk Luaran) — Dunia Herbs',
    description: 'Set penjagaan badan yang memberi kesan panas seperti bersauna. Losyen Mustajab Extra Hot, Super Hot & Extreme Hot.',
  },
};

const D = {
  hero_badge: 'Produk Luaran',
  hero_title: 'Bentuk Badan',
  hero_title_highlight: 'Ideal',
  hero_desc: 'Set penjagaan badan yang memberi kesan panas seperti bersauna. Mengandungi losyen Mustajab Extra Hot, Super Hot dan Extreme Hot — tahap kepanasan berbeza untuk membantu metabolisme, bakar lemak dan kurangkan selulit.',
  intro_label: 'Set Mini Sauna Legend',
  intro_title: 'Kesan Panas Seperti Bersauna\nUntuk Bentuk Badan Yang Diingini',
  intro_p1: 'Sesuai dengan nama yang diberi, Set Mini Sauna adalah set penjagaan badan yang memberi kesan panas bagi mendapatkan khasiat seperti ketika anda sedang bersauna. Mengandungi 3 Losyen Mustajab — Extra Hot, Super Hot dan Extreme Hot — bersaiz 130ml setiap jenis.',
  intro_p2: 'Tahap kepanasan berbeza bertindak sebagai ejen yang dapat meningkatkan kadar metabolisme badan dan seterusnya boleh membantu membakar lemak serta membantu mengurangkan selulit di bahagian perut, peha, pinggul dan lain-lain tempat yang diperlukan.',
  tips_label: 'Khasiat & Kegunaan',
  tips_title: 'Kebaikan Set Mini Sauna',
  tip_1_icon: '🔥', tip_1_title: 'Tingkat Metabolisme', tip_1_desc: 'Kesan panas membantu meningkatkan kadar metabolisme badan untuk pembakaran lemak yang lebih efisien.',
  tip_2_icon: '💪', tip_2_title: 'Bakar Lemak', tip_2_desc: 'Digunakan bersama bengkung, korset atau girdle — amat digalakkan berserta senaman ringan untuk kesan optimum.',
  tip_3_icon: '✨', tip_3_title: 'Kurangkan Selulit', tip_3_desc: 'Sapu pada bahagian bermasalah seperti perut, lengan, peha dan pinggul — urutan pusingan seperti jam sebelum bengkung.',
  tip_4_icon: '🏃', tip_4_title: 'Sesuai Bersenam', tip_4_desc: 'Super Hot & Extreme Hot sesuai disapu ketika bersenam atau bersukan — kehangatan tahan lama membantu pembakaran.',
  tip_5_icon: '🩹', tip_5_title: 'Singkir Angin', tip_5_desc: 'Ekstrak halia membantu mengeluarkan angin dalam badan dan memberi keselesaan pada perut, urat dan otot.',
  tip_6_icon: '⏰', tip_6_title: 'Mudah & Praktikal', tip_6_desc: 'Boleh digunakan waktu pagi sebelum aktiviti atau bila-bila masa. Tidak berminyak, cepat menyerap.',
  article_1_title: 'Extra Hot — Tahap Panas 3', article_1_content: 'Diformulasikan dengan lebih ekstrak halia untuk tahap panas pertengahan. Amat sesuai untuk mereka yang inginkan bentuk badan yang ideal. Pemakaian bengkung atau korset amat digalakkan. Urutan pusingan seperti jam pada perut sebelum bengkung untuk kesan optimum.',
  article_2_title: 'Super Hot — Tahap Panas 4', article_2_content: 'Dengan tambahan Capsicum untuk kehangatan yang lebih tinggi. Sesuai untuk surirumah dengan aktiviti harian dan kegunaan ketika bersenam. Mengekalkan kehangatan ketika berpeluh dan membantu membakar lemak dengan lebih efisien. Boleh disapu nipis sebelum aktiviti bermula.',
  article_3_title: 'Extreme Hot — Tahap Panas 5', article_3_content: 'Tahap kepanasan paling tinggi dengan Iso Slim Complex. Menumpukan pada pembentukan dan kecantikan badan. Disyorkan sapu waktu malam sebelum tidur. Sesuai untuk mereka yang tahan panas dan mahukan kesan maksimum.',
  gallery_label: 'Galeri',
  gallery_title: 'Kegunaan & Cara Pakai',
  produk_label: 'Produk Disyorkan',
  produk_title: 'Set Mini Sauna Legend',
  produk_desc: 'Extra Hot, Super Hot & Extreme Hot — pilihan losyen untuk bentuk badan ideal',
  quote: 'Ketiga-tiga losyen ini adalah best seller dan kini hadir dalam Set Premium Mini Sauna Legend dengan harga mampu milik. Jaga pemakanan sihat, elakkan makanan manis dan bergas, serta lakukan senaman untuk kekal cergas dan cantik menawan.',
  quote_author: '— Dunia Herbs',
  cta_title: 'Dapatkan Bentuk Badan Ideal Anda',
  cta_desc: 'Hubungi kami untuk nasihat produk yang sesuai. Kami sedia membantu.',
};

function c(content: Record<string, string>, key: string) {
  return content[`bentuk_badan_${key}`] || D[key as keyof typeof D] || '';
}

const PRODUCT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop';

export default async function BentukBadanPage() {
  const [products, content] = await Promise.all([getProducts(), getSiteContent()]);
  const CONTACT_EMAIL = 'admin@duniaherbs.com.my';
  const EMAIL_LINK = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Pertanyaan Set Mini Sauna / Bentuk Badan')}`;

  const byId = new Map(products.map((p) => [p.id, p]));
  const sortByOrder = <T extends { sort_order?: number }>(arr: T[]) =>
    [...arr].sort((a, b) => ((a as { sort_order?: number }).sort_order ?? 999) - ((b as { sort_order?: number }).sort_order ?? 999));

  // Koleksi Haruman — bentuk_badan_product_ids atau produk_ids atau fallback Hot/Extreme
  const harumanIds = (content.bentuk_badan_product_ids || content.produk_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const fallbackHaruman = products.filter((p) => p.heat && p.heat !== 'Mild');
  const harumanProducts =
    harumanIds.length > 0
      ? sortByOrder(harumanIds.map((id) => byId.get(id)).filter(Boolean) as typeof products)
      : fallbackHaruman.length > 0 ? fallbackHaruman : products;

  // Koleksi Legend — bentuk_badan_produk_legend_ids (admin bentuk-badan) atau produk_legend_ids atau auto
  const legendIds = (content.bentuk_badan_produk_legend_ids || content.produk_legend_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const mildOrBadge = sortByOrder(products.filter((p) => p.heat === 'Mild' || p.badge)).slice(0, 4);
  const legendProducts =
    legendIds.length > 0
      ? sortByOrder(legendIds.map((id) => byId.get(id)).filter(Boolean) as typeof products)
      : mildOrBadge.length > 0 ? mildOrBadge : sortByOrder(products).slice(0, 4);

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
                <a href={EMAIL_LINK} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:from-amber-600 hover:to-amber-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  Email Kami
                </a>
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
                <Image src={content.bentuk_badan_hero_image || PRODUCT_IMAGE_FALLBACK} alt="Set Mini Sauna Legend" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized={!!content.bentuk_badan_hero_image} />
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
                  <Image src={content[`bentuk_badan_gallery_${i}`] || PRODUCT_IMAGE_FALLBACK} alt={`Galeri ${i}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" unoptimized={!!content[`bentuk_badan_gallery_${i}`]} />
                </div>
              </AnimateIn>
            ))}
          </div>
        </section>

        {/* Products — Koleksi Haruman */}
        <section className="px-6 py-16 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <p className="text-amber-400/70 text-xs tracking-[0.2em] uppercase mb-2 text-center">{content.produk_label || 'Koleksi'}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 text-center mb-3">{content.produk_title || c(content, 'produk_title')}</h2>
              <p className="text-stone-500 text-sm text-center mb-10 max-w-lg mx-auto">{content.produk_subtitle || c(content, 'produk_desc')}</p>
            </AnimateIn>
            <AnimateStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {harumanProducts.map((product) => (
                <AnimateStaggerItem key={product.id}>
                  <Link href={`/produk/${product.id}`} className="group block">
                    <div className="rounded-2xl border border-amber-800/15 bg-gradient-to-br from-stone-900/80 to-stone-950/60 overflow-hidden transition hover:border-amber-600/30 hover:shadow-lg hover:shadow-amber-950/20">
                      <div className="relative aspect-square bg-stone-950">
                        <Image src={product.image_url || PRODUCT_IMAGE_FALLBACK} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                        {product.badge && (<span className="absolute top-3 left-3 rounded-full bg-amber-700/90 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">{product.badge}</span>)}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-stone-100 font-semibold group-hover:text-amber-300 transition">{product.name}</h3>
                        {product.tagline && <p className="text-stone-500 text-xs mt-1">{product.tagline}</p>}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-amber-400 font-semibold text-sm">{product.price}</span>
                          {product.heat && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/20 text-amber-400/70 border border-amber-800/20">{getHeatLabel(product.heat)}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimateStaggerItem>
              ))}
            </AnimateStagger>
          </div>
        </section>

        {/* Products — Koleksi Legend */}
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
                  <Link href={`/produk/${product.id}`} className="group block">
                    <div className="rounded-2xl border border-amber-800/15 bg-gradient-to-br from-stone-900/80 to-stone-950/60 overflow-hidden transition hover:border-amber-600/30 hover:shadow-lg hover:shadow-amber-950/20">
                      <div className="relative aspect-square bg-stone-950">
                        <Image src={product.image_url || PRODUCT_IMAGE_FALLBACK} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                        {product.badge && (<span className="absolute top-3 left-3 rounded-full bg-amber-700/90 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">{product.badge}</span>)}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-stone-100 font-semibold group-hover:text-amber-300 transition">{product.name}</h3>
                        {product.tagline && <p className="text-stone-500 text-xs mt-1">{product.tagline}</p>}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-amber-400 font-semibold text-sm">{product.price}</span>
                          {product.heat && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/20 text-amber-400/70 border border-amber-800/20">{getHeatLabel(product.heat)}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimateStaggerItem>
              ))}
            </AnimateStagger>
          </div>
        </section>

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
            <a href={EMAIL_LINK} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:from-amber-600 hover:to-amber-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Email Kami
            </a>
          </AnimateIn>
        </section>

        <div className="px-6 py-8 text-center">
          <Link href="/" className="text-stone-600 text-sm hover:text-amber-400 transition">← Kembali ke Laman Utama</Link>
        </div>
      </div>
    </div>
  );
}
