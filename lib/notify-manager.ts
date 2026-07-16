import type { Order } from '@/lib/types';

type NotificationStatus = Order['notification_status'];

function orderText(order: Order) {
  const items = order.items.map((item) => `- ${item.quantity} × ${item.name}: Rs ${item.line_total.toLocaleString('en-PK')}`).join('\n');
  const fulfilment = order.fulfilment_type === 'delivery'
    ? `Delivery — ${order.delivery_phase}\n${order.delivery_address}`
    : 'Pickup — Creek Walk, DHA Phase 8';
  return `New Matka Chai order ${order.order_number}\n\n${items}\n\nSubtotal: Rs ${order.subtotal.toLocaleString('en-PK')}\nDelivery: Rs ${order.delivery_fee.toLocaleString('en-PK')}\nTotal: Rs ${order.total.toLocaleString('en-PK')}\n\nCustomer: ${order.customer_name}\nPhone: ${order.phone}\n${fulfilment}\nPayment: Cash\nNotes: ${order.notes || 'None'}`;
}

export async function notifyManager(order: Order): Promise<NotificationStatus> {
  const webhookUrl = process.env.ORDER_NOTIFICATION_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const managerEmail = process.env.MANAGER_NOTIFICATION_EMAIL || 'hello@matkachai.pk';
  if (!webhookUrl && !resendKey) return 'not_configured';

  let sent = false;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'order.created', order, summary: orderText(order) }),
        signal: AbortSignal.timeout(8000),
      });
      sent = response.ok || sent;
    } catch {
      // The order remains safely stored even if an external notification is unavailable.
    }
  }

  if (resendKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.ORDER_NOTIFICATION_FROM || 'Matka Chai Orders <orders@matkachai.pk>',
          to: [managerEmail],
          subject: `New order ${order.order_number} — Rs ${order.total.toLocaleString('en-PK')}`,
          text: orderText(order),
        }),
        signal: AbortSignal.timeout(8000),
      });
      sent = response.ok || sent;
    } catch {
      // A failed email must never cause a paid or confirmed customer order to disappear.
    }
  }

  return sent ? 'sent' : 'failed';
}
