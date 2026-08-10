import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyPassword, signSession, COOKIE_NAME } from '../../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../../lib/ratelimit';

export async function POST(request) {
  try {
    const { allowed } = await checkRateLimit('auth', getClientIp(request));
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a minute and try again.' }, { status: 429 });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

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
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
