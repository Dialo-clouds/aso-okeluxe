import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { getSessionFromCookies } from '../../../lib/auth';

export async function GET() {
  const vendors = await prisma.vendor.findMany({
    include: { products: true },
    orderBy: { createdAt: 'desc' },
  });
  const response = NextResponse.json({ vendors });
  response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
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
    const { name, location, specialty, verified } = body;
    if (!name) {
      return NextResponse.json({ error: 'Vendor name is required.' }, { status: 400 });
    }
    const vendor = await prisma.vendor.create({
      data: { name, location, specialty, verified: !!verified },
    });
    return NextResponse.json({ vendor }, { status: 201 });
  } catch (err) {
    console.error('Create vendor error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
