import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { CartProvider } from '@/components/CartProvider';
import { ChatWidget } from '@/components/ChatWidget';
import { env } from '@/lib/env';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: 'Matka Chai | Pakistan’s Contemporary Chai Room', template: '%s | Matka Chai' },
  description: 'Matka Chai at Creek Walk, DHA 8 Karachi — slow-brewed chai, matka biryani, rosh, fries, coffee and coolers. Explore our menu and franchise opportunity.',
  keywords: ['Matka Chai', 'chai Karachi', 'Creek Walk DHA 8', 'chai room', 'matka biryani', 'franchise Pakistan'],
  openGraph: {
    title: 'Matka Chai — Pakistan’s Contemporary Chai Room',
    description: 'Desi chai. Real food. Good company. Visit the original Matka Chai room at Creek Walk, DHA 8, Karachi.',
    url: env.siteUrl,
    siteName: 'Matka Chai',
    images: [{ url: '/images/hero.svg', width: 1600, height: 1100, alt: 'Matka Chai original chai room' }],
    locale: 'en_PK',
    type: 'website',
  },
  robots: { index: true, follow: true },
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
