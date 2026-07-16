import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { CartProvider } from '@/components/CartProvider';
import { ChatWidget } from '@/components/ChatWidget';
import { env } from '@/lib/env';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  applicationName: 'Matka Chai',
  title: { default: 'Matka Chai Karachi | Chai, Lamb Rosh & Matka Biryani', template: '%s | Matka Chai Karachi' },
  description: 'Visit Matka Chai at Creek Walk, DHA Phase 8 Karachi for slow-brewed matka chai, lamb rosh, biryani, paratha pairings, fries, coffee and art-matka coolers.',
  keywords: ['Matka Chai Karachi', 'best chai in Karachi', 'best lamb rosh Karachi', 'best biryani in Karachi', 'best paratha Karachi', 'chai DHA Phase 8', 'Creek Walk Karachi', 'matka biryani', 'Kashmiri chai Karachi', 'Pakistani restaurant DHA Karachi'],
  authors: [{ name: 'Matka Chai', url: env.siteUrl }],
  creator: 'Matka Chai',
  publisher: 'Matka Chai',
  category: 'Food and drink',
  icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/icon.svg' },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Matka Chai Karachi — Chai, Lamb Rosh & Matka Biryani',
    description: 'Slow-brewed chai and comforting Pakistani food at Creek Walk, DHA Phase 8, Karachi.',
    url: env.siteUrl,
    siteName: 'Matka Chai',
    images: [{ url: '/images/hero-realistic.png', width: 1024, height: 1024, alt: 'Steaming Matka Chai served in a handcrafted clay matka in Karachi' }],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matka Chai Karachi',
    description: 'Slow-brewed matka chai, lamb rosh, biryani and Pakistani comfort food at Creek Walk DHA 8.',
    images: ['/images/hero-realistic.png'],
  },
  formatDetection: { telephone: true, address: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined,
  },
  other: { 'geo.region': 'PK-SD', 'geo.placename': 'Karachi' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
