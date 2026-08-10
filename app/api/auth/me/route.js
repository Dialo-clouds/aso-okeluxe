import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionFromCookies } from '../../../../lib/auth';

export async function GET() {
  const cookieStore = cookies();
  const session = getSessionFromCookies(cookieStore);
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: { id: session.id, name: session.name, email: session.email, role: session.role },
  });
}
