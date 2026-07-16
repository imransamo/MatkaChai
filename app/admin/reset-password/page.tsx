import type { Metadata } from 'next';
import { ResetPassword } from '@/components/ResetPassword';

export const metadata: Metadata = { title: 'Choose Owner Password', robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return <section className="admin-login-page"><ResetPassword /></section>;
}
