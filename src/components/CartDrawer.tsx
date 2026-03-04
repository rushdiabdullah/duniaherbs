'use client';

import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const FALLBACK = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100&h=100&fit=crop';
const CUSTOMER_STORAGE_KEY = 'duniaherb_customer_details';

const MY_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
  'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
  'Terengganu', 'W.P. Kuala Lumpur', 'W.P. Putrajaya', 'W.P. Labuan',
];

type SavedCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
};

function loadSavedCustomer(): SavedCustomer | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedCustomer;
    return data && data.name && data.phone ? data : null;
  } catch {
    return null;
  }
}

function saveCustomer(data: SavedCustomer) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function clearSavedCustomer() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function CartDrawer() {
  const pathname = usePathname();
  const { items, count, total, updateQty, removeItem, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  if (pathname?.startsWith('/admin')) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [saveDetails, setSaveDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 'checkout') {
      const saved = loadSavedCustomer();
      if (saved) {
        setName(saved.name);
        setPhone(saved.phone);
        setEmail(saved.email || '');
        setAddress(saved.address);
        setCity(saved.city);
        setState(saved.state || '');
        setPostcode(saved.postcode || '');
        setSaveDetails(true);
      }
    }
  }, [step]);

  function handleOpen() {
    setOpen(true);
    setStep('cart');
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !state || !postcode.trim()) {
      setError('Sila isi semua maklumat yang bertanda *');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const itemNames = items.map((i) => `${i.name} x${i.qty}`).join(', ');
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: items.length === 1 ? items[0].id : null,
          productName: items.length === 1 ? items[0].name : `${items.length} produk`,
          price: total,
          quantity: 1,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim().replace(/\D/g, ''),
          shippingAddress: address.trim(),
          shippingCity: city.trim(),
          shippingState: state,
          shippingPostcode: postcode.trim(),
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.priceNum, qty: i.qty })),
          itemsSummary: itemNames,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal cipta pembayaran');

      if (saveDetails) {
        saveCustomer({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          state,
          postcode: postcode.trim(),
        });
      } else {
        clearSavedCustomer();
      }

      clearCart();
      window.location.href = data.paymentUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ralat berlaku');
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Cart Button — sudut atas kanan */}
      <button
        onClick={handleOpen}
        className="fixed z-40 h-14 w-14 rounded-full bg-herb-gold text-herb-dark shadow-lg shadow-herb-gold/30 flex items-center justify-center hover:bg-herb-gold/90 transition"
        style={{
          top: 'max(1.5rem, env(safe-area-inset-top, 24px))',
          right: 'max(1.5rem, env(safe-area-inset-right, 24px))',
        }}
        aria-label="Cart"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => !loading && setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-herb-dark border-l border-stone-800 flex flex-col h-full min-h-0 overflow-hidden animate-in slide-in-from-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
              <h2 className="font-serif text-lg font-bold text-stone-100">
                {step === 'cart' ? `Cart (${count})` : 'Checkout'}
              </h2>
              <button onClick={() => setOpen(false)} className="text-stone-500 hover:text-stone-300 text-xl transition">&times;</button>
            </div>

            {step === 'cart' ? (
              <>
                {/* Cart Items */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 py-4">
                  {items.length === 0 ? (
                    <div className="text-center py-16">
                      <svg className="h-16 w-16 mx-auto text-stone-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                      <p className="text-stone-500 text-sm">Cart kosong</p>
                      <p className="text-stone-600 text-xs mt-1">Tambah produk dari halaman produk</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 rounded-xl border border-stone-800 bg-herb-surface/40 p-3">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-stone-950">
                            <Image src={item.image || FALLBACK} alt={item.name} fill className="object-cover" sizes="64px" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-stone-200 text-sm font-medium truncate">{item.name}</p>
                            <p className="text-herb-gold text-xs mt-0.5">{item.price}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => updateQty(item.id, item.qty - 1)} className="h-6 w-6 rounded border border-stone-700 text-stone-400 hover:text-stone-200 text-xs flex items-center justify-center transition">-</button>
                                <span className="text-stone-200 text-xs w-6 text-center font-mono">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, item.qty + 1)} className="h-6 w-6 rounded border border-stone-700 text-stone-400 hover:text-stone-200 text-xs flex items-center justify-center transition">+</button>
                              </div>
                              <button onClick={() => removeItem(item.id)} className="text-stone-600 hover:text-red-400 text-[10px] transition">Buang</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Footer */}
                {items.length > 0 && (
                  <div className="border-t border-stone-800 px-5 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-sm">Jumlah</span>
                      <span className="text-herb-gold font-semibold text-lg">RM {total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setStep('checkout')}
                      className="w-full rounded-xl bg-herb-gold px-4 py-3 text-sm font-semibold text-herb-dark hover:bg-herb-gold/90 transition"
                    >
                      Teruskan ke Pembayaran
                    </button>
                    <button onClick={clearCart} className="w-full text-center text-stone-600 text-xs hover:text-red-400 transition">
                      Kosongkan Cart
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Checkout Form */
              <form onSubmit={handleCheckout} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 py-4 space-y-4">
                  {/* Order Summary */}
                  <div className="rounded-xl border border-stone-700 bg-herb-surface/40 p-4">
                    <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Ringkasan Pesanan</p>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-stone-300">{item.name} <span className="text-stone-500">x{item.qty}</span></span>
                        <span className="text-stone-300">RM {(item.priceNum * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 mt-2 border-t border-stone-800">
                      <span className="text-stone-200 font-medium">Jumlah</span>
                      <span className="text-herb-gold font-semibold">RM {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <p className="text-stone-300 text-xs uppercase tracking-wider mb-3">Maklumat Pembeli</p>
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Nama Penuh *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ahmad bin Abu" className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">No. Telefon *</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="0123456789" className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Email (pilihan)</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="[email protected]" className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <p className="text-stone-300 text-xs uppercase tracking-wider mb-3">Alamat Penghantaran</p>
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Alamat *</label>
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} required rows={2} placeholder="No. 12, Jalan Mawar 3, Taman Bunga" className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs text-stone-500 mb-1">Bandar *</label>
                          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Shah Alam" className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs text-stone-500 mb-1">Poskod *</label>
                          <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} required placeholder="40000" maxLength={5} className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:border-herb-gold/50 focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Negeri *</label>
                        <select value={state} onChange={(e) => setState(e.target.value)} required className="w-full rounded-lg border border-stone-700 bg-herb-surface px-3 py-2.5 text-stone-100 text-sm focus:border-herb-gold/50 focus:outline-none appearance-none">
                          <option value="" className="bg-herb-dark">Pilih negeri</option>
                          {MY_STATES.map((s) => <option key={s} value={s} className="bg-herb-dark">{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveDetails}
                      onChange={(e) => setSaveDetails(e.target.checked)}
                      className="rounded border-stone-600 bg-herb-surface text-herb-gold focus:ring-herb-gold/50"
                    />
                    <span className="text-stone-400 text-xs">Simpan maklumat untuk pembelian seterusnya</span>
                  </label>

                  {error && <p className="text-red-400 text-xs">{error}</p>}
                </div>

                {/* Checkout Footer */}
                <div className="border-t border-stone-800 px-5 py-4 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-herb-gold px-4 py-3 text-sm font-semibold text-herb-dark hover:bg-herb-gold/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Memproses...
                      </>
                    ) : (
                      `Bayar RM ${total.toFixed(2)}`
                    )}
                  </button>
                  <button type="button" onClick={() => setStep('cart')} className="w-full text-center text-stone-500 text-xs hover:text-stone-300 transition">
                    Kembali ke Cart
                  </button>
                  <div className="flex items-center justify-center gap-3 text-stone-600 text-[10px]">
                    <span>FPX</span><span>•</span><span>Credit Card</span><span>•</span><span>DuitNow QR</span>
                  </div>
                  <p className="text-center text-stone-600 text-[10px]">Pembayaran selamat melalui Billplz</p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
