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
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 52 58" role="presentation">
              <path className="logo-steam" d="M18 13c-5-7 5-8 1-14M27 12c-6-8 6-10 2-17M36 13c-5-7 5-8 2-14" />
              <path className="logo-rim" d="M8 20c2-8 34-8 36 0-3 8-33 8-36 0Z" />
              <path className="logo-pot" d="M10 23c1 13 3 25 9 31 4 4 10 4 14 0 7-6 9-18 10-31-8 5-25 5-33 0Z" />
              <path className="logo-ridge" d="M13 33c8 3 18 3 26 0M15 41c7 3 15 3 22 0" />
            </svg>
          </span>
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
