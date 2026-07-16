import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderConfirmation } from '@/components/OrderConfirmation';

export const metadata: Metadata = { title: 'Order Confirmed', robots: { index: false, follow: false } };

export default function OrderConfirmedPage() {
  return <Suspense fallback={<section className="order-confirmed-page"><p>Confirming your order…</p></section>}><OrderConfirmation /></Suspense>;
}
