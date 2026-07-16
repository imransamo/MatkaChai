import { NextResponse } from 'next/server';
import { createOrder, OrderError, type CreateOrderInput } from '@/lib/orders';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rate = checkRateLimit(`order:${ip}`, 8, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many order attempts. Please wait a few minutes.' }, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfter) },
    });
  }

  try {
    const body = await request.json() as CreateOrderInput & { website?: string };
    if (body.website) return NextResponse.json({ ok: true });
    const order = await createOrder(body);
    return NextResponse.json({ ok: true, order_number: order.order_number, total: order.total }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'We could not place the order. Please try again.' }, { status: 500 });
  }
}
