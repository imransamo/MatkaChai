import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactForm } from '@/components/ContactForm';
import { SectionTitle } from '@/components/SectionTitle';
import { env } from '@/lib/env';

export const metadata: Metadata = { title: 'Visit Us', description: 'Visit Matka Chai at Creek Walk, DHA Phase 8, Karachi. Get directions, opening information and contact details.' };

export default function VisitPage() {
  const whatsapp = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum, I need information about visiting Matka Chai at Creek Walk.')}`;
  return (
    <>
      <section className="page-hero visit-hero"><div className="container page-hero-content"><span className="eyebrow light">The Original Chai Room</span><h1>Visit Matka Chai</h1><p>Creek Walk · DHA Phase 8 · Karachi</p></div></section>
      <section className="section parchment-section">
        <div className="container visit-grid">
          <div className="visit-image ornate-frame"><Image src="/images/room.svg" alt="Matka Chai Creek Walk atmosphere" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
          <div className="visit-details">
            <SectionTitle eyebrow="Plan Your Evening" title="Chai tastes better with company." />
            <div className="detail-row"><span>Location</span><strong>Creek Walk, DHA Phase 8, Karachi</strong></div>
            <div className="detail-row"><span>Weekdays</span><strong>6:00 PM – 2:00 AM</strong></div>
            <div className="detail-row"><span>Weekends</span><strong>6:00 PM – 3:00 AM</strong></div>
            <div className="detail-row"><span>Best for</span><strong>Families, friends and late-evening chai</strong></div>
            <div className="hero-actions">
              <a className="button button-gold" href={env.mapsUrl} target="_blank" rel="noreferrer">Open Google Maps</a>
              <a className="button button-maroon" href={whatsapp} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section contact-section">
        <div className="container contact-grid">
          <div><SectionTitle eyebrow="Contact Matka Chai" title="Questions, feedback or collaboration?" text="Send us a message and it will appear directly in the owner dashboard." /></div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
