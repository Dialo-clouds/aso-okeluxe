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
    const ticket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    return NextResponse.json({ ticket });
  } catch (err) {
    console.error('Update support ticket error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
