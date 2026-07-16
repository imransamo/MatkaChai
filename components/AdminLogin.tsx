'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() => {
    if (params.get('error') === 'not-configured') return 'Supabase environment variables are not configured.';
    if (params.get('error') === 'not-authorized') return 'This account is not registered as a Matka Chai administrator.';
    if (params.get('error') === 'invalid-reset-link') return 'This password-reset link is invalid or has expired. Please request a new one.';
    return '';
  });
  const passwordReset = params.get('reset') === 'success';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: String(form.get('email') || ''),
        password: String(form.get('password') || ''),
      });
      if (loginError) throw loginError;
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      setError(message === 'Failed to fetch'
        ? 'Cannot reach the authentication service. Please check the Supabase URL and public key in the live-site environment settings.'
        : message);
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div className="brand admin-brand"><span className="brand-mark">م</span><span><strong>MATKA CHAI</strong><small>Owner Dashboard</small></span></div>
      <h1>Sign in</h1>
      <p>Manage menu items, franchise leads and customer messages.</p>
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
      <a className="admin-forgot-link" href="/admin/forgot-password">Forgot password?</a>
      <button className="button button-gold" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      {passwordReset ? <p className="form-message success">Password updated. Sign in with your new password.</p> : null}
      {error ? <p className="form-message error">{error}</p> : null}
      <a href="/">← Return to website</a>
    </form>
  );
}
