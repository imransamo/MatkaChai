import { randomInt } from 'node:crypto';
import { getMenu } from '@/lib/menu';
import { notifyManager } from '@/lib/notify-manager';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Order, OrderLineItem } from '@/lib/types';

export const deliveryPhases = ['DHA Phase 4', 'DHA Phase 5', 'DHA Phase 6', 'DHA Phase 8'] as const;
export const deliveryFee = 150;

export type CreateOrderInput = {
  customer_name: string;
  phone: string;
  fulfilment_type: 'delivery' | 'pickup';
  delivery_phase?: string;
  delivery_address?: string;
  notes?: string;
  source?: 'website' | 'chat';
  items: Array<{ item_id: string; quantity: number }>;
};

export class OrderError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

function clean(value: unknown, max: number) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}

function createOrderNumber() {
  const date = new Date();
  const stamp = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `MC-${stamp}-${randomInt(1000, 10000)}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const customerName = clean(input.customer_name, 80);
  const phone = clean(input.phone, 30);
  if (customerName.length < 2) throw new OrderError('Please enter your name.');
  if (!/^[+\d][\d\s()-]{7,28}$/.test(phone)) throw new OrderError('Please enter a valid phone number.');
  if (!Array.isArray(input.items) || input.items.length === 0) throw new OrderError('Your cart is empty.');
  if (input.items.length > 30) throw new OrderError('There are too many different items in this order.');

  const fulfilment: Order['fulfilment_type'] = input.fulfilment_type === 'pickup' ? 'pickup' : 'delivery';
  const phase = clean(input.delivery_phase, 30);
  const address = clean(input.delivery_address, 300);
  if (fulfilment === 'delivery' && !deliveryPhases.includes(phase as typeof deliveryPhases[number])) {
    throw new OrderError('Delivery is currently available in DHA Phases 4, 5, 6 and 8.');
  }
  if (fulfilment === 'delivery' && address.length < 8) throw new OrderError('Please enter a complete delivery address.');

  const menu = await getMenu();
  const availableItems = new Map(menu.flatMap((category) => category.items).map((item) => [item.id, item]));
  const consolidated = new Map<string, number>();
  input.items.forEach((entry) => {
    const id = clean(entry.item_id, 100);
    const quantity = Math.min(20, Math.max(1, Math.floor(Number(entry.quantity) || 1)));
    consolidated.set(id, Math.min(20, (consolidated.get(id) || 0) + quantity));
  });

  const lines: OrderLineItem[] = [];
  for (const [itemId, quantity] of consolidated) {
    const item = availableItems.get(itemId);
    if (!item) throw new OrderError('One of the selected menu items is no longer available. Please refresh the menu.');
    lines.push({ item_id: item.id, name: item.name, unit_price: item.price, quantity, line_total: item.price * quantity });
  }
  const subtotal = lines.reduce((total, item) => total + item.line_total, 0);
  const fee = fulfilment === 'delivery' ? deliveryFee : 0;

  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new OrderError('Online ordering is temporarily unavailable. Please try again shortly.', 503);

  const source: Order['source'] = input.source === 'chat' ? 'chat' : 'website';
  const record: Omit<Order, 'id' | 'created_at' | 'updated_at'> = {
    order_number: createOrderNumber(),
    customer_name: customerName,
    phone,
    fulfilment_type: fulfilment as Order['fulfilment_type'],
    delivery_phase: fulfilment === 'delivery' ? phase : null,
    delivery_address: fulfilment === 'delivery' ? address : null,
    payment_method: 'cash' as const,
    items: lines,
    subtotal,
    delivery_fee: fee,
    total: subtotal + fee,
    notes: clean(input.notes, 500) || null,
    source,
    status: 'new' as const,
    notification_status: 'pending' as const,
  };

  const { data, error } = await supabase.from('orders').insert(record).select('*').single();
  let persistedToOrders = Boolean(data && !error);
  let order: Order;
  if (persistedToOrders) {
    order = data as Order;
  } else {
    // Keeps ordering live while an existing Supabase project is waiting for the orders-table migration.
    const summary = [
      ...lines.map((line) => `${line.quantity} × ${line.name} — Rs ${line.line_total.toLocaleString('en-PK')}`),
      '',
      `Subtotal: Rs ${subtotal.toLocaleString('en-PK')}`,
      `Delivery: Rs ${fee.toLocaleString('en-PK')}`,
      `Total: Rs ${(subtotal + fee).toLocaleString('en-PK')}`,
      `Fulfilment: ${fulfilment}`,
      fulfilment === 'delivery' ? `Address: ${phase}, ${address}` : 'Pickup: Creek Walk, DHA Phase 8',
      `Notes: ${clean(input.notes, 500) || 'None'}`,
    ].join('\n');
    const { data: fallbackData, error: fallbackError } = await supabase.from('contact_messages').insert({
      name: customerName,
      phone,
      subject: `Online order ${record.order_number}`,
      message: summary,
      source: 'matkachai.pk-order',
      status: 'new',
    }).select('id, created_at').single();
    if (fallbackError || !fallbackData) throw new OrderError('We could not place the order. Please try again.', 500);
    persistedToOrders = false;
    order = {
      id: fallbackData.id,
      ...record,
      notification_status: 'pending',
      created_at: fallbackData.created_at,
      updated_at: fallbackData.created_at,
    };
  }
  const notificationStatus = await notifyManager(order);
  if (persistedToOrders) await supabase.from('orders').update({ notification_status: notificationStatus }).eq('id', order.id);
  return { ...order, notification_status: notificationStatus };
}
