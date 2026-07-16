'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import type { MenuItem } from '@/lib/types';

type ChatMessage = { role: 'user' | 'assistant'; text: string };
type ApiAction = { type: 'add' | 'remove'; item_id: string; quantity: number; item: MenuItem };

const welcome: ChatMessage = {
  role: 'assistant',
  text: 'Assalam-o-Alaikum! I’m the Matka Chai ordering assistant. I can recommend favourites, add items, and book your order right here. What would you like today?',
};

const phases = ['DHA Phase 4', 'DHA Phase 5', 'DHA Phase 6', 'DHA Phase 8'];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [fulfilment, setFulfilment] = useState<'delivery' | 'pickup'>('delivery');
  const [bookedOrder, setBookedOrder] = useState<{ order_number: string; total: number } | null>(null);
  const { items, itemCount, addItem, removeItem, clearCart } = useCart();
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef('');
  const leadNotifiedRef = useRef(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('matka-chat-open', show);
    return () => window.removeEventListener('matka-chat-open', show);
  }, []);

  useEffect(() => {
    const storageKey = 'matka-chat-session-v1';
    const existing = window.localStorage.getItem(storageKey);
    const sessionId = existing || window.crypto.randomUUID();
    if (!existing) window.localStorage.setItem(storageKey, sessionId);
    sessionIdRef.current = sessionId;
    leadNotifiedRef.current = window.localStorage.getItem(`matka-hot-lead-${sessionId}`) === 'sent';
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending, bookingOpen]);

  async function notifyHotLead(nextMessages: ChatMessage[]) {
    const userMessages = nextMessages.filter((message) => message.role === 'user');
    if (userMessages.length < 4 || leadNotifiedRef.current) return;
    const sessionId = sessionIdRef.current || window.crypto.randomUUID();
    leadNotifiedRef.current = true;
    try {
      const response = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          messages: nextMessages.slice(-10),
          cart: items.map((item) => ({ name: item.name, quantity: item.quantity })),
        }),
      });
      if (!response.ok) throw new Error('Lead alert unavailable');
      window.localStorage.setItem(`matka-hot-lead-${sessionId}`, 'sent');
    } catch {
      leadNotifiedRef.current = false;
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim().slice(0, 600);
    if (!trimmed || sending) return;
    const nextMessages = [...messages, { role: 'user' as const, text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);
    void notifyHotLead(nextMessages);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, cart: items.map((item) => ({ id: item.id, quantity: item.quantity })) }),
      });
      const data = await response.json() as { error?: string; reply?: string; cart_actions?: ApiAction[] };
      if (!response.ok) throw new Error(data.error || 'Please try again.');
      (data.cart_actions || []).forEach((action) => {
        if (action.type === 'add') addItem(action.item, action.quantity);
        if (action.type === 'remove') removeItem(action.item_id);
      });
      setMessages((current) => [...current, { role: 'assistant', text: data.reply || 'How else can I help with your order?' }]);
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', text: error instanceof Error ? error.message : 'Please try again.' }]);
    } finally {
      setSending(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  async function bookOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBooking(true);
    setBookingError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.get('customer_name'),
          phone: form.get('phone'),
          fulfilment_type: fulfilment,
          delivery_phase: fulfilment === 'delivery' ? form.get('delivery_phase') : undefined,
          delivery_address: fulfilment === 'delivery' ? form.get('delivery_address') : undefined,
          notes: form.get('notes'),
          source: 'chat',
          items: items.map((item) => ({ item_id: item.id, quantity: item.quantity })),
        }),
      });
      const data = await response.json() as { error?: string; order_number?: string; total?: number };
      if (!response.ok || !data.order_number) throw new Error(data.error || 'We could not book the order.');
      const confirmed = { order_number: data.order_number, total: Number(data.total) || 0 };
      setBookedOrder(confirmed);
      setBookingOpen(false);
      clearCart();
      setMessages((current) => [...current, {
        role: 'assistant',
        text: `Shukriya — order ${confirmed.order_number} is booked for Rs ${confirmed.total.toLocaleString('en-PK')}. Our manager has been notified and will confirm it on your phone.`,
      }]);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'We could not book the order.');
    } finally {
      setBooking(false);
    }
  }

  return (
    <>
      <button type="button" className={`chat-float ${open ? 'is-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close chat' : 'Chat with Matka Chai'} aria-expanded={open}>
        <span className="chat-float-icon" aria-hidden="true">{open ? '×' : '✦'}</span>
        <span>{open ? 'Close' : 'Chat with us'}</span>
      </button>
      {open ? (
        <section className="chat-panel" aria-label="Matka Chai ordering assistant">
          <header className="chat-header">
            <span className="chat-avatar" aria-hidden="true">م</span>
            <div><strong>Matka Chai</strong><small><span /> Ordering assistant</small></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>
          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => <div key={index} className={`chat-message ${message.role}`}>{message.text}</div>)}
            {sending ? <div className="chat-message assistant chat-typing"><i /><i /><i /></div> : null}
            <div ref={endRef} />
          </div>
          {messages.length <= 2 ? (
            <div className="chat-suggestions">
              <button type="button" onClick={() => void sendMessage('Recommend a chai for me')}>Recommend a chai</button>
              <button type="button" onClick={() => void sendMessage('What is your most popular meal?')}>Popular meal</button>
              <button type="button" onClick={() => void sendMessage('Where do you deliver?')}>Delivery areas</button>
            </div>
          ) : null}
          {itemCount > 0 ? (
            <div className="chat-cart-bar">
              <span><strong>{itemCount}</strong> item{itemCount === 1 ? '' : 's'} in cart</span>
              <div><button type="button" onClick={() => setBookingOpen((value) => !value)}>Book in chat</button><Link href="/checkout?source=chat" onClick={() => setOpen(false)}>Full checkout →</Link></div>
            </div>
          ) : null}
          {bookingOpen && itemCount > 0 ? (
            <form className="chat-booking-form" onSubmit={bookOrder}>
              <strong>Book this order</strong>
              <div className="chat-booking-toggle">
                <button type="button" className={fulfilment === 'delivery' ? 'active' : ''} onClick={() => setFulfilment('delivery')}>Delivery</button>
                <button type="button" className={fulfilment === 'pickup' ? 'active' : ''} onClick={() => setFulfilment('pickup')}>Pickup</button>
              </div>
              <input name="customer_name" autoComplete="name" placeholder="Your name" required maxLength={80} />
              <input name="phone" type="tel" autoComplete="tel" placeholder="03xx xxxxxxx" required maxLength={30} />
              {fulfilment === 'delivery' ? <>
                <select name="delivery_phase" defaultValue="DHA Phase 8" required>{phases.map((phase) => <option key={phase}>{phase}</option>)}</select>
                <textarea name="delivery_address" autoComplete="street-address" placeholder="Complete delivery address" required maxLength={300} rows={2} />
              </> : <small>Pickup: Creek Walk, DHA Phase 8</small>}
              <textarea name="notes" placeholder="Order notes (optional)" maxLength={500} rows={2} />
              {bookingError ? <p role="alert">{bookingError}</p> : null}
              <button className="chat-book-order" disabled={booking}>{booking ? 'Booking…' : 'Confirm & book order'}</button>
            </form>
          ) : null}
          {bookedOrder ? <div className="chat-booked"><strong>Order {bookedOrder.order_number}</strong><span>Manager notified · Rs {bookedOrder.total.toLocaleString('en-PK')}</span></div> : null}
          <form className="chat-input" onSubmit={submit}>
            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask or add an item…" maxLength={600} aria-label="Message" />
            <button type="submit" disabled={!input.trim() || sending} aria-label="Send message">↑</button>
          </form>
          <small className="chat-disclosure">AI ordering assistant · Orders require your confirmation</small>
        </section>
      ) : null}
    </>
  );
}
