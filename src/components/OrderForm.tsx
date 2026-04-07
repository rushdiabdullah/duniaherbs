'use client';

import { useState } from 'react';

type Props = {
  productId: string;
  productName: string;
  price: string;
};

export default function OrderForm({ productId, productName, price }: Props) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
  const total = (priceNum * qty).toFixed(2);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Sila isi nama dan nombor telefon.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          price: priceNum,
          quantity: qty,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim().replace(/\D/g, ''),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal cipta pembayaran');

      window.location.href = data.paymentUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ralat berlaku');
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-herb-gold px-6 py-3 text-sm font-semibold text-herb-dark transition hover:bg-herb-gold/90 shadow-lg shadow-herb-gold/20"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        Beli Sekarang
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => !loading && setOpen(false)}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-stone-700 bg-herb-dark p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-stone-100">Buat Pesanan</h2>
          <button type="button" onClick={() => setOpen(false)} className="text-stone-500 hover:text-stone-300 transition">&times;</button>
        </div>

        <div className="rounded-xl border border-stone-700 bg-herb-surface/60 p-4 mb-5">
          <p className="text-stone-200 font-medium text-sm">{productName}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-herb-gold font-semibold">{price}</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="h-7 w-7 rounded-lg border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition flex items-center justify-center text-lg">-</button>
              <span className="text-stone-200 w-8 text-center font-mono">{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} className="h-7 w-7 rounded-lg border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition flex items-center justify-center text-lg">+</button>
            </div>
          </div>
          {qty > 1 && <p className="text-stone-500 text-xs mt-2 text-right">Jumlah: RM {total}</p>}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-stone-400 mb-1">Nama Penuh *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ahmad bin Abu" className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">No. Telefon *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="0123456789" className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Email (pilihan)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="[email protected]" className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
          </div>
        </div>

        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-herb-gold px-4 py-3 text-sm font-semibold text-herb-dark hover:bg-herb-gold/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Memproses...
            </>
          ) : (
            `Bayar RM ${total}`
          )}
        </button>

        <div className="mt-3 flex items-center justify-center gap-3 text-stone-600 text-[10px]">
          <span>FPX</span>
          <span>•</span>
          <span>Credit Card</span>
          <span>•</span>
          <span>DuitNow QR</span>
        </div>
        <p className="text-center text-stone-600 text-[10px] mt-1">Pembayaran selamat melalui ToyyibPay</p>
      </form>
    </div>
  );
}
