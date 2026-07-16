import type { Metadata } from 'next';
import { FranchiseForm } from '@/components/FranchiseForm';
import { SectionTitle } from '@/components/SectionTitle';

export const metadata: Metadata = { title: 'Matka Chai Franchise Pakistan', description: 'Register interest in future Matka Chai franchise opportunities and chai-room formats across Pakistan.', alternates: { canonical: '/franchise' } };

export default function FranchisePage() {
  return (
    <>
      <section className="page-hero franchise-hero"><div className="container page-hero-content"><span className="eyebrow light">Grow With Matka Chai</span><h1>Bring the chai-room experience to your city.</h1><p>Register your interest in future Matka Chai franchise opportunities.</p></div></section>
      <section className="section parchment-section">
        <div className="container">
          <SectionTitle eyebrow="A Brand Built to Travel" title="Authentic at heart. Disciplined in operation." text="We are developing the franchise model carefully around product consistency, location suitability, training and unit economics—not quick expansion promises." center />
          <div className="formats-grid">
            <article><span>01</span><h3>Matka Express</h3><p>A compact kiosk format for food streets, malls and high-footfall destinations.</p><small>Future format · Investment under development</small></article>
            <article className="highlight"><span>02</span><h3>Matka Chai Room</h3><p>A seated neighbourhood outlet built around chai, food and relaxed social gatherings.</p><small>Core future format · Investment under development</small></article>
            <article><span>03</span><h3>Matka Flagship</h3><p>A larger destination outlet with the complete experience, extended menu and events.</p><small>Selective format · Investment under development</small></article>
          </div>
        </div>
      </section>
      <section className="section support-section">
        <div className="container">
          <SectionTitle eyebrow="Planned Franchise Support" title="A system, not just a logo." center />
          <div className="support-grid">
            <div><strong>Brand & design</strong><p>Store identity, signage, menu presentation and launch materials.</p></div>
            <div><strong>Recipes & operations</strong><p>Product standards, processes, preparation and quality controls.</p></div>
            <div><strong>Training</strong><p>Owner and team onboarding before opening.</p></div>
            <div><strong>Location assessment</strong><p>Review of market, footfall, format and site suitability.</p></div>
            <div><strong>Procurement guidance</strong><p>Equipment, packaging and approved supply standards.</p></div>
            <div><strong>Marketing launch</strong><p>Opening campaign structure and digital brand support.</p></div>
          </div>
        </div>
      </section>
      <section className="section application-section">
        <div className="container application-grid">
          <div className="application-copy">
            <SectionTitle eyebrow="Register Your Interest" title="Tell us where you want to grow Matka Chai." />
            <p>We will use these enquiries to identify serious partners and promising cities while the franchise model is finalised.</p>
            <ol><li>Submit your profile and preferred market.</li><li>Our team reviews fit, capital and location potential.</li><li>Suitable candidates receive the next-stage information when available.</li></ol>
          </div>
          <FranchiseForm />
        </div>
      </section>
    </>
  );
}
