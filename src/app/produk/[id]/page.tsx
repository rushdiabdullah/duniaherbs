import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts, getSiteContent, getActivePromotions } from '@/lib/data';
import { getHeatLabel } from '@/lib/heat';
import { applyPromotion, formatPrice } from '@/lib/promotions';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';

const PRODUCT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop';

const heatColors: Record<string, string> = {
  Mild: 'bg-herb-sage/20 text-herb-sage',
  Hot: 'bg-orange-500/20 text-orange-400',
  Extreme: 'bg-red-500/20 text-red-400',
};

const productsFallback: Record<string, { id: string; name: string; tagline: string; price: string; badge?: string; heat?: string; size: string; description: string; benefits: string[]; usage_info: string; image_url?: string }> = {
  '1': { id: '1', name: 'Lotion Mustajab Pati Halia', tagline: 'Multi-purpose • Sesuai ibu bersalin', price: 'RM 22.90', badge: 'Bestseller', heat: 'Mild', size: '130ml', description: 'Lotion Mustajab Pati Halia ialah produk perintis Dunia Herbs yang telah menjadi kegemaran ramai selama lebih 20 tahun.', benefits: ['Membantu melegakan ketidakselesaan sendi & otot', 'Sesuai untuk urutan postpartum', 'Kurangkan kembung perut', 'Mudah diserap, tidak berminyak'], usage_info: 'Sapu pada bahagian yang dikehendaki. Untuk luaran sahaja.' },
  '2': { id: '2', name: 'Lotion Mustajab Lime & Ginger', tagline: 'Pati halia + limau nipis', price: 'RM 22.90', heat: 'Mild', size: '130ml', description: 'Gabungan pati halia dan limau nipis untuk kesan yang menyegarkan.', benefits: ['Gabungan halia & limau nipis', 'Segar dan menyegarkan', 'Membantu melegakan ketidakselesaan sendi & otot'], usage_info: 'Sapu pada sendi, otot atau abdomen. Untuk luaran sahaja.' },
  '3': { id: '3', name: 'Lotion Mustajab Super Hot', tagline: 'Dengan capsicum • Untuk workout', price: 'RM 24.90', badge: 'Popular', heat: 'Hot', size: '130ml', description: 'Diformulasi khas dengan capsicum untuk tahap kehangatan yang lebih tinggi.', benefits: ['Capsicum untuk haba maksimum', 'Sesuai untuk workout & sukan', 'Bantu proses pembakaran lemak'], usage_info: 'Sapu sebelum atau selepas senaman. Untuk luaran sahaja.' },
  '4': { id: '4', name: 'Lotion Mustajab Extra Hot', tagline: 'Shaping • Extra halia', price: 'RM 23.90', heat: 'Hot', size: '130ml', description: 'Versi extra hot dengan kandungan halia yang lebih pekat.', benefits: ['Extra halia untuk kesan lebih kuat', 'Fokus shaping & pembakaran lemak', 'Kurangkan penampilan selulit'], usage_info: 'Sapu pada abdomen dan kawasan yang ingin dibentuk. Untuk luaran sahaja.' },
  '5': { id: '5', name: 'Lotion Mustajab Extreme Hot', tagline: 'Kepanasan maksimum • Untuk sukan lasak', price: 'RM 25.90', badge: 'Terbaru', heat: 'Extreme', size: '130ml', description: 'Tahap kehangatan paling tinggi dalam rangkaian Mustajab.', benefits: ['Kehangatan tahap maksimum', 'Untuk sukan lasak & atlet', 'Pembakaran lemak intensif'], usage_info: 'Sapu pada otot sebelum/selepas sukan lasak. Untuk luaran sahaja.' },
  '6': { id: '6', name: 'Lotion Mustajab Extra Ginger', tagline: 'Halia berganda • Kehidupan aktif', price: 'RM 23.90', heat: 'Hot', size: '130ml', description: 'Mengandungi halia berganda untuk mereka yang menjalani kehidupan aktif.', benefits: ['Halia berganda untuk kesan lebih', 'Sesuai untuk kehidupan aktif', 'Tidak berminyak, mudah diserap'], usage_info: 'Sapu pada sendi dan otot. Untuk luaran sahaja.' },
  '7': { id: '7', name: 'Lotion Mustajab Pati Halia 65ml', tagline: 'Saiz mini • Travel size', price: 'RM 14.90', badge: 'Jimat', heat: 'Mild', size: '65ml', description: 'Produk Pati Halia saiz mini 65ml. Limited — bukan semua jenis ada.', benefits: ['Saiz mini 65ml', 'Limited', 'Sesuai travel'], usage_info: 'Sapu pada sendi, otot atau abdomen. Untuk luaran sahaja.' },
  '8': { id: '8', name: 'Lotion Mustajab Super Hot 65ml', tagline: 'Saiz mini • Capsicum workout', price: 'RM 15.90', heat: 'Hot', size: '65ml', description: 'Versi Super Hot saiz mini 65ml. Limited.', benefits: ['Saiz mini 65ml', 'Limited', 'Capsicum untuk haba kuat'], usage_info: 'Sapu sebelum atau selepas senaman. Untuk luaran sahaja.' },
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  let product = await getProduct(id);
  if (!product) product = productsFallback[id];
  if (!product) return { title: 'Produk tidak dijumpai' };
  return {
    title: `${product.name} — Dunia Herbs`,
    description: product.description || product.tagline,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [productResult, content, promotions] = await Promise.all([getProduct(id), getSiteContent(), getActivePromotions()]);
  let product = productResult;
  if (!product) product = productsFallback[id];
  if (!product) notFound();

  const CONTACT_EMAIL = 'admin@duniaherbs.com.my';
  const emailLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Pertanyaan: ${product.name}`)}`;

  let allProducts = await getProducts();
  if (allProducts.length === 0) allProducts = Object.values(productsFallback);
  const related = allProducts.filter((p) => p.id !== product!.id).slice(0, 4);

  const benefits: string[] = product.benefits && Array.isArray(product.benefits) ? product.benefits : [];
  const usage = product.usage_info || '';
  const imageUrl = product.image_url || PRODUCT_IMAGE_FALLBACK;

  const priceNum = parseFloat((product.price || '0').replace(/[^0-9.]/g, ''));
  const { finalPrice, discount, appliedPromo } = applyPromotion(priceNum, product.id, promotions);
  const hasDiscount = appliedPromo && discount > 0;

  return (
    <div className="min-h-screen px-6 py-12 max-w-6xl mx-auto">
      <Link
        href="/#produk"
        className="inline-flex items-center gap-2 text-stone-500 text-sm hover:text-herb-gold transition mb-8"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Semua Produk
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-herb-gold/20 bg-herb-surface/60 backdrop-blur-md">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {product.badge && (
            <span className="absolute top-4 left-4 rounded-lg bg-herb-gold/90 px-3 py-1.5 text-xs font-medium text-herb-dark">
              {product.badge}
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            {product.heat && (
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${heatColors[product.heat] || ''}`}>
                {getHeatLabel(product.heat)}
              </span>
            )}
            <span className="text-stone-500 text-sm">{product.size}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-50">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-stone-500 line-through text-lg">{product.price}</span>
                <span className="text-herb-gold text-2xl font-semibold">{formatPrice(finalPrice)}</span>
                <span className="rounded-full bg-green-900/40 px-2.5 py-0.5 text-xs text-green-400">
                  {appliedPromo!.discount_type === 'percentage' ? `${appliedPromo!.discount_value}% off` : `RM ${appliedPromo!.discount_value} off`}
                </span>
              </>
            ) : (
              <p className="text-herb-gold text-2xl font-semibold">{product.price}</p>
            )}
          </div>
          <p className="text-stone-400 leading-relaxed mt-6">{product.description}</p>

          {/* Benefits */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-herb-gold/80 tracking-widest uppercase mb-3">Kebaikan</h3>
            <ul className="space-y-2">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-stone-300 text-sm">
                  <span className="text-herb-gold mt-0.5">✦</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Usage */}
          <div className="mt-8 rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-5 backdrop-blur-md">
            <h3 className="text-sm font-medium text-stone-200 mb-2">Cara guna</h3>
            <p className="text-stone-500 text-sm">{usage}</p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-4">
            <AddToCartButton productId={product.id} productName={product.name} price={product.price} image={imageUrl} />
            <a
              href={emailLink}
              className="inline-flex items-center gap-2 rounded-xl border border-herb-gold/50 px-6 py-3 text-sm font-medium text-herb-gold transition hover:bg-herb-gold/10 hover:border-herb-gold"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Kami
            </a>
          </div>

          {/* Trust */}
          <div className="mt-6 flex flex-wrap gap-4 text-stone-500 text-xs">
            <span className="flex items-center gap-1"><span className="text-herb-gold">✦</span> Halal JAKIM</span>
            <span className="flex items-center gap-1"><span className="text-herb-gold">✦</span> KKM</span>
            <span className="flex items-center gap-1"><span className="text-herb-gold">✦</span> Luaran sahaja</span>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-20">
        <h2 className="font-serif text-xl font-bold text-stone-50 mb-6">Produk Lain</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => (
            <Link key={p.id} href={`/produk/${p.id}`} className="group rounded-2xl border border-stone-700/50 bg-herb-surface/60 overflow-hidden backdrop-blur-md transition hover:border-herb-gold/30">
              <div className="relative aspect-square bg-herb-card overflow-hidden">
                <Image
                  src={p.image_url || PRODUCT_IMAGE_FALLBACK}
                  alt={p.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-100 text-sm">{p.name}</h3>
                <p className="text-herb-gold text-sm mt-1">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
