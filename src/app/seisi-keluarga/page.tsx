import Image from 'next/image';
import Link from 'next/link';
import { AnimateIn, AnimateStagger, AnimateStaggerItem } from '@/components/AnimateIn';
import { getProducts, getSiteContent } from '@/lib/data';
import { getHeatLabel } from '@/lib/heat';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Kegunaan Seisi Keluarga — Losyen Mustajab Pati Halia — Dunia Herbs',
  description: 'Losyen Mustajab Pati Halia — perintis losyen pati halia sejak 2005. Kegunaan seisi keluarga, urutan, legakan ketidakselesaan. Sesuai dibawa semasa umrah & haji.',
  openGraph: {
    title: 'Kegunaan Seisi Keluarga — Losyen Mustajab Pati Halia — Dunia Herbs',
    description: 'Losyen serbaguna untuk seisi keluarga. Perintis losyen pati halia No.1 di Malaysia sejak 2005.',
  },
};

const D = {
  hero_badge: 'Losyen Pati Halia',
  hero_title: 'Kegunaan',
  hero_title_highlight: 'Seisi Keluarga',
  hero_desc: 'Losyen Mustajab Ekstrak Halia adalah losyen pertama keluaran Dunia Herbs seterusnya menjadi peneraju utama dalam pengeluaran losyen hangat berasaskan halia. Kegunaan seisi keluarga dan losyen serbaguna — harus dimiliki oleh setiap isi rumah.',
  intro_label: 'Losyen Mustajab Pati Halia',
  intro_title: 'Perintis Losyen Pati Halia\nSejak 2005',
  intro_p1: 'Sejak mula diperkenalkan pada tahun 2005, Losyen Mustajab Pati Halia Dunia Herbs menjadi perintis bagi produk losyen berasaskan pati halia. Losyen ini bersifat tidak melekit dan cepat meresap pada kulit serta mempunyai kehangatan yang sederhana.',
  intro_p2: 'Halia atau nama saintifiknya Zingiber officinale dari keluarga Zingiberaceae kaya dengan kandungan kalium, fosforus dan kalsium, protein, karbohidrat, gentian, vitamin C dan niasin. Khasiat halia dalam merawat pelbagai penyakit bukan saja diketahui menerusi kaedah tradisional malah telah dibuktikan oleh pakar-pakar perubatan moden.',
  tips_label: 'Khasiat & Kegunaan',
  tips_title: 'Kebaikan Losyen Pati Halia',
  tip_1_icon: '💆', tip_1_title: 'Digunakan Untuk Tujuan Urutan', tip_1_desc: 'Sesuai untuk urutan badan, sendi dan otot. Kehangatan halia membantu melancarkan pengaliran darah dan melegakan ketidakselesaan.',
  tip_2_icon: '🔄', tip_2_title: 'Boleh Digunakan Sekerap Mungkin', tip_2_desc: 'Tidak berminyak dan cepat meresap. Gunakan secara konsisten dibantu dengan senaman ringan untuk kesan optimum.',
  tip_3_icon: '👨‍👩‍👧‍👦', tip_3_title: 'Kegunaan Seisi Keluarga', tip_3_desc: 'Sesuai untuk pelbagai lapisan masyarakat. Kecuali bayi. Mudah dibawa kemana sahaja.',
  tip_4_icon: '🩹', tip_4_title: 'Legakan Ketidakselesaan', tip_4_desc: 'Kandungan aktif Gingeroles dalam halia memberi kesan apabila meresap ke dalam badan. Membantu melegakan sendi dan otot.',
  tip_5_icon: '✨', tip_5_title: 'Serbaguna & Praktikal', tip_5_desc: 'Satu produk untuk pelbagai kegunaan — urutan, ketidakselesaan badan, angin dalam badan. Sesuai untuk rutin harian.',
  tip_6_icon: '🕐', tip_6_title: '20 Tahun Di Pasaran', tip_6_desc: 'Produk perintis Dunia Herbs yang telah dipercayai ramai sejak 2005. KKM & Halal JAKIM.',
  article_1_title: 'Perintis Losyen Pati Halia', article_1_content: 'Losyen Mustajab Pati Halia ialah produk pertama keluaran Dunia Herbs dan seterusnya menjadi peneraju utama dalam pengeluaran losyen hangat berasaskan halia di Malaysia. Losyen serbaguna yang harus dimiliki oleh setiap isi rumah.',
  article_2_title: 'Khasiat Halia & Gingeroles', article_2_content: 'Menurut kajian, kandungan aktif dalam halia yang dikenali sebagai Gingeroles memberi kesan apabila ia meresap ke dalam badan. Halia membantu melancarkan peredaran darah, mengurangkan bengkak, membuang angin, dan memberikan kehangatan semula jadi.',
  article_3_title: 'Sesuai Untuk Semua', article_3_content: 'Dari remaja hingga warga emas, losyen ini sesuai untuk pelbagai lapisan masyarakat. Sapuan pada sendi, otot atau abdomen. Untuk luaran sahaja. Tidak sesuai untuk bayi. Harga: SM RM23.00 / SS RM26.00. Kandungan: 130ml.',
  umrah_title: 'Kegunaan Semasa Umrah & Haji',
  umrah_content: 'Losyen Mustajab Pati Halia amat sesuai dibawa bersama semasa menunaikan umrah atau haji di tanah suci Mekah. Cuaca panas dan perjalanan jauh boleh menyebabkan ketidakselesaan sendi, otot dan angin dalam badan. Sapuan losyen pada bahagian yang dikehendaki dapat membantu melegakan ketidakselesaan dan memberi kehangatan yang menyegarkan. Saiz 130ml mudah dibawa dalam bagasi. Halal JAKIM — sesuai untuk jemaah.',
  gallery_label: 'Galeri',
  gallery_title: 'Kegunaan & Cara Pakai',
  produk_label: 'Produk Disyorkan',
  produk_title: 'Losyen Pati Halia',
  produk_haruman_title: 'KOLEKSI HARUMAN',
  produk_legend_title: 'KOLEKSI LEGEND',
  produk_desc: 'Pilihan losyen pati halia kuning — Legend & Haruman. Sesuai untuk kegunaan seisi keluarga.',
  quote: 'Losyen Mustajab Pati Halia memiliki banyak kelebihan serta kegunaannya. Ianya mudah dibawa kemana sahaja dan sesuai untuk pelbagai lapisan masyarakat. Gunakan secara konsisten dan dibantu dengan senaman ringan, pasti peroleh kesan yang optimum.',
  quote_author: '— Dunia Herbs',
  cta_title: 'Dapatkan Losyen Pati Halia Anda',
  cta_desc: 'Hubungi kami untuk nasihat produk yang sesuai. Kami sedia membantu.',
};

