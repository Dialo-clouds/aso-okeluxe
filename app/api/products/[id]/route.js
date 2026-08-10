import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { getSessionFromCookies } from '../../../../lib/auth';

export async function GET(request, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { vendor: true },
  });
  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(request, { params }) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ product });
  } catch (err) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
