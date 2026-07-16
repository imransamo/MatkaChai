import type { Metadata } from 'next';
import { MenuCard } from '@/components/MenuCard';
import { env } from '@/lib/env';
import { getMenu } from '@/lib/menu';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore Matka Chai Karachi’s complete menu: matka chai, Kashmiri chai, lamb rosh, biryani, handi, fries, coffee and art-matka coolers at Creek Walk DHA 8.',
  alternates: { canonical: '/menu' },
  openGraph: { url: '/menu', title: 'Matka Chai Karachi Menu', description: 'Chai, lamb rosh, biryani, Pakistani comfort food and art-matka coolers in DHA Phase 8 Karachi.' },
};

export default async function MenuPage() {
  const menu = await getMenu();
  const menuSchema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${env.siteUrl}/menu#menu`,
    name: 'Matka Chai Karachi Menu',
    url: `${env.siteUrl}/menu`,
    hasMenuSection: menu.map((category) => ({
      '@type': 'MenuSection',
      name: category.name,
      description: category.description,
      hasMenuItem: category.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        image: item.image_url ? `${env.siteUrl}${item.image_url}` : undefined,
        offers: { '@type': 'Offer', price: item.price, priceCurrency: 'PKR', availability: 'https://schema.org/InStock' },
      })),
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }} />
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
