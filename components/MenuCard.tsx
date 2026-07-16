'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import type { MenuItem } from '@/lib/types';

export function MenuCard({ item, featured = false }: { item: MenuItem; featured?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className={`menu-card ${featured ? 'featured' : ''}`}>
      {item.image_url ? (
        <div className="menu-card-image"><img src={item.image_url} alt={item.name} loading={featured ? 'eager' : 'lazy'} /></div>
      ) : null}
      <div className="menu-card-body">
        <div className="menu-card-top">
          <h3>{item.name}</h3>
          <strong>Rs {item.price.toLocaleString('en-PK')}</strong>
        </div>
        {item.badge ? <span className="item-badge">{item.badge}</span> : null}
        {item.description ? <p>{item.description}</p> : null}
        <button type="button" className={`add-to-cart ${added ? 'added' : ''}`} onClick={handleAdd}>
          <span>{added ? 'Added to cart' : 'Add to cart'}</span>
          <span aria-hidden="true">{added ? '✓' : '+'}</span>
        </button>
      </div>
    </article>
  );
}
