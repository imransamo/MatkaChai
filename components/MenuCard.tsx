import type { MenuItem } from '@/lib/types';

export function MenuCard({ item, featured = false }: { item: MenuItem; featured?: boolean }) {
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
      </div>
    </article>
  );
}
