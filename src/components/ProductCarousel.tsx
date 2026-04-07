'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getHeatLabel } from '@/lib/heat';

type Product = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  badge?: string;
  heat?: string;
  image_url?: string;
  originalPrice?: string;
  discountLabel?: string;
};

const productImages: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
  '2': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  '3': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  '4': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
  '5': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
  '6': 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?w=400&h=400&fit=crop',
  '7': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
  '8': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
};

const heatColors: Record<string, string> = {
  Mild: 'bg-herb-sage/20 text-herb-sage',
  Hot: 'bg-orange-500/20 text-orange-400',
  Extreme: 'bg-red-500/20 text-red-400',
};

const CARD_WIDTH = 280;
const CARD_GAP = 20;
const CENTER_SCALE = 1.08;
const SIDE_SCALE = 0.96;

export function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const updateCenterIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const containerCenter = scrollLeft + el.clientWidth / 2;
    const index = Math.round((containerCenter - CARD_WIDTH / 2 - CARD_GAP / 2) / (CARD_WIDTH + CARD_GAP));
    const clamped = Math.max(0, Math.min(index, products.length - 1));
    setCenterIndex(clamped);
  }, [products.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateCenterIndex();
    el.addEventListener('scroll', updateCenterIndex);
    window.addEventListener('resize', updateCenterIndex);
    return () => {
      el.removeEventListener('scroll', updateCenterIndex);
      window.removeEventListener('resize', updateCenterIndex);
    };
  }, [updateCenterIndex]);

  return (
    <div className="relative -mx-6 md:-mx-8">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto overflow-y-hidden px-6 md:px-8 py-4 pb-6 product-scroll"
        style={{
          scrollSnapType: 'x proximity',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {products.map((product, index) => {
          const imgKey = product.id in productImages ? product.id : String((index % 8) + 1);
          const isCenter = index === centerIndex;
          const scale = reduceMotion ? 1 : isCenter ? CENTER_SCALE : SIDE_SCALE;
          const zIndex = isCenter ? 10 : 1;

          return (
            <motion.div
              key={product.id}
              className="flex-shrink-0"
              style={{
                width: CARD_WIDTH,
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                zIndex,
              }}
              animate={{
                scale,
                transition: { duration: reduceMotion ? 0 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
            >
              <Link href={`/produk/${product.id}`}>
                <article
                  className={`group h-full rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isCenter
                      ? 'border-herb-gold/50 bg-herb-surface shadow-xl shadow-herb-gold/10'
                      : 'border-blue-950/40 bg-herb-surface/80 hover:border-herb-gold/30'
                  }`}
                >
                  <div className="relative aspect-square bg-herb-card overflow-hidden">
                    <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={(product as Product & { image_url?: string }).image_url || productImages[imgKey] || productImages['1']}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="280px"
                        unoptimized={Boolean((product as Product & { image_url?: string }).image_url)}
                      />
                    </div>
                    {product.badge && (
                      <span className="absolute top-3 left-3 rounded-lg bg-herb-gold/90 px-2.5 py-1 text-xs font-medium text-herb-dark">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-100">{product.name}</h3>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{product.tagline}</p>
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
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${heatColors[product.heat] || heatColors.Mild}`}>
                          {getHeatLabel(product.heat)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