function c(content: Record<string, string>, key: string) {
  return content[`seisi_keluarga_${key}`] || D[key as keyof typeof D] || '';
}

const PRODUCT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop';

export default async function SeisiKeluargaPage() {
  const [products, content] = await Promise.all([getProducts(), getSiteContent()]);
  const CONTACT_EMAIL = 'admin@duniaherbs.com.my';
  const EMAIL_LINK = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Pertanyaan Losyen Pati Halia / Seisi Keluarga')}`;

  const byId = new Map(products.map((p) => [p.id, p]));
  const sortByOrder = <T extends { sort_order?: number }>(arr: T[]) =>
    [...arr].sort((a, b) => ((a as { sort_order?: number }).sort_order ?? 999) - ((b as { sort_order?: number }).sort_order ?? 999));

  // Koleksi Haruman & Legend — hanya papar jika admin telah pilih di Admin Seisi Keluarga
  const harumanIds = (content.seisi_keluarga_product_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const legendIds = (content.seisi_keluarga_produk_legend_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const harumanProducts = harumanIds.length > 0 ? sortByOrder(harumanIds.map((id) => byId.get(id)).filter(Boolean) as typeof products) : [];
  const legendProducts = legendIds.length > 0 ? sortByOrder(legendIds.map((id) => byId.get(id)).filter(Boolean) as typeof products) : [];

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
                  Beli Online
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
                <Image src={content.seisi_keluarga_hero_image || PRODUCT_IMAGE_FALLBACK} alt="Losyen Mustajab Pati Halia" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized={!!content.seisi_keluarga_hero_image} />
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

        {/* Bonus: Umrah & Haji segment */}
        <section className="px-6 py-12 max-w-3xl mx-auto">
          <AnimateIn>
            <div className="rounded-2xl border border-amber-700/30 bg-gradient-to-br from-amber-950/20 to-stone-950/60 p-8 md:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🕋</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-100">{c(content, 'umrah_title')}</h3>
              </div>
              <p className="text-stone-400 leading-relaxed">{c(content, 'umrah_content')}</p>
            </div>
          </AnimateIn>
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
                  <Image src={content[`seisi_keluarga_gallery_${i}`] || PRODUCT_IMAGE_FALLBACK} alt={`Galeri ${i}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" unoptimized={!!content[`seisi_keluarga_gallery_${i}`]} />
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
              <p className="text-amber-400/70 text-xs tracking-[0.2em] uppercase mb-2 text-center">{c(content, 'produk_label')}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 text-center mb-3">{c(content, 'produk_haruman_title')}</h2>
              <p className="text-stone-500 text-sm text-center mb-10 max-w-lg mx-auto">{c(content, 'produk_desc')}</p>
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
        )}

        {/* Products — Koleksi Legend (hanya papar jika admin pilih) */}
        {legendProducts.length > 0 && (
        <section className="px-6 py-16 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <p className="text-amber-400/70 text-xs tracking-[0.2em] uppercase mb-2 text-center">{c(content, 'produk_label')}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 text-center mb-3">{c(content, 'produk_legend_title')}</h2>
              <p className="text-stone-500 text-sm text-center mb-10 max-w-lg mx-auto">{c(content, 'produk_desc')}</p>
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
            <a href={EMAIL_LINK} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:from-amber-600 hover:to-amber-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Beli Online
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
