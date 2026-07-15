import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (text(body.company_website, 200)) return NextResponse.json({ ok: true });

    const payload = {
      name: text(body.name, 100),
      phone: text(body.phone, 30) || null,
      email: text(body.email, 120).toLowerCase() || null,
      subject: text(body.subject, 100) || 'General enquiry',
      message: text(body.message, 1500),
      source: 'matkachai.pk',
    };

    if (!payload.name || payload.message.length < 10) {
      return NextResponse.json({ error: 'Please enter your name and a complete message.' }, { status: 400 });
    }
    if (payload.email && !payload.email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ error: 'The contact database is not connected yet. Please contact us on WhatsApp.' }, { status: 503 });

    const { error } = await supabase.from('contact_messages').insert(payload);
    if (error) {
      console.error('Contact insert error:', error.message);
      return NextResponse.json({ error: 'Your message could not be saved. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
