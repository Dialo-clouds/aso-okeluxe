import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { getCartIdentity } from '../../../../lib/cart';

async function assertOwnership(itemId, identity) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) return null;
  if (identity.userId && item.userId === identity.userId) return item;
  if (identity.sessionId && item.sessionId === identity.sessionId) return item;
  return null;
}

export async function PATCH(request, { params }) {
  const cookieStore = cookies();
  const identity = getCartIdentity(cookieStore);
  const owned = await assertOwnership(params.itemId, identity);
  if (!owned) {
    return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const quantity = Math.max(1, parseInt(body.quantity, 10) || 1);
    const item = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity },
      include: { product: true },
    });
    return NextResponse.json({ item });
  } catch (err) {
    console.error('Update cart item error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const cookieStore = cookies();
  const identity = getCartIdentity(cookieStore);
  const owned = await assertOwnership(params.itemId, identity);
  if (!owned) {
    return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
  }

  try {
    await prisma.cartItem.delete({ where: { id: params.itemId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Remove cart item error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
