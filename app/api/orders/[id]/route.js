import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { getSessionFromCookies } from '../../../../lib/auth';

export async function GET(request, { params }) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session) {
    return NextResponse.json({ error: 'Login required.' }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  if (order.userId !== session.id && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized to view this order.' }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(request, { params }) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    return NextResponse.json({ order });
  } catch (err) {
    console.error('Update order error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
