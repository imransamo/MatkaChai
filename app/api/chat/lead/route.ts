import { NextResponse } from 'next/server';
import { notifyHotLead } from '@/lib/notify-manager';
import { checkRateLimit } from '@/lib/rate-limit';

type ChatMessage = { role?: unknown; text?: unknown };

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rate = checkRateLimit(`hot-lead:${ip}`, 4, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ ok: true });

  try {
    const body = await request.json() as {
      session_id?: unknown;
      messages?: ChatMessage[];
      cart?: Array<{ name?: unknown; quantity?: unknown }>;
    };
    const sessionId = String(body.session_id || '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 80);
    if (sessionId.length < 8) return NextResponse.json({ error: 'Invalid chat session.' }, { status: 400 });
    const messages = (Array.isArray(body.messages) ? body.messages : []).flatMap((message) => {
      const role = message?.role === 'user' ? 'Customer' : message?.role === 'assistant' ? 'Assistant' : '';
      const text = typeof message?.text === 'string' ? message.text.trim().replace(/\s+/g, ' ').slice(0, 500) : '';
      return role && text ? [`${role}: ${text}`] : [];
    }).slice(-10);
    const customerMessageCount = messages.filter((message) => message.startsWith('Customer:')).length;
    if (customerMessageCount < 4) return NextResponse.json({ error: 'Lead threshold not reached.' }, { status: 400 });
    const cart = (Array.isArray(body.cart) ? body.cart : []).flatMap((item) => {
      const name = typeof item?.name === 'string' ? item.name.trim().slice(0, 100) : '';
      return name ? [{ name, quantity: Math.min(20, Math.max(1, Number(item.quantity) || 1)) }] : [];
    }).slice(0, 30);
    const result = await notifyHotLead({ sessionId, transcript: messages.join('\n'), cart });
    return NextResponse.json({ ok: true, notification: result.sent ? 'sent' : result.configured ? 'failed' : 'not_configured' });
  } catch {
    return NextResponse.json({ error: 'Lead alert could not be processed.' }, { status: 500 });
  }
}
