import Link from 'next/link';
import { env } from '@/lib/env';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">م</span>
            <span><strong>MATKA CHAI</strong><small>Original Chai Room · Creek Walk</small></span>
          </div>
          <p>Slow-brewed chai, satisfying desi food and conversations that stay longer than the cup.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/menu">Menu</Link>
          <Link href="/story">Our Story</Link>
          <Link href="/franchise">Franchise</Link>
        </div>
        <div>
          <h3>Visit</h3>
          <p>Creek Walk, DHA Phase 8<br />Karachi, Pakistan</p>
          <a href={env.mapsUrl} target="_blank" rel="noreferrer">Open Google Maps</a>
        </div>
        <div>
          <h3>Contact</h3>
          <a href={`https://wa.me/${env.whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp us</a>
          <a href="mailto:hello@matkachai.pk">hello@matkachai.pk</a>
          <Link href="/admin/login" className="subtle-admin">Owner login</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Matka Chai. All rights reserved.</span>
        <span>Desi chai · Real food · Good company</span>
      </div>
    </footer>
  );
}
