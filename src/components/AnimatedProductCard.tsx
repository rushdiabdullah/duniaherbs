'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  badge?: string;
  heat?: string;
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

export function AnimatedProductCard({ product }: { product: Product }) {
  const reduceMotion = useReducedMotion();
  return (
    <Link href={`/produk/${product.id}`}>
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={reduceMotion ? undefined : { y: -6, transition: { duration: 0.2 } }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group rounded-2xl border border-blue-950/40 bg-herb-surface/80 overflow-hidden transition hover:border-herb-gold/30 hover:shadow-xl hover:shadow-herb-gold/5"
    >
      <div className="relative aspect-square bg-herb-card overflow-hidden">
        <motion.div
          className="relative w-full h-full"
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={productImages[product.id] || productImages['1']}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
        </motion.div>
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-lg bg-herb-gold/90 px-2.5 py-1 text-xs font-medium text-herb-dark">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-100">{product.name}</h3>
        <p className="text-xs text-stone-500 mt-0.5">{product.tagline}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-herb-gold font-medium">{product.price}</p>
          {product.heat && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${heatColors[product.heat] || heatColors.Mild}`}>
              {product.heat}
            </span>
          )}
        </div>
      </div>
    </motion.article>
    </Link>
  );
}
