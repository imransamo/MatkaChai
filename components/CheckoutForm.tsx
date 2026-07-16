'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useCart } from '@/components/CartProvider';

const phases = ['DHA Phase 4', 'DHA Phase 5', 'DHA Phase 6', 'DHA Phase 8'];

export function CheckoutForm() {
  const { items, subtotal, hydrated, clearCart } = useCart();
  const [fulfilment, setFulfilment] = useState<'delivery' | 'pickup'>('delivery');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = subtotal + (fulfilment === 'delivery' ? 150 : 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.get('customer_name'),
          phone: form.get('phone'),
          fulfilment_type: fulfilment,
          delivery_phase: fulfilment === 'delivery' ? form.get('delivery_phase') : undefined,
          delivery_address: fulfilment === 'delivery' ? form.get('delivery_address') : undefined,
          notes: form.get('notes'),
          website: form.get('website'),
          source: searchParams.get('source') === 'chat' ? 'chat' : 'website',
          items: items.map((item) => ({ item_id: item.id, quantity: item.quantity })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'We could not place the order.');
      clearCart();
      router.push(`/order-confirmed?order=${encodeURIComponent(data.order_number)}&total=${encodeURIComponent(data.total)}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'We could not place the order.');
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <section className="section checkout-empty">
        <div className="container cart-empty">
          <h1>Your cart is empty.</h1>
          <p>Choose your Matka Chai favourites before checking out.</p>
          <Link href="/menu" className="button button-maroon">View menu</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container page-hero-content">
          <span className="eyebrow light">Secure order confirmation</span>
          <h1>Checkout</h1>
          <p>Delivery in DHA Phases 4, 5, 6 and 8, or pickup from Creek Walk.</p>
        </div>
      </section>
      <section className="section checkout-page">
        <form className="container checkout-layout" onSubmit={submit}>
          <div className="checkout-form-card">
            <span className="eyebrow">1 · How would you like it?</span>
            <div className="fulfilment-toggle">
              <label className={fulfilment === 'delivery' ? 'selected' : ''}>
                <input type="radio" name="fulfilment" value="delivery" checked={fulfilment === 'delivery'} onChange={() => setFulfilment('delivery')} />
                <strong>Delivery</strong><small>30–60 minutes after confirmation · Rs 150</small>
              </label>
              <label className={fulfilment === 'pickup' ? 'selected' : ''}>
                <input type="radio" name="fulfilment" value="pickup" checked={fulfilment === 'pickup'} onChange={() => setFulfilment('pickup')} />
                <strong>Pickup</strong><small>Creek Walk, DHA Phase 8 · No fee</small>
              </label>
            </div>

            <span className="eyebrow checkout-step">2 · Your details</span>
            <div className="form-grid">
              <label>Full name<input name="customer_name" autoComplete="name" required maxLength={80} /></label>
              <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="03xx xxxxxxx" required maxLength={30} /></label>
            </div>
            {fulfilment === 'delivery' ? (
              <>
                <label>Delivery area<select name="delivery_phase" required defaultValue="DHA Phase 8">{phases.map((phase) => <option key={phase}>{phase}</option>)}</select></label>
                <label>Complete delivery address<textarea name="delivery_address" rows={3} autoComplete="street-address" required maxLength={300} placeholder="House/building, street, phase and nearest landmark" /></label>
              </>
            ) : (
              <div className="pickup-note"><strong>Pickup point</strong><span>Matka Chai, Creek Walk, DHA Phase 8, Karachi</span></div>
            )}
            <label>Order notes <small>(optional)</small><textarea name="notes" rows={3} maxLength={500} placeholder="Spice preference or any helpful instructions" /></label>
            <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>

            <span className="eyebrow checkout-step">3 · Payment</span>
            <div className="payment-option selected"><span aria-hidden="true">✓</span><div><strong>Cash</strong><small>Pay when your order is delivered or collected.</small></div></div>
            {error ? <p className="form-message error" role="alert">{error}</p> : null}
          </div>

          <aside className="order-summary checkout-summary">
            <span className="eyebrow">Your order</span>
            <div className="checkout-lines">{items.map((item) => <div key={item.id}><span>{item.quantity} × {item.name}</span><strong>Rs {(item.quantity * item.price).toLocaleString('en-PK')}</strong></div>)}</div>
            <div><span>Subtotal</span><strong>Rs {subtotal.toLocaleString('en-PK')}</strong></div>
            <div><span>{fulfilment === 'delivery' ? 'Delivery' : 'Pickup'}</span><strong>Rs {fulfilment === 'delivery' ? '150' : '0'}</strong></div>
            <div className="summary-total"><span>Total</span><strong>Rs {total.toLocaleString('en-PK')}</strong></div>
            <button className="button button-gold" disabled={submitting || !hydrated}>{submitting ? 'Placing your order…' : 'Place order'}</button>
            <small>By placing the order, you confirm that the phone and delivery details are correct.</small>
            <Link href="/cart" className="text-link">← Back to cart</Link>
          </aside>
        </form>
      </section>
    </>
  );
}
