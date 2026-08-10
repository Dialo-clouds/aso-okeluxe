import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// Flutterwave signs webhook requests with a hash you set in your dashboard
// (Settings > Webhooks). It's sent back in a header — verify it exactly
// matches what you configured before trusting the payload. The header name
// below (verif-hash) matches Flutterwave's v3 convention; confirm this is
// still correct for v4 webhooks in your dashboard before relying on it live,
// since this wasn't testable from this environment.
export async function POST(request) {
  try {
    const signature = request.headers.get('verif-hash');
    const expectedHash = process.env.FLW_WEBHOOK_HASH;

    if (!expectedHash || signature !== expectedHash) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }

    const payload = await request.json();

    // Adjust this to match the actual v4 webhook payload shape once you can
    // see a real one in your dashboard's webhook logs — this is a best-effort
    // structure based on Flutterwave's general event pattern.
    const reference = payload.data?.reference || payload.reference;
    const status = payload.data?.status || payload.status;

    if (!reference) {
      return NextResponse.json({ error: 'No order reference in payload.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: reference } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found for this reference.' }, { status: 404 });
    }

    if (status === 'successful' || status === 'success' || status === 'completed') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Flutterwave webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
