'use client';

import { FormEvent, useState } from 'react';

export function FranchiseForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/franchise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not submit your enquiry.');
      form.reset();
      setStatus('success');
      setMessage('Thank you. Your franchise interest has been registered. Our team will contact you after review.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <input className="honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-grid">
        <label>Full name<input name="full_name" required minLength={2} maxLength={100} /></label>
        <label>Phone number<input name="phone" required inputMode="tel" minLength={8} maxLength={30} /></label>
        <label>Email address<input type="email" name="email" required maxLength={120} /></label>
        <label>City<input name="city" required minLength={2} maxLength={80} /></label>
        <label>Preferred location<input name="preferred_location" maxLength={120} placeholder="Area, mall or city" /></label>
        <label>Investment range
          <select name="investment_range" required defaultValue="">
            <option value="" disabled>Select range</option>
            <option>Below Rs 5 million</option>
            <option>Rs 5–10 million</option>
            <option>Rs 10–20 million</option>
            <option>Above Rs 20 million</option>
          </select>
        </label>
        <label>Interested format
          <select name="format_interest" required defaultValue="">
            <option value="" disabled>Select format</option>
            <option>Matka Express kiosk</option>
            <option>Matka Chai Room</option>
            <option>Matka Chai Flagship</option>
            <option>Open to recommendation</option>
          </select>
        </label>
        <label>Do you already have a property?
          <select name="has_property" required defaultValue="false">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>
      </div>
      <label>Business experience<textarea name="experience" rows={3} maxLength={700} placeholder="Tell us briefly about your current business or professional background." /></label>
      <label>Why are you interested in Matka Chai?<textarea name="message" rows={4} maxLength={1000} /></label>
      <button className="button button-gold" disabled={status === 'loading'}>{status === 'loading' ? 'Submitting…' : 'Register Franchise Interest'}</button>
      {message ? <p className={`form-message ${status}`}>{message}</p> : null}
      <small className="form-note">Submitting this form expresses interest only and does not constitute a franchise offer or financial promise.</small>
    </form>
  );
}
