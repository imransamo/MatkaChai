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
      full_name: text(body.full_name, 100),
      phone: text(body.phone, 30),
      email: text(body.email, 120).toLowerCase(),
      city: text(body.city, 80),
      preferred_location: text(body.preferred_location, 120) || null,
      investment_range: text(body.investment_range, 80),
      experience: text(body.experience, 700) || null,
      has_property: body.has_property === true || body.has_property === 'true',
      format_interest: text(body.format_interest, 100),
      message: text(body.message, 1000) || null,
      source: 'matkachai.pk',
    };

    if (!payload.full_name || payload.phone.length < 8 || !payload.email.includes('@') || !payload.city || !payload.investment_range || !payload.format_interest) {
      return NextResponse.json({ error: 'Please complete all required fields correctly.' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ error: 'The enquiry database is not connected yet. Please contact us on WhatsApp.' }, { status: 503 });

    const { error } = await supabase.from('franchise_leads').insert(payload);
    if (error) {
      console.error('Franchise insert error:', error.message);
      return NextResponse.json({ error: 'Your enquiry could not be saved. Please try again or contact us on WhatsApp.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
