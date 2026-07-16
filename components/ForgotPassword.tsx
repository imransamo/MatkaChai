'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/admin/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        String(form.get('email') || '').trim(),
        { redirectTo },
      );
      if (resetError) throw resetError;
      setMessage('If this email is registered, a secure password-reset link has been sent. Please also check your spam folder.');
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Unable to request a password reset.';
      setError(detail === 'Failed to fetch'
        ? 'Cannot reach the authentication service. The live Supabase environment settings need to be checked.'
        : detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div className="brand admin-brand"><span className="brand-mark">م</span><span><strong>MATKA CHAI</strong><small>Owner Dashboard</small></span></div>
      <h1>Reset password</h1>
      <p>Enter the owner email address and we’ll send a secure reset link.</p>
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <button className="button button-gold" disabled={loading}>{loading ? 'Sending…' : 'Send Reset Link'}</button>
      {message ? <p className="form-message success">{message}</p> : null}
      {error ? <p className="form-message error">{error}</p> : null}
      <a href="/admin/login">← Return to owner login</a>
    </form>
  );
}
