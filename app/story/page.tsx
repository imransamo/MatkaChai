import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/SectionTitle';

export const metadata: Metadata = { title: 'Our Story', description: 'Discover the story behind Matka Chai Karachi and our contemporary take on Pakistan’s chai, clay-matka and hospitality traditions.', alternates: { canonical: '/story' } };

export default function StoryPage() {
  return (
    <>
      <section className="page-hero story-hero"><div className="container page-hero-content"><span className="eyebrow light">Our Beginning</span><h1>Born from Pakistan&apos;s love for chai.</h1><p>Rooted in tradition. Designed for today.</p></div></section>
      <section className="section parchment-section">
        <div className="container split-grid story-grid">
          <div className="split-copy">
            <SectionTitle eyebrow="The Idea" title="A familiar ritual, thoughtfully reimagined." />
            <p>Chai in Pakistan is never just a beverage. It is a welcome, a pause, a conversation and often the beginning of a friendship.</p>
            <p>Matka Chai was created to honour that ritual while giving it a distinctive contemporary home: a warm chai room where the earthen matka, Pakistani flavours and relaxed hospitality feel both nostalgic and new.</p>
          </div>
          <div className="split-image ornate-frame"><Image src="/images/chai.svg" alt="Traditional chai served in an earthen matka" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
        </div>
      </section>
      <section className="section values-section">
        <div className="container">
          <SectionTitle eyebrow="What We Stand For" title="Simple promises, consistently delivered." center />
          <div className="values-grid">
            <article><span>01</span><h3>Authentic warmth</h3><p>Every guest should feel welcomed, comfortable and remembered.</p></article>
            <article><span>02</span><h3>Distinctive flavour</h3><p>Recognisable Pakistani favourites with a memorable Matka Chai signature.</p></article>
            <article><span>03</span><h3>Honest value</h3><p>Generous experiences, clear pricing and no unnecessary promises.</p></article>
            <article><span>04</span><h3>Scalable discipline</h3><p>Strong recipes, systems and training that can support responsible growth.</p></article>
          </div>
        </div>
      </section>
      <section className="section origin-section">
        <div className="container origin-grid">
          <div><span className="eyebrow light">The Original Chai Room</span><h2>Creek Walk, DHA Phase 8, Karachi</h2><p>This is where Matka Chai is learning, refining and building the operating standards for its next chapter.</p><Link href="/visit" className="button button-gold">Visit the Original</Link></div>
          <div className="origin-number">01</div>
        </div>
      </section>
    </>
  );
}
