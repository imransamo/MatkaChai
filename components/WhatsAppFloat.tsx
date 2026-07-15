import { env } from '@/lib/env';

export function WhatsAppFloat() {
  const href = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum, I am contacting Matka Chai from matkachai.pk.')}`;
  return <a className="whatsapp-float" href={href} target="_blank" rel="noreferrer" aria-label="Chat with Matka Chai on WhatsApp">WA</a>;
}
