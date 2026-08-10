import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { getSessionFromCookies } from '../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../lib/ratelimit';

export async function POST(request) {
  const { allowed } = await checkRateLimit('auth', getClientIp(request));
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute and try again.' }, { status: 429 });
  }

  try {
    const cookieStore = cookies();
    const session = getSessionFromCookies(cookieStore);
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        name,
        email,
        subject,
        message,
        userId: session?.id || undefined,
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err) {
    console.error('Create support ticket error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ tickets });
}
