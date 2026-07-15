'use client';

import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [state, setState] = useState({ loading: false, message: '', ok: false });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState({ loading: true, message: '', ok: false });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your message.');
      form.reset();
      setState({ loading: false, message: 'Your message has been received. We will get back to you shortly.', ok: true });
    } catch (error) {
      setState({ loading: false, message: error instanceof Error ? error.message : 'Something went wrong.', ok: false });
    }
  }

  return (
    <form className="form-card compact" onSubmit={submit}>
      <input className="honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-grid">
        <label>Name<input name="name" required minLength={2} maxLength={100} /></label>
        <label>Phone<input name="phone" inputMode="tel" maxLength={30} /></label>
        <label>Email<input type="email" name="email" maxLength={120} /></label>
        <label>Subject<select name="subject" defaultValue="General enquiry"><option>General enquiry</option><option>Feedback</option><option>Event or collaboration</option><option>Media</option></select></label>
      </div>
      <label>Message<textarea name="message" required minLength={10} maxLength={1500} rows={5} /></label>
      <button className="button button-gold" disabled={state.loading}>{state.loading ? 'Sending…' : 'Send Message'}</button>
      {state.message ? <p className={`form-message ${state.ok ? 'success' : 'error'}`}>{state.message}</p> : null}
    </form>
  );
}
