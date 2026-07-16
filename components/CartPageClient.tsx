'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export function CartPageClient() {
  const { items, hydrated, subtotal, removeItem, setQuantity } = useCart();

  return (
    <>
      <section className="page-hero compact-hero">
        <div className="container page-hero-content">
          <span className="eyebrow light">Your Matka Chai order</span>
          <h1>Your Cart</h1>
          <p>Review your favourites, then choose delivery or pickup.</p>
        </div>
      </section>
      <section className="section parchment-section cart-page">
        <div className="container cart-layout">
          <div className="cart-items">
            {!hydrated ? <p className="cart-empty">Loading your cart…</p> : null}
            {hydrated && items.length === 0 ? (
              <div className="cart-empty">
                <span className="empty-matka" aria-hidden="true">م</span>
                <h2>Your cart is ready for something delicious.</h2>
                <p>Add chai, a cooler, fries or a complete matka meal.</p>
                <Link href="/menu" className="button button-maroon">Explore the menu</Link>
              </div>
            ) : null}
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                {item.image_url ? <img src={item.image_url} alt="" /> : <span className="cart-item-placeholder">م</span>}
                <div className="cart-item-copy">
                  <h2>{item.name}</h2>
                  <strong>Rs {item.price.toLocaleString('en-PK')}</strong>
                  <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
                <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                  <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                </div>
                <strong className="cart-line-total">Rs {(item.price * item.quantity).toLocaleString('en-PK')}</strong>
              </article>
            ))}
          </div>
          {items.length > 0 ? (
            <aside className="order-summary">
              <span className="eyebrow">Order summary</span>
              <div><span>Subtotal</span><strong>Rs {subtotal.toLocaleString('en-PK')}</strong></div>
              <div><span>Delivery</span><small>Rs 150 in DHA Phases 4, 5, 6 &amp; 8<br />Free pickup from Creek Walk</small></div>
              <div className="summary-total"><span>Total before delivery</span><strong>Rs {subtotal.toLocaleString('en-PK')}</strong></div>
              <Link href="/checkout" className="button button-gold">Proceed to checkout</Link>
              <Link href="/menu" className="text-link">Add more items</Link>
            </aside>
          ) : null}
        </div>
      </section>
    </>
  );
}
