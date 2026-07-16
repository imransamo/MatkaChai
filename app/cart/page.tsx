import type { Metadata } from 'next';
import { CartPageClient } from '@/components/CartPageClient';

export const metadata: Metadata = { title: 'Your Cart', description: 'Review your Matka Chai order before checkout.' };

export default function CartPage() {
  return <CartPageClient />;
}
