import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { getSessionFromCookies } from '../../../../../lib/auth';
import { createBankTransferCharge } from '../../../../../lib/flutterwave';
import { checkRateLimit, getClientIp } from '../../../../../lib/ratelimit';

export async function POST(request) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { allowed } = await checkRateLimit('payment', getClientIp(request));
  if (!allowed) {
    return NextResponse.json({ error: 'Too many payment attempts. Please wait a minute and try again.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { orderId } = body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    if (order.userId !== session.id) {
      return NextResponse.json({ error: 'Not authorized for this order.' }, { status: 403 });
    }
    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: 'This order has already been processed.' }, { status: 400 });
    }

    const charge = await createBankTransferCharge({
      orderId: order.id,
      amountKobo: order.totalKobo,
      customerEmail: session.email,
      customerName: session.name,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: charge.id || charge.data?.id || null },
    });

    return NextResponse.json({ charge });
  } catch (err) {
    console.error('Flutterwave initiate error:', err);
    return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 500 });
  }
}
