import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { hashPassword, signSession, COOKIE_NAME } from '../../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../../lib/ratelimit';

export async function POST(request) {
  try {
    const { allowed } = await checkRateLimit('auth', getClientIp(request));
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a minute and try again.' }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = signSession(user);
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
