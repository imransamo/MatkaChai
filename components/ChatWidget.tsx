'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import type { MenuItem } from '@/lib/types';

type ChatMessage = { role: 'user' | 'assistant'; text: string };
type ApiAction = { type: 'add' | 'remove'; item_id: string; quantity: number; item: MenuItem };

const welcome: ChatMessage = {
  role: 'assistant',
  text: 'Assalam-o-Alaikum! I’m the Matka Chai ordering assistant. I can recommend favourites, add items to your cart, and help you get the order ready. What would you like today?',
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const { items, itemCount, addItem, removeItem } = useCart();
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('matka-chat-open', show);
    return () => window.removeEventListener('matka-chat-open', show);
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  async function sendMessage(text: string) {
    const trimmed = text.trim().slice(0, 600);
    if (!trimmed || sending) return;
    const nextMessages = [...messages, { role: 'user' as const, text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, cart: items.map((item) => ({ id: item.id, quantity: item.quantity })) }),
      });
      const data = await response.json() as { error?: string; reply?: string; cart_actions?: ApiAction[]; checkout_ready?: boolean };
      if (!response.ok) throw new Error(data.error || 'Please try again.');
      (data.cart_actions || []).forEach((action) => {
        if (action.type === 'add') addItem(action.item, action.quantity);
        if (action.type === 'remove') removeItem(action.item_id);
      });
      setCheckoutReady(Boolean(data.checkout_ready));
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

  return (
    <>
      <button type="button" className={`chat-float ${open ? 'is-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close chat' : 'Chat with Matka Chai'} aria-expanded={open}>
        <span className="chat-float-icon" aria-hidden="true">{open ? '×' : '✦'}</span>
        <span>{open ? 'Close' : 'Chat with us'}</span>
        {!open && itemCount > 0 ? <strong>{itemCount}</strong> : null}
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
          {itemCount > 0 && checkoutReady ? (
            <div className="chat-cart-bar">
              <span><strong>{itemCount}</strong> item{itemCount === 1 ? '' : 's'} ready</span>
              <Link href="/checkout?source=chat" onClick={() => setOpen(false)}>Checkout →</Link>
            </div>
          ) : null}
          <form className="chat-input" onSubmit={submit}>
            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask or add an item…" maxLength={600} aria-label="Message" />
            <button type="submit" disabled={!input.trim() || sending} aria-label="Send message">↑</button>
          </form>
          <small className="chat-disclosure">AI ordering assistant · Final orders require your confirmation</small>
        </section>
      ) : null}
    </>
  );
}
