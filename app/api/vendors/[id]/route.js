import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { getSessionFromCookies } from '../../../../lib/auth';

export async function PATCH(request, { params }) {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ vendor });
  } catch (err) {
    console.error('Update vendor error:', err);
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
    await prisma.vendor.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete vendor error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
