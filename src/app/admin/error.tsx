'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-herb-dark">
      <h1 className="font-serif text-xl font-bold text-stone-100 mb-2">Ralat Admin</h1>
      <p className="text-stone-500 text-sm text-center mb-6 max-w-md">
        {error.message}
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-xl bg-herb-gold px-4 py-2 text-sm font-semibold text-herb-dark"
        >
          Cuba Lagi
        </button>
        <Link
          href="/admin/login"
          className="rounded-xl border border-stone-600 px-4 py-2 text-sm text-stone-300 hover:bg-stone-800"
        >
          Ke Login
        </Link>
      </div>
    </div>
  );
}
