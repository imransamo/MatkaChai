import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutForm } from '@/components/CheckoutForm';

export const metadata: Metadata = { title: 'Checkout', description: 'Complete your Matka Chai delivery or pickup order.' };

export default function CheckoutPage() {
  return <Suspense fallback={<section className="section checkout-empty"><p>Loading checkout…</p></section>}><CheckoutForm /></Suspense>;
}
