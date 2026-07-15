'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { env } from '@/lib/env';

const links = [
  ['Home', '/'],
  ['Menu', '/menu'],
  ['Our Story', '/story'],
  ['Visit', '/visit'],
  ['Franchise', '/franchise'],
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const whatsappHref = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum, I would like to know more about Matka Chai.')}`;

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="Matka Chai home" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">م</span>
          <span>
            <strong>MATKA CHAI</strong>
            <small>Pakistan&apos;s Contemporary Chai Room</small>
          </span>
        </Link>

        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
          <span /> <span /> <span />
        </button>

        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? 'active' : ''} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <a className="button button-small button-gold" href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
        </nav>
      </div>
    </header>
  );
}
