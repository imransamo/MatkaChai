import { NextResponse } from 'next/server';
import { getMenu } from '@/lib/menu';
import { checkRateLimit } from '@/lib/rate-limit';
import type { MenuItem } from '@/lib/types';

type ChatMessage = { role: 'user' | 'assistant'; text: string };
type CartAction = { type: 'add' | 'remove'; item_id: string; quantity: number };

function extractOutputText(response: Record<string, unknown>) {
  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output) {
    if (!item || typeof item !== 'object') continue;
    const content = Array.isArray((item as { content?: unknown[] }).content) ? (item as { content: unknown[] }).content : [];
    for (const part of content) {
      if (part && typeof part === 'object' && typeof (part as { text?: unknown }).text === 'string') return (part as { text: string }).text;
    }
  }
  return '';
}

function fallbackReply(lastMessage: string, items: MenuItem[]) {
  const lower = lastMessage.toLowerCase();
  const matched = items.find((item) => lower.includes(item.name.toLowerCase()))
    || items.find((item) => item.name.toLowerCase().split(' ').every((word) => word.length < 4 || lower.includes(word)));
  const wantsCart = /\b(add|order|want|give|book)\b/.test(lower);
  if (matched && wantsCart) {
    return {
      reply: `Done — I’ve added ${matched.name} to your cart. You can keep choosing, or tap checkout when you’re ready.`,
      cart_actions: [{ type: 'add' as const, item_id: matched.id, quantity: 1 }],
      checkout_ready: true,
    };
  }
  if (/cooler|slush|cold|refresh/.test(lower)) {
    return { reply: 'For something refreshing, Mint Lemonade is our signature. Pineapple, lychee and berry slushes are also served in hand-painted art matkas. Which flavour should I add?', cart_actions: [], checkout_ready: false };
  }
  if (/biryani|meal|hungry|dinner|food/.test(lower)) {
    return { reply: 'Our Matka Chicken Biryani is the signature meal. For something richer, try Matka Nalli Biryani or Lamb Rosh. Tell me the item and quantity and I’ll add it.', cart_actions: [], checkout_ready: false };
  }
  if (/chai|tea|recommend/.test(lower)) {
    return { reply: 'Our classic Matka Chai is the house signature. Malai Badam is creamy and nutty, while Kashmiri Chai is gently sweet and pink. What are you in the mood for?', cart_actions: [], checkout_ready: false };
  }
  if (/delivery|area|phase/.test(lower)) {
    return { reply: 'We deliver to DHA Phases 4, 5, 6 and 8 for Rs 150, usually within 30–60 minutes after confirmation. Pickup from Creek Walk, DHA 8 is free.', cart_actions: [], checkout_ready: false };
  }
  return { reply: 'I can help you choose from our chai, art-matka slushes, fries, biryani, handi and rosh menu. Tell me what you feel like having, or ask for a recommendation.', cart_actions: [], checkout_ready: false };
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rate = checkRateLimit(`chat:${ip}`, 40, 10 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'Please wait a moment before sending another message.' }, { status: 429 });

  try {
    const body = await request.json() as { messages?: ChatMessage[]; cart?: Array<{ id: string; quantity: number }> };
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((message) => message && (message.role === 'user' || message.role === 'assistant') && typeof message.text === 'string')
      .slice(-12)
      .map((message) => ({ role: message.role, content: message.text.trim().slice(0, 600) }));
    if (!messages.length || messages[messages.length - 1].role !== 'user') return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });

    const menu = await getMenu();
    const items = menu.flatMap((category) => category.items);
    const itemMap = new Map(items.map((item) => [item.id, item]));
    const fallback = fallbackReply(messages[messages.length - 1].content, items);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ...fallback, cart_actions: fallback.cart_actions.map((action) => ({ ...action, item: itemMap.get(action.item_id) })) });
    }

    const compactMenu = menu.map((category) => ({
      category: category.name,
      items: category.items.map((item) => ({ id: item.id, name: item.name, price: item.price, description: item.description })),
    }));
    const cart = (Array.isArray(body.cart) ? body.cart : []).flatMap((entry) => {
      const item = itemMap.get(String(entry.id));
      return item ? [{ id: item.id, name: item.name, quantity: Math.min(20, Math.max(1, Number(entry.quantity) || 1)) }] : [];
    });

    const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-5.4-mini',
        store: false,
        reasoning: { effort: 'low' },
        max_output_tokens: 500,
        instructions: `You are Matka Chai's warm, natural ordering assistant for the Creek Walk DHA 8 Karachi kiosk. You are an AI ordering assistant; never claim to be a human. Be concise, hospitable, and conversational. You may use simple Urdu courtesies naturally, but answer mainly in the customer's language. Help customers choose only from the exact current menu below. Never invent items, prices, discounts, ingredients, availability, delivery zones or preparation promises. Delivery is available only in DHA Phases 4, 5, 6 and 8 for Rs 150 and takes approximately 30–60 minutes after manager confirmation. Pickup is at Creek Walk, DHA Phase 8 and has no fee. Payment is cash on delivery or pickup. For explicit requests to add, remove or change an item, return the matching cart action. Use item IDs exactly. Do not say an item was added unless you return an add action. After adding an item, tell the customer they can tap “Book in chat” to enter their details and confirm the order without leaving the conversation. Never claim an order is confirmed or placed until the website returns an order number. Current cart: ${JSON.stringify(cart)}. Exact menu: ${JSON.stringify(compactMenu)}.`,
        input: messages,
        text: {
          format: {
            type: 'json_schema',
            name: 'matka_chai_chat',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                reply: { type: 'string' },
                cart_actions: {
                  type: 'array',
                  maxItems: 5,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      type: { type: 'string', enum: ['add', 'remove'] },
                      item_id: { type: 'string' },
                      quantity: { type: 'integer', minimum: 1, maximum: 20 },
                    },
                    required: ['type', 'item_id', 'quantity'],
                  },
                },
                checkout_ready: { type: 'boolean' },
              },
              required: ['reply', 'cart_actions', 'checkout_ready'],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!openAIResponse.ok) throw new Error('AI service unavailable');
    const raw = await openAIResponse.json() as Record<string, unknown>;
    const parsed = JSON.parse(extractOutputText(raw)) as { reply?: string; cart_actions?: CartAction[]; checkout_ready?: boolean };
    const actions = (Array.isArray(parsed.cart_actions) ? parsed.cart_actions : []).flatMap((action) => {
      const item = itemMap.get(String(action.item_id));
      if (!item || (action.type !== 'add' && action.type !== 'remove')) return [];
      return [{ type: action.type, item_id: item.id, quantity: Math.min(20, Math.max(1, Number(action.quantity) || 1)), item }];
    });
    return NextResponse.json({
      reply: String(parsed.reply || fallback.reply).slice(0, 800),
      cart_actions: actions,
      checkout_ready: Boolean(parsed.checkout_ready || actions.length),
    });
  } catch {
    return NextResponse.json({ error: 'I am having trouble replying right now. You can still order directly from the menu.' }, { status: 503 });
  }
}
