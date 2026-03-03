'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentContent() {
  const params = useSearchParams();

  const billplzPaid = params.get('billplz[paid]');
  const statusId = params.get('status_id');

  const isSuccess = billplzPaid === 'true' || statusId === '1';
  const isPending = billplzPaid === null && statusId === '2';
  const isFailed = billplzPaid === 'false' || statusId === '3';

  const orderId = params.get('order_id') || params.get('billplz[id]') || '';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        {isSuccess && (
          <>
            <div className="mx-auto h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-50 mb-3">Pembayaran Berjaya!</h1>
            <p className="text-stone-400 mb-2">Terima kasih atas pembelian anda. Order anda sedang diproses.</p>
            {orderId && <p className="text-stone-500 text-sm">Ref: <span className="text-herb-gold font-mono">{orderId}</span></p>}
          </>
        )}

        {isPending && (
          <>
            <div className="mx-auto h-20 w-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-50 mb-3">Pembayaran Dalam Proses</h1>
            <p className="text-stone-400 mb-2">Pembayaran anda sedang diproses. Kami akan menghubungi anda setelah disahkan.</p>
          </>
        )}

        {isFailed && (
          <>
            <div className="mx-auto h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-50 mb-3">Pembayaran Gagal</h1>
            <p className="text-stone-400 mb-2">Pembayaran tidak berjaya. Sila cuba semula atau hubungi kami melalui email admin@duniaherbs.com.my.</p>
          </>
        )}

        {!isSuccess && !isPending && !isFailed && (
          <>
            <div className="mx-auto h-20 w-20 rounded-full bg-stone-700/30 flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-50 mb-3">Status Pembayaran</h1>
            <p className="text-stone-400">Tiada maklumat pembayaran ditemui.</p>
          </>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-5 py-3 text-sm font-semibold text-herb-gold hover:bg-herb-gold/30 transition">
            Kembali ke Laman Utama
          </Link>
          <Link href="/#produk" className="inline-flex items-center gap-2 rounded-xl border border-stone-700 px-5 py-3 text-sm text-stone-400 hover:text-herb-gold hover:border-herb-gold/50 transition">
            Lihat Produk Lain
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-stone-500">Memuatkan...</p></div>}>
      <PaymentContent />
    </Suspense>
  );
}
