import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { getCartIdentity, generateGuestId, GUEST_CART_COOKIE } from '../../../lib/cart';

export async function GET() {
  const cookieStore = cookies();
  const identity = getCartIdentity(cookieStore);

  let items = [];
  if (identity.userId) {
    items = await prisma.cartItem.findMany({
      where: { userId: identity.userId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
  } else if (identity.sessionId) {
    items = await prisma.cartItem.findMany({
      where: { sessionId: identity.sessionId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  const subtotalKobo = items.reduce((sum, item) => sum + item.product.priceKobo * item.quantity, 0);

  return NextResponse.json({ items, subtotalKobo });
}

export async function POST(request) {
  const cookieStore = cookies();
  const identity = getCartIdentity(cookieStore);

  try {
    const body = await request.json();
    const { productId } = body;
    const quantity = Math.max(1, parseInt(body.quantity, 10) || 1);

    if (!productId) {
      return NextResponse.json({ error: 'productId is required.' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    let guestId = identity.sessionId;
    let setNewGuestCookie = false;
    if (!identity.userId && !guestId) {
      guestId = generateGuestId();
      setNewGuestCookie = true;
    }

    const where = identity.userId
      ? { userId: identity.userId, productId }
      : { sessionId: guestId, productId };

    const existing = await prisma.cartItem.findFirst({ where });

    let item;
    if (existing) {
      item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          productId,
          quantity,
          userId: identity.userId || undefined,
          sessionId: identity.userId ? undefined : guestId,
        },
        include: { product: true },
      });
    }

    const response = NextResponse.json({ item }, { status: 201 });
    if (setNewGuestCookie) {
      response.cookies.set(GUEST_CART_COOKIE, guestId, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
  } catch (err) {
    console.error('Add to cart error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
