import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { getSessionFromCookies } from '../../../lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const weave = searchParams.get('weave');

  const products = await prisma.product.findMany({
    where: weave && weave !== 'all' ? { weave } : undefined,
    include: { vendor: true },
    orderBy: { createdAt: 'desc' },
  });

  const response = NextResponse.json({ products });
  // Product listings don't change every second — cache at the edge for 60s,
  // serve stale for up to 5 minutes while revalidating in the background.
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return response;
}

export async function POST(request) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, nameYo, tag, weave, priceKobo, image, vendorId } = body;

    if (!name || !priceKobo) {
      return NextResponse.json({ error: 'Name and price are required.' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { name, nameYo, tag, weave, priceKobo, image, vendorId: vendorId || null },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
