import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminLogin } from '@/components/AdminLogin';

export const metadata: Metadata = { title: 'Owner Login', robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return <section className="admin-login-page"><Suspense fallback={<p>Loading…</p>}><AdminLogin /></Suspense></section>;
}
