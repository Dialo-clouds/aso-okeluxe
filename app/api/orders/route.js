import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { getSessionFromCookies } from '../../../lib/auth';

export async function POST(request) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);

  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to check out.' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const useCredit = !!body.useCredit;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Your bag is empty.' }, { status: 400 });
    }

    const subtotalKobo = cartItems.reduce((sum, item) => sum + item.product.priceKobo * item.quantity, 0);

    let creditUsedKobo = 0;
    if (useCredit) {
      const user = await prisma.user.findUnique({ where: { id: session.id } });
      creditUsedKobo = Math.min(user.creditBalance, subtotalKobo);
    }
    const totalKobo = subtotalKobo - creditUsedKobo;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: session.id,
          totalKobo,
          creditUsedKobo,
          status: totalKobo === 0 ? 'PAID' : 'PENDING',
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceKobo: item.product.priceKobo,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      if (creditUsedKobo > 0) {
        await tx.user.update({
          where: { id: session.id },
          data: { creditBalance: { decrement: creditUsedKobo } },
        });
        await tx.creditTransaction.create({
          data: { userId: session.id, amountKobo: -creditUsedKobo, reason: `Applied to order #${created.id.slice(0, 8)}` },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId: session.id } });

      return created;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Something went wrong placing your order.' }, { status: 500 });
  }
}

export async function GET(request) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);

  if (!session) {
    return NextResponse.json({ error: 'Login required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const isAdminView = searchParams.get('admin') === 'true' && session.role === 'ADMIN';

  const orders = await prisma.order.findMany({
    where: isAdminView ? undefined : { userId: session.id },
    include: {
      items: { include: { product: true } },
      user: isAdminView,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}
