import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../../lib/prisma';
import { getSessionFromCookies } from '../../../../../lib/auth';
import { getChargeStatus } from '../../../../../lib/flutterwave';

export async function POST(request) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId } = body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    if (order.userId !== session.id && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }
    if (!order.paymentRef) {
      return NextResponse.json({ error: 'No payment has been started for this order yet.' }, { status: 400 });
    }

    if (order.status === 'PAID') {
      return NextResponse.json({ status: 'PAID' });
    }

    const charge = await getChargeStatus(order.paymentRef);
    const chargeStatus = charge.status || charge.data?.status;

    if (chargeStatus === 'successful' || chargeStatus === 'success' || chargeStatus === 'completed') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } });
      return NextResponse.json({ status: 'PAID' });
    }

    return NextResponse.json({ status: order.status, flutterwaveStatus: chargeStatus });
  } catch (err) {
    console.error('Flutterwave verify error:', err);
    return NextResponse.json({ error: 'Could not verify payment status.' }, { status: 500 });
  }
}
