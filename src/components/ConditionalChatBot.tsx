'use client';

import { usePathname } from 'next/navigation';
import ChatBot from './ChatBot';

/**
 * Tunjukkan ChatBot di semua halaman KECUALI admin.
 */
export default function ConditionalChatBot() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <ChatBot />;
}
