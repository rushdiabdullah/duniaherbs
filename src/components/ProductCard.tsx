import Image from 'next/image';
import Link from 'next/link';
import { getHeatLabel } from '@/lib/heat';

export type ProductCardProduct = {
  id: string;
  name: string;
  tagline?: string;
  price: string;
  badge?: string;
  heat?: string;
  image_url?: string;
  originalPrice?: string;
  discountLabel?: string;
};

const PRODUCT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop';

const heatColors: Record<string, string> = {
  Mild: 'bg-herb-sage/20 text-herb-sage',
  Hot: 'bg-orange-500/20 text-orange-400',
  Extreme: 'bg-red-500/20 text-red-400',
};

/**
 * Product card — sama info & styling seperti homepage.
 * Sentiasa link ke /produk/[id] (halaman produk sebelum checkout).
 */
export function ProductCard({ product }: { product: ProductCardProduct }) {
  return (
    <Link href={`/produk/${product.id}`} className="group block">
      <article className="h-full rounded-2xl border border-herb-moss/40 bg-herb-surface/80 overflow-hidden transition-all duration-300 hover:border-herb-gold/30 hover:shadow-xl hover:shadow-herb-gold/5">
        <div className="relative aspect-square bg-herb-card overflow-hidden">
          <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
            <Image
              src={product.image_url || PRODUCT_IMAGE_FALLBACK}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized={Boolean(product.image_url)}
            />
          </div>
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-lg bg-herb-gold/90 px-2.5 py-1 text-xs font-medium text-herb-dark">
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-stone-100 group-hover:text-herb-gold transition">{product.name}</h3>
          {product.tagline && <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{product.tagline}</p>}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              {product.originalPrice && product.discountLabel ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-stone-500 line-through text-xs">{product.originalPrice}</span>
                  <span className="text-herb-gold font-medium">{product.price}</span>
                  <span className="rounded-full bg-green-900/40 px-1.5 py-0.5 text-[10px] text-green-400">{product.discountLabel}</span>
                </div>
              ) : (
                <p className="text-herb-gold font-medium">{product.price}</p>
              )}
            </div>
            {product.heat && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium flex-shrink-0 ${heatColors[product.heat] || heatColors.Mild}`}>
                {getHeatLabel(product.heat)}
              </span>
            )}
          </div>
          <span className="inline-block mt-2 text-xs text-herb-gold/80 group-hover:text-herb-gold transition">
            Lihat detail & beli →
          </span>
        </div>
      </article>
    </Link>
  );
}
