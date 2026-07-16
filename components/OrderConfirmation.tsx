'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order') || 'Confirmed';
  const total = Number(searchParams.get('total') || 0);

  return (
    <section className="order-confirmed-page">
      <div className="order-confirmed-card">
        <span className="confirmation-mark" aria-hidden="true">✓</span>
        <span className="eyebrow">Shukriya — order received</span>
        <h1>Your Matka Chai order is in.</h1>
        <p>Our manager has received the order and will confirm it on your phone. Delivery orders normally arrive within 30–60 minutes after confirmation.</p>
        <div className="confirmation-number"><span>Order number</span><strong>{order}</strong></div>
        {total > 0 ? <div className="confirmation-number"><span>Cash total</span><strong>Rs {total.toLocaleString('en-PK')}</strong></div> : null}
        <div className="hero-actions">
          <Link href="/menu" className="button button-gold">Order something else</Link>
          <Link href="/" className="button button-maroon">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
