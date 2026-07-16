import Image from 'next/image';
import Link from 'next/link';
import { MenuCard } from '@/components/MenuCard';
import { SectionTitle } from '@/components/SectionTitle';
import { env } from '@/lib/env';
import { getSignatureItems } from '@/lib/menu';

export default async function HomePage() {
  const signatureItems = await getSignatureItems();
  const whatsappOrder = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum, I would like to order from Matka Chai.')}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'Matka Chai',
    image: `${env.siteUrl}/images/hero-realistic.png`,
    url: env.siteUrl,
    servesCuisine: ['Pakistani', 'Chai', 'Biryani'],
    priceRange: 'PKR 250-1800',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Creek Walk, DHA Phase 8',
      addressLocality: 'Karachi',
      addressCountry: 'PK',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="hero">
        <Image className="hero-background" src="/images/hero-matka-photo.png" alt="Steaming Matka Chai in a traditional handmade terracotta matka" fill priority sizes="100vw" />
        <div className="hero-overlay" />
        <div className="container hero-layout">
          <div className="hero-content">
            <span className="hero-kicker">Original Chai Room · Creek Walk, DHA 8</span>
            <p className="urdu-brand" lang="ur" dir="rtl">مٹکا چائے</p>
            <h1>Pakistan&apos;s <span className="hero-green">Contemporary</span> <em>Chai Room</em></h1>
            <p>Slow-brewed chai, comforting desi food and conversations that stay longer than the cup.</p>
            <div className="hero-actions">
              <Link href="/menu" className="button button-gold">Explore the Menu</Link>
              <a href={env.mapsUrl} target="_blank" rel="noreferrer" className="button button-light">Get Directions</a>
            </div>
          </div>
        </div>
        <div className="hero-note">Desi chai · Real food · Good company</div>
      </section>

      <section className="section intro-strip">
        <div className="container stats-grid">
          <div><strong>01</strong><span>Original location</span></div>
          <div><strong>06</strong><span>Signature chai choices</span></div>
          <div><strong>18+</strong><span>Comforting food favourites</span></div>
          <div><strong>∞</strong><span>Conversations over chai</span></div>
        </div>
      </section>

      <section className="section parchment-section">
        <div className="container">
          <SectionTitle eyebrow="The Matka Favourites" title="Come for the chai. Stay for the food." text="A concise selection of the dishes and drinks that define the Matka Chai experience." center />
          <div className="signature-grid">
            {signatureItems.map((item) => <MenuCard key={item.id} item={item} featured />)}
          </div>
          <div className="center-actions"><Link href="/menu" className="text-link">See the complete menu <span>→</span></Link></div>
        </div>
      </section>

      <section className="section split-section">
        <div className="container split-grid">
          <div className="split-image ornate-frame"><Image src="/images/room.svg" alt="Warm contemporary Pakistani chai room" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
          <div className="split-copy">
            <SectionTitle eyebrow="More Than a Tea Stall" title="A room built around Pakistani hospitality." />
            <p>Matka Chai brings the warmth of traditional chai culture into a contemporary social setting. Earthen matkas, bold desi flavours, relaxed evenings and familiar hospitality come together in one memorable experience.</p>
            <p>Creek Walk is where our story begins. The vision is larger: a distinctive Pakistani chai-room brand that can welcome guests across cities.</p>
            <Link href="/story" className="button button-maroon">Discover Our Story</Link>
          </div>
        </div>
      </section>

      <section className="section evening-band">
        <div className="container evening-grid">
          <div>
            <span className="eyebrow light">Tonight at Creek Walk</span>
            <h2>Your evening deserves a proper cup of chai.</h2>
            <p>Bring the family, meet friends or take a pause after a long Karachi day.</p>
          </div>
          <div className="evening-actions">
            <a href={whatsappOrder} target="_blank" rel="noreferrer" className="button button-gold">Order on WhatsApp</a>
            <Link href="/visit" className="button button-outline-light">Plan Your Visit</Link>
          </div>
        </div>
      </section>

      <section className="section franchise-preview">
        <div className="container franchise-card">
          <div>
            <span className="eyebrow">Grow With Matka Chai</span>
            <h2>Bring the contemporary chai-room experience to your city.</h2>
            <p>We are developing a scalable franchise model built around distinctive branding, authentic products and disciplined operations.</p>
          </div>
          <Link href="/franchise" className="button button-gold">Register Interest</Link>
        </div>
      </section>
    </>
  );
}
