import Image from 'next/image';
import Link from 'next/link';
import { AnimateIn, AnimateStagger, AnimateStaggerItem } from '@/components/AnimateIn';
import { ProductCarousel } from '@/components/ProductCarousel';
import { GoldDivider } from '@/components/GoldDivider';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ShimmerButton } from '@/components/ShimmerButton';
import { Marquee } from '@/components/Marquee';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { VideoShowcase } from '@/components/VideoShowcase';
import { VideoGallery } from '@/components/VideoGallery';
import { getProducts, getSiteContent, getMilestones, getFaqs } from '@/lib/data';

export const dynamic = 'force-dynamic';

const productsFallback = [
  { id: '1', name: 'Lotion Mustajab Pati Halia', tagline: 'Multi-purpose • Sesuai ibu bersalin', price: 'RM 22.90', badge: 'Bestseller', heat: 'Mild', image_url: undefined as string | undefined, sort_order: 0 },
  { id: '2', name: 'Lotion Mustajab Lime & Ginger', tagline: 'Pati halia + limau nipis', price: 'RM 22.90', heat: 'Mild', image_url: undefined as string | undefined, sort_order: 1 },
  { id: '3', name: 'Lotion Mustajab Super Hot', tagline: 'Dengan capsicum • Untuk workout', price: 'RM 24.90', badge: 'Popular', heat: 'Hot', image_url: undefined as string | undefined, sort_order: 2 },
  { id: '4', name: 'Lotion Mustajab Extra Hot', tagline: 'Shaping • Extra halia', price: 'RM 23.90', heat: 'Hot', image_url: undefined as string | undefined, sort_order: 3 },
  { id: '5', name: 'Lotion Mustajab Extreme Hot', tagline: 'Kepanasan maksimum • Untuk sukan lasak', price: 'RM 25.90', badge: 'Terbaru', heat: 'Extreme', image_url: undefined as string | undefined, sort_order: 4 },
  { id: '6', name: 'Lotion Mustajab Extra Ginger', tagline: 'Halia berganda • Kehidupan aktif', price: 'RM 23.90', heat: 'Hot', image_url: undefined as string | undefined, sort_order: 5 },
  { id: '7', name: 'Lotion Mustajab Pati Halia 65ml', tagline: 'Saiz mini • Travel size', price: 'RM 14.90', badge: 'Jimat', heat: 'Mild', image_url: undefined as string | undefined, sort_order: 6 },
  { id: '8', name: 'Lotion Mustajab Super Hot 65ml', tagline: 'Saiz mini • Capsicum workout', price: 'RM 15.90', heat: 'Hot', image_url: undefined as string | undefined, sort_order: 7 },
];

const defaultBenefits = [
  { icon: '🩹', title: 'Ketidakselesaan sendi & otot', desc: 'Membantu melegakan ketidakselesaan dengan pati halia semula jadi' },
  { icon: '🔥', title: 'Bakar lemak', desc: 'Bantu proses pembakaran lemak & shaping' },
  { icon: '🤱', title: 'Ibu bersalin', desc: 'Sesuai untuk urutan postpartum' },
  { icon: '✨', title: 'Selulit & kedut', desc: 'Kurangkan penampilan selulit' },
  { icon: '🩸', title: 'Senggugut', desc: 'Legakan kekejangan & kembung perut' },
];

