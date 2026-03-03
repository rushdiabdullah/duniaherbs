import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart';

const ConditionalChatBot = dynamic(
  () => import('@/components/ConditionalChatBot'),
  { ssr: false }
);

const CartDrawer = dynamic(
  () => import('@/components/CartDrawer'),
  { ssr: false }
);

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.duniaherbs.com.my';

export const metadata: Metadata = {
  title: 'DuniaHerb — Beauty & Health',
  description: 'Herbs untuk kecantikan dan kesihatan. Produk semula jadi, telus dan halal.',
  manifest: '/manifest.json',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'ms_MY',
    url: siteUrl,
    siteName: 'DuniaHerb',
    title: 'DuniaHerb — Beauty & Health',
    description: 'Herbs untuk kecantikan dan kesihatan. Produk semula jadi, telus dan halal.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DuniaHerb' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DuniaHerb — Beauty & Health',
    description: 'Herbs untuk kecantikan dan kesihatan. Produk semula jadi, telus dan halal.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#060810',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // PWA: enable safe area insets for notch/home indicator
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ms" className="dark">
      <body className={`${playfair.variable} ${outfit.variable} font-sans min-h-screen bg-herb-dark`}>
        <CartProvider>
          {children}
          <CartDrawer />
          <ConditionalChatBot />
        </CartProvider>
      </body>
    </html>
  );
}
