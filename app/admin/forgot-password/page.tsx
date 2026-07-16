import type { Metadata } from 'next';
import { ForgotPassword } from '@/components/ForgotPassword';

export const metadata: Metadata = { title: 'Reset Owner Password', robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <section className="admin-login-page"><ForgotPassword /></section>;
}