export default async function HomePage() {
  const [dbProducts, content, milestones, faqs] = await Promise.all([
    getProducts(),
    getSiteContent(),
    getMilestones(),
    getFaqs(),
  ]);

  const products = dbProducts.length > 0
    ? dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline || '',
        price: p.price || '',
        badge: p.badge || undefined,
        heat: p.heat || undefined,
        image_url: p.image_url || undefined,
        sort_order: (p as { sort_order?: number }).sort_order ?? 999,
      }))
    : productsFallback;

  const byId = new Map(products.map((p) => [p.id, p]));

  const sortByOrder = <T extends { sort_order?: number }>(arr: T[]) =>
    [...arr].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

  // KOLEKSI HARUMAN (atas) — produk_ids atau semua produk, ikut sort_order
  const harumanIds = (content.produk_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const harumanProducts =
    harumanIds.length > 0
      ? sortByOrder(harumanIds.map((id) => byId.get(id)).filter(Boolean) as typeof products)
      : products;

  // KOLEKSI LEGEND (bawah) — produk_legend_ids atau default: Mild/berbadge (max 4), ikut sort_order
  const legendIds = (content.produk_legend_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const mildOrBadge = sortByOrder(products.filter((p) => p.heat === 'Mild' || p.badge)).slice(0, 4);
  const legendProducts =
    legendIds.length > 0
      ? sortByOrder(legendIds.map((id) => byId.get(id)).filter(Boolean) as typeof products)
      : mildOrBadge.length > 0 ? mildOrBadge : sortByOrder(products).slice(0, 4);

  const CONTACT_EMAIL = 'admin@duniaherbs.com.my';
  const EMAIL_LINK = `mailto:${CONTACT_EMAIL}`;

  const benefits = [1, 2, 3, 4, 5].map((i) => ({
    icon: content[`benefit_${i}_icon`] || defaultBenefits[i - 1].icon,
    title: content[`benefit_${i}_title`] || defaultBenefits[i - 1].title,
    desc: content[`benefit_${i}_desc`] || defaultBenefits[i - 1].desc,
  }));

  const timeline = milestones.length > 0
    ? milestones.map((m) => ({ year: m.year || '', title: m.title || '', desc: m.description || '' }))
    : [
        { year: '2005', title: 'Pelancaran', desc: 'Lotion Mustajab Pati Halia dilancarkan — perintis lotion halia di Malaysia.' },
        { year: '2014', title: 'Eksport', desc: 'Produk memasuki pasaran Arab Saudi.' },
        { year: '2024', title: '20 Tahun', desc: '40+ stockist, dipercayai generasi.' },
      ];

  let marqueeItems: string[] | undefined;
  if (content.marquee_items) {
    marqueeItems = content.marquee_items.split('|').map((s) => s.trim()).filter(Boolean);
  }

  let counterStats: { value: number; suffix?: string; label: string }[] | undefined;
  if (content.counter_stats) {
    try {
      const parsed = JSON.parse(content.counter_stats) as { stats?: { value: number; suffix?: string; label: string }[] };
      if (parsed?.stats?.length) counterStats = parsed.stats;
    } catch {
      /* ignore */
    }
  }

  const faqPreview = faqs.length > 0 ? faqs.slice(0, 3).map((f) => ({ q: f.question, a: f.answer })) : [
    { q: 'Produk halal?', a: 'Ya, diluluskan JAKIM & KKM.' },
    { q: 'Cara guna?', a: 'Sapu pada sendi, otot atau abdomen. Luaran sahaja.' },
    { q: 'Berapa lama penghantaran?', a: '2–5 hari bekerja (Semenanjung).' },
  ];

  return (
    <div className="relative min-h-screen" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-herb-surface/80 via-herb-dark/90 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(212,168,83,0.10),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_10%,rgba(30,60,140,0.14),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_70%_20%,rgba(40,80,180,0.06),transparent)]" />
        <div className="relative px-6 py-20 md:py-28 max-w-6xl mx-auto">
          <AnimateIn delay={0}>
            <div className="flex justify-center mb-8">
              {content.hero_badge_image ? (
                <Image
                  src={content.hero_badge_image}
                  alt={content.hero_badge || 'Dunia Herbs'}
                  width={520}
                  height={180}
                  className="h-[144px] md:h-[187px] w-auto object-contain"
                  priority
                />
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-herb-gold/40 bg-herb-gold/10 px-5 py-2 backdrop-blur-sm">
                  <span className="text-herb-gold text-xs font-medium tracking-[0.2em] uppercase">
                    {content.hero_badge || '20 Tahun di Pasaran Malaysia'}
                  </span>
                  <span className="text-herb-gold/60">✦</span>
                </div>
              )}
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-[2fr_3fr] gap-8 items-center">
            <AnimateIn delay={0.1}>
              <div>
                <p className="text-herb-gold/90 text-xs font-medium tracking-[0.15em] uppercase mb-2">
                  {content.hero_subtitle || 'Dunia Herbs • Trusted Since 2005'}
                </p>
              <h1 className="font-serif text-2xl md:text-4xl font-bold tracking-tight text-stone-50">
                {content.hero_title || 'Memang Mustajab'}
              </h1>
              <p className="mt-3 text-stone-400 text-sm md:text-base max-w-sm leading-relaxed">
                {content.hero_description || 'Lotion Mustajab Pati Halia — produk #1 herba halia di Malaysia. KKM & Halal JAKIM.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ShimmerButton href="/fasha">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Fasha Sandha
                </ShimmerButton>
                <Link
                  href="#produk"
                  className="inline-flex items-center gap-2 rounded-xl border border-herb-gold/50 px-5 py-3 text-sm font-semibold text-herb-gold transition hover:border-herb-gold hover:bg-herb-gold/10"
                >
                  {content.hero_cta_produk || 'Lihat Produk'}
                </Link>
              </div>
            </div>
            </AnimateIn>
            <AnimateIn delay={0.2} direction="right">
            <div className="relative aspect-[4/3] w-full mx-auto">
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-blue-950/40 bg-herb-surface/80 backdrop-blur-sm shadow-2xl shadow-black/30">
                <Image
                  src={content.hero_image || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=800&fit=crop'}
                  alt="Lotion Mustajab Dunia Herbs"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 576px"
                  priority
                />
              </div>
            </div>
            </AnimateIn>
          </div>
        </div>
      </header>

      {/* Duta Dunia Herbs - Grid Gallery */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <AnimateIn>
          <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.duta_label || 'Duta Rasmi'}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-2">{content.duta_title || 'Fasha Sandha × Dunia Herbs'}</h2>
          <p className="text-stone-400 mb-4">{content.duta_desc || 'Tonton video eksklusif daripada duta rasmi kami — Fasha Sandha'}</p>
          <Link href="/fasha" className="inline-block text-sm text-herb-gold hover:text-herb-goldLight transition font-medium mb-8">
            {content.duta_link_text || 'Lihat landing page khas Fasha →'}
          </Link>
        </AnimateIn>
        <VideoGallery />
      </section>

      {/* Marquee ticker */}
      <Marquee items={marqueeItems} />

      {/* Animated counter */}
      <AnimatedCounter stats={counterStats} />

      <GoldDivider />

      {/* Products — Koleksi Unggulan (atas) */}
      <section id="produk" className="relative px-6 py-16 max-w-6xl mx-auto">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(30,60,140,0.06),transparent)]" />
        <AnimateIn>
          <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.produk_label || 'Koleksi Unggulan'}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-2">{content.produk_title || 'KOLEKSI HARUMAN'}</h2>
          <p className="text-stone-400 mb-10">{content.produk_subtitle || 'Lotion pati halia 130ml — luaran sahaja'}</p>
        </AnimateIn>
        <ProductCarousel products={harumanProducts} />
      </section>

      {/* Products — Koleksi Legend (bawah) */}
      <section id="produk-legend" className="relative px-6 py-16 max-w-6xl mx-auto">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(30,60,140,0.06),transparent)]" />
        <AnimateIn>
          <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.produk_legend_label || 'Koleksi'}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-2">{content.produk_legend_title || 'KOLEKSI LEGEND'}</h2>
          <p className="text-stone-400 mb-10">{content.produk_legend_subtitle || 'Produk ikonik yang menjadi pilihan sejak 2005'}</p>
        </AnimateIn>
        <ProductCarousel products={legendProducts} />
      </section>

      {/* Kegunaan & Panduan — 4 link ke halaman bersalin / seisi keluarga / bentuk badan / produk minuman */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <AnimateIn>
          <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.kegunaan_label || 'Kegunaan & Panduan'}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-2">{content.kegunaan_title || 'Jelajahi Kegunaan Produk'}</h2>
          <p className="text-stone-400 mb-10">{content.kegunaan_subtitle || 'Produk kami untuk pelbagai situasi & keperluan'}</p>
        </AnimateIn>
        <AnimateStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimateStaggerItem>
            <Link
              href="/bersalin"
              className="flex items-center gap-4 rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md transition hover:border-herb-gold/50 hover:bg-herb-surface/80 group"
            >
              <span className="text-2xl">🤱</span>
              <div>
                <h3 className="font-semibold text-stone-100 group-hover:text-herb-gold transition">Selepas Bersalin</h3>
                <p className="text-sm text-stone-500 mt-0.5">Losyen untuk ibu berpantang</p>
              </div>
              <svg className="h-5 w-5 text-stone-500 group-hover:text-herb-gold ml-auto transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </AnimateStaggerItem>
          <AnimateStaggerItem>
            <Link
              href="/seisi-keluarga"
              className="flex items-center gap-4 rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md transition hover:border-herb-gold/50 hover:bg-herb-surface/80 group"
            >
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div>
                <h3 className="font-semibold text-stone-100 group-hover:text-herb-gold transition">Seisi Keluarga</h3>
                <p className="text-sm text-stone-500 mt-0.5">Losyen serbaguna untuk seisi rumah</p>
              </div>
              <svg className="h-5 w-5 text-stone-500 group-hover:text-herb-gold ml-auto transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </AnimateStaggerItem>
          <AnimateStaggerItem>
            <Link
              href="/bentuk-badan"
              className="flex items-center gap-4 rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md transition hover:border-herb-gold/50 hover:bg-herb-surface/80 group"
            >
              <span className="text-2xl">💪</span>
              <div>
                <h3 className="font-semibold text-stone-100 group-hover:text-herb-gold transition">Bentuk Badan Ideal</h3>
                <p className="text-sm text-stone-500 mt-0.5">Set Mini Sauna Legend</p>
              </div>
              <svg className="h-5 w-5 text-stone-500 group-hover:text-herb-gold ml-auto transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </AnimateStaggerItem>
          <AnimateStaggerItem>
            <Link
              href="/produk-minuman"
              className="flex items-center gap-4 rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md transition hover:border-herb-gold/50 hover:bg-herb-surface/80 group"
            >
              <span className="text-2xl">🥤</span>
              <div>
                <h3 className="font-semibold text-stone-100 group-hover:text-herb-gold transition">Produk Minuman</h3>
                <p className="text-sm text-stone-500 mt-0.5">Mustajab Extra Daytox & detoks</p>
              </div>
              <svg className="h-5 w-5 text-stone-500 group-hover:text-herb-gold ml-auto transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </AnimateStaggerItem>
        </AnimateStagger>
      </section>

      {/* Video Iklan Komersial */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <AnimateIn>
          <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.video_label || 'Tonton'}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-2">{content.video_title || 'Video Iklan'}</h2>
          <p className="text-stone-400 mb-10">{content.video_subtitle || 'Koleksi video komersial Dunia Herbs'}</p>
        </AnimateIn>
        <VideoShowcase />
      </section>

      <GoldDivider />

      {/* Sejarah / Timeline */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <AnimateIn>
          <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.sejarah_label || 'Legasi Kami'}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-10">{content.sejarah_title || 'Sejak 2005'}</h2>
        </AnimateIn>
        <AnimateStagger className="space-y-8">
          {timeline.map((t, i) => (
            <AnimateStaggerItem key={i}>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 text-center">
                  <span className="font-serif text-2xl font-bold text-herb-gold">{t.year}</span>
                </div>
                <div className="flex-1 rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md">
                  <h3 className="font-semibold text-stone-100">{t.title}</h3>
                  <p className="text-stone-500 text-sm mt-1">{t.desc}</p>
                </div>
              </div>
            </AnimateStaggerItem>
          ))}
        </AnimateStagger>
      </section>

      <GoldDivider />

      {/* Testimonial */}
      <section className="relative px-6 py-16 bg-herb-surface/20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(212,168,83,0.04),rgba(30,60,140,0.05),transparent)]" />
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.testimonial_label || 'Kata Pelanggan'}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-10">{content.testimonial_title || 'Dipercayai Ramai'}</h2>
          </AnimateIn>
          <TestimonialSlider />
        </div>
      </section>

      <GoldDivider />

      {/* Benefits */}
      <section className="relative px-6 py-16 bg-herb-surface/20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_50%_at_70%_50%,rgba(30,60,140,0.07),transparent)]" />
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.benefits_label || 'Khasiat Semula Jadi'}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-2">{content.benefits_title || 'Kebaikan'}</h2>
            <p className="text-stone-400 mb-10">{content.benefits_subtitle || 'Multi-purpose lotion untuk seluruh keluarga'}</p>
          </AnimateIn>
          <AnimateStagger className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {benefits.map((b, i) => (
              <AnimateStaggerItem key={i}>
                <div className="rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-5 backdrop-blur-md transition hover:border-herb-gold/30 hover:bg-herb-surface/80">
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="font-medium text-stone-200 mt-2">{b.title}</h3>
                  <p className="text-sm text-stone-500 mt-1">{b.desc}</p>
                </div>
              </AnimateStaggerItem>
            ))}
          </AnimateStagger>
        </div>
      </section>

      {/* Customer Service */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <AnimateIn>
          <p className="text-herb-gold/80 text-sm tracking-widest uppercase mb-2">{content.cs_label || 'Sokongan Pelanggan'}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-50 mb-2">{content.cs_title || 'Customer Service'}</h2>
          <p className="text-stone-400 mb-10">{content.cs_subtitle || 'Kami sedia membantu — tanya apa sahaja'}</p>
        </AnimateIn>
        <AnimateStagger className="grid md:grid-cols-3 gap-6">
          <AnimateStaggerItem>
          <a
            href={EMAIL_LINK}
            className="flex items-center gap-4 rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md transition hover:border-herb-gold/50 hover:bg-herb-surface/80"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-herb-gold/20 text-herb-gold">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-stone-100">Email</h3>
              <p className="text-sm text-stone-500">admin@duniaherbs.com.my</p>
            </div>
          </a>
          </AnimateStaggerItem>
          <AnimateStaggerItem>
          <Link
            href="/faq"
            className="flex items-center gap-4 rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md transition hover:border-herb-gold/30 hover:bg-herb-surface/80"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-herb-sage/20 text-herb-sage">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-stone-100">FAQ</h3>
              <p className="text-sm text-stone-500">Soalan lazim</p>
            </div>
          </Link>
          </AnimateStaggerItem>
          <AnimateStaggerItem>
          <div className="flex items-center gap-4 rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-herb-accent/20 text-herb-accent">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-stone-100">ChatBot</h3>
              <p className="text-sm text-stone-500">Klik ikon chat di bawah</p>
            </div>
          </div>
          </AnimateStaggerItem>
        </AnimateStagger>

        {/* FAQ preview */}
        <AnimateIn>
        <div className="mt-12 rounded-2xl border border-blue-950/30 bg-herb-surface/50 p-6 md:p-8 backdrop-blur-sm">
          <h3 className="font-semibold text-stone-200 mb-4">{content.faq_preview_title || 'Soalan lazim'}</h3>
          <div className="space-y-4">
            {faqPreview.map((f, i) => (
              <div key={i} className="border-b border-blue-950/40 pb-4 last:border-0 last:pb-0">
                <p className="font-medium text-stone-300 text-sm">{f.q}</p>
                <p className="text-stone-500 text-sm mt-1">{f.a}</p>
              </div>
            ))}
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 mt-4 text-herb-gold text-sm font-medium hover:underline"
          >
            {content.faq_link_text || 'Lihat semua FAQ'}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        </AnimateIn>
      </section>

      {/* Footer - safe area for PWA */}
      <AnimateIn>
      <footer
        className="border-t border-blue-950/30 px-6 py-12"
        style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom, 24px))' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            {/* Brand */}
            <div className="md:max-w-xs">
              <p className="font-serif font-bold text-herb-gold text-xl">Dunia Herbs</p>
              <p className="text-stone-500 text-sm mt-2 leading-relaxed">{content.footer_brand_desc || 'Memang Mustajab — Perintis lotion pati halia di Malaysia sejak 2005. KKM & Halal JAKIM.'}</p>
            </div>

            {/* Pautan */}
            <div>
              <p className="text-stone-400 text-xs font-medium tracking-widest uppercase mb-3">Pautan</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/tentang" className="text-stone-500 hover:text-herb-gold transition">Tentang</Link>
                <Link href="/#produk" className="text-stone-500 hover:text-herb-gold transition">Produk</Link>
                <Link href="/fasha" className="text-stone-500 hover:text-herb-gold transition">Fasha Sandha</Link>
                <Link href="/stockist" className="text-stone-500 hover:text-herb-gold transition">Stockist</Link>
                <Link href="/faq" className="text-stone-500 hover:text-herb-gold transition">FAQ</Link>
                <Link href="/bersalin" className="text-stone-500 hover:text-herb-gold transition">Selepas Bersalin</Link>
                <Link href="/seisi-keluarga" className="text-stone-500 hover:text-herb-gold transition">Seisi Keluarga</Link>
                <Link href="/bentuk-badan" className="text-stone-500 hover:text-herb-gold transition">Bentuk Badan Ideal</Link>
                <Link href="/produk-minuman" className="text-stone-500 hover:text-herb-gold transition">Produk Minuman</Link>
                <Link href="/info" className="text-stone-500 hover:text-herb-gold transition">Info AM</Link>
                <Link href="/polisi" className="text-stone-500 hover:text-herb-gold transition">Polisi</Link>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-stone-400 text-xs font-medium tracking-widest uppercase mb-3">Ikuti Kami</p>
              <div className="flex gap-3">
                {content.facebook && (
                <a href={content.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-950/40 bg-herb-surface/60 text-[#1877F2] transition hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 hover:scale-110" aria-label="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                )}
                {content.instagram && (
                <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-950/40 bg-herb-surface/60 text-[#E4405F] transition hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10 hover:scale-110" aria-label="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                )}
                {content.tiktok && (
                <a href={content.tiktok} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-950/40 bg-herb-surface/60 text-stone-100 transition hover:border-stone-100/50 hover:bg-stone-100/10 hover:scale-110" aria-label="TikTok">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.81-.07 4.83 4.83 0 01-2.38-1.1V6.69h4z"/></svg>
                </a>
                )}
                <a href={EMAIL_LINK} className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-950/40 bg-herb-surface/60 text-herb-gold transition hover:border-herb-gold/50 hover:bg-herb-gold/10 hover:scale-110" aria-label="Email">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </a>
              </div>

              {/* Marketplace */}
              <p className="text-stone-400 text-xs font-medium tracking-widest uppercase mt-6 mb-3">Beli Di</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <a href="https://shopee.com.my/search?keyword=dunia%20herbs%20losyen%20mustajab" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-blue-950/40 bg-herb-surface/60 px-3 py-1.5 text-[#EE4D2D] transition hover:border-[#EE4D2D]/50 hover:bg-[#EE4D2D]/10 text-xs font-medium">Shopee</a>
                <a href="https://www.lazada.com.my/tag/dunia-herb-losyen-mustajab/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-blue-950/40 bg-herb-surface/60 px-3 py-1.5 text-[#0F146D] transition hover:border-[#F57224]/50 hover:bg-[#F57224]/10 hover:text-[#F57224] text-xs font-medium">Lazada</a>
                <a href="https://www.tiktok.com/@duniaherbsofficial" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-blue-950/40 bg-herb-surface/60 px-3 py-1.5 text-stone-100 transition hover:border-stone-100/50 hover:bg-stone-100/10 text-xs font-medium">TikTok Shop</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-blue-950/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-600 text-xs">
              {(content.footer_copyright || '© {year} Dunia Herbs. Hak cipta terpelihara.').replace('{year}', String(new Date().getFullYear()))}
            </p>
            <p className="text-stone-700 text-xs">
              {content.footer_website || 'www.duniaherbs.com.my'}
            </p>
          </div>
        </div>
      </footer>
      </AnimateIn>
    </div>
  );
}
