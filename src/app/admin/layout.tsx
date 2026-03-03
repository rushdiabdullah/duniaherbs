import type { ReactNode } from 'react';

export const metadata = { title: 'Admin — Dunia Herbs' };
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-herb-dark">
      {children}
    </div>
  );
}
