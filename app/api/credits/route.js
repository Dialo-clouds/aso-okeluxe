console.log('=== CART ROUTE FILE LOADED ===');

import { NextResponse } from 'next/server';

console.log('=== NextResponse imported ===');

let prisma, getCartIdentity, generateGuestId, GUEST_CART_COOKIE;

try {
  console.log('=== Trying to import prisma... ===');
  const prismaModule = await import('../../../lib/prisma');
  prisma = prismaModule.prisma;
  console.log('=== prisma imported OK ===');
} catch (e) {
  console.error('PRISMA IMPORT FAILED:', e.message);
}

try {
  console.log('=== Trying to import cart... ===');
  const cartModule = await import('../../../lib/cart');
  getCartIdentity = cartModule.getCartIdentity;
  generateGuestId = cartModule.generateGuestId;
  GUEST_CART_COOKIE = cartModule.GUEST_CART_COOKIE;
  console.log('=== cart imported OK ===');
} catch (e) {
  console.error('CART IMPORT FAILED:', e.message);
}

export async function GET() {
  console.log('=== GET handler called ===');
  return NextResponse.json({ items: [], subtotalKobo: 0 });
}

export async function POST(request) {
  console.log('=== POST handler called ===');
  try {
    const body = await request.json();
    return NextResponse.json({ received: body }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}