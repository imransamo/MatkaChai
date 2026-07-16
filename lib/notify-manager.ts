import type { Order } from '@/lib/types';

type NotificationStatus = Order['notification_status'];
type AlertResult = { configured: boolean; sent: boolean };

const managerWhatsApp = (process.env.MANAGER_WHATSAPP_NUMBER || '923337571119').replace(/\D/g, '');

function managerWhatsAppLink(summary: string) {
  return `https://wa.me/${managerWhatsApp}?text=${encodeURIComponent(summary)}`;
}

function orderText(order: Order) {
  const items = order.items.map((item) => `- ${item.quantity} × ${item.name}: Rs ${item.line_total.toLocaleString('en-PK')}`).join('\n');
  const fulfilment = order.fulfilment_type === 'delivery'
    ? `Delivery — ${order.delivery_phase}\n${order.delivery_address}`
    : 'Pickup — Creek Walk, DHA Phase 8';
  return `New Matka Chai order ${order.order_number}\n\n${items}\n\nSubtotal: Rs ${order.subtotal.toLocaleString('en-PK')}\nDelivery: Rs ${order.delivery_fee.toLocaleString('en-PK')}\nTotal: Rs ${order.total.toLocaleString('en-PK')}\n\nCustomer: ${order.customer_name}\nPhone: ${order.phone}\n${fulfilment}\nPayment: Cash\nNotes: ${order.notes || 'None'}`;
}

async function sendWhatsApp(summary: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!accessToken || !phoneNumberId || !managerWhatsApp) return { configured: false, sent: false };
  try {
    const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || 'v23.0';
    const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: managerWhatsApp,
        type: 'text',
        text: { preview_url: false, body: summary.slice(0, 4000) },
      }),
      signal: AbortSignal.timeout(8000),
    });
    return { configured: true, sent: response.ok };
  } catch {
    return { configured: true, sent: false };
  }
}

async function sendManagerAlert(event: string, subject: string, summary: string, payload: unknown): Promise<AlertResult> {
  const webhookUrl = process.env.ORDER_NOTIFICATION_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const managerEmail = process.env.MANAGER_NOTIFICATION_EMAIL || 'hello@matkachai.pk';
  let configured = Boolean(webhookUrl || resendKey);
  let sent = false;

  const whatsapp = await sendWhatsApp(summary);
  configured = configured || whatsapp.configured;
  sent = sent || whatsapp.sent;

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          payload,
          summary,
          manager_whatsapp: managerWhatsApp,
          manager_whatsapp_link: managerWhatsAppLink(summary),
        }),
        signal: AbortSignal.timeout(8000),
      });
      sent = response.ok || sent;
    } catch {
      // Orders and leads remain stored even if an external channel is temporarily unavailable.
    }
  }

  if (resendKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.ORDER_NOTIFICATION_FROM || 'Matka Chai Alerts <orders@matkachai.pk>',
          to: [managerEmail],
          subject,
          text: `${summary}\n\nWhatsApp manager: ${managerWhatsAppLink(summary)}`,
        }),
        signal: AbortSignal.timeout(8000),
      });
      sent = response.ok || sent;
    } catch {
      // A failed email must never cause a customer order or lead to disappear.
    }
  }

  return { configured, sent };
}

export async function notifyManager(order: Order): Promise<NotificationStatus> {
  const result = await sendManagerAlert(
    'order.created',
    `New order ${order.order_number} — Rs ${order.total.toLocaleString('en-PK')}`,
    orderText(order),
    order,
  );
  if (!result.configured) return 'not_configured';
  return result.sent ? 'sent' : 'failed';
}

export async function notifyHotLead(input: {
  sessionId: string;
  transcript: string;
  cart: Array<{ name: string; quantity: number }>;
}) {
  const cart = input.cart.length
    ? input.cart.map((item) => `${item.quantity} × ${item.name}`).join(', ')
    : 'No items added yet';
  const summary = `Hot lead on matkachai.pk\n\nThe customer has sent 4+ chat messages.\nSession: ${input.sessionId}\nCart: ${cart}\n\nRecent conversation:\n${input.transcript}`;
  return sendManagerAlert('chat.hot_lead', 'Hot Matka Chai website lead', summary, input);
}
