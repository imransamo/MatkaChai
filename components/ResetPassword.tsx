'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      router.replace('/admin/login?reset=success');
      router.refresh();
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Unable to update the password.';
      setError(detail === 'Auth session missing!'
        ? 'This reset link is invalid or has expired. Request a new link from the owner login page.'
        : detail);
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div className="brand admin-brand"><span className="brand-mark">م</span><span><strong>MATKA CHAI</strong><small>Owner Dashboard</small></span></div>
      <h1>Choose password</h1>
      <p>Set a new password for the Matka Chai owner account.</p>
      <label>New password<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label>
      <label>Confirm password<input name="confirmPassword" type="password" minLength={8} required autoComplete="new-password" /></label>
      <button className="button button-gold" disabled={loading}>{loading ? 'Updating…' : 'Update Password'}</button>
      {error ? <p className="form-message error">{error}</p> : null}
      <a href="/admin/forgot-password">Request another reset link</a>
    </form>
  );
}
