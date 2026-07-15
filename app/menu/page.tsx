import type { Metadata } from 'next';
import { MenuCard } from '@/components/MenuCard';
import { getMenu } from '@/lib/menu';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore Matka Chai’s menu of chai, coffee, coolers, fries, matka biryani, handi and rosh at Creek Walk DHA 8 Karachi.',
};

export default async function MenuPage() {
  const menu = await getMenu();
  return (
    <>
      <section className="page-hero menu-hero">
        <div className="container page-hero-content">
          <span className="eyebrow light">Creek Walk · DHA 8</span>
          <h1>Our Menu</h1>
          <p>Slow-brewed chai, refreshing coolers and satisfying desi comfort food.</p>
        </div>
      </section>
      <div className="category-nav-wrap">
        <nav className="container category-nav" aria-label="Menu categories">
          {menu.map((category) => <a key={category.id} href={`#${category.slug}`}>{category.name}</a>)}
        </nav>
      </div>
      <section className="section parchment-section menu-page">
        <div className="container">
          {menu.map((category) => (
            <section key={category.id} id={category.slug} className="menu-category">
              <div className="category-heading">
                <span className="truck-dot" />
                <div><h2>{category.name}</h2>{category.description ? <p>{category.description}</p> : null}</div>
              </div>
              <div className="menu-list-grid">
                {category.items.map((item) => <MenuCard key={item.id} item={item} />)}
              </div>
            </section>
          ))}
          <p className="menu-disclaimer">Prices are in Pakistani rupees and may be updated without prior notice. Availability can vary by day.</p>
        </div>
      </section>
    </>
  );
}
