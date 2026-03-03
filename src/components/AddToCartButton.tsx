'use client';

import { useCart } from '@/lib/cart';
import { useState } from 'react';

type Props = {
  productId: string;
  productName: string;
  price: string;
  image?: string;
};

export default function AddToCartButton({ productId, productName, price, image }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));

  function handleAdd() {
    addItem({ id: productId, name: productName, price, priceNum, image }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition shadow-lg ${
        added
          ? 'bg-green-600 text-white shadow-green-600/20'
          : 'bg-herb-gold text-herb-dark hover:bg-herb-gold/90 shadow-herb-gold/20'
      }`}
    >
      {added ? (
        <>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Ditambah!
        </>
      ) : (
        <>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          Tambah ke Cart
        </>
      )}
    </button>
  );
}
