import crypto from 'crypto';
import { getSessionFromCookies } from './auth';

export const GUEST_CART_COOKIE = 'asookeluxe_cart_session';

export function getCartIdentity(cookieStore) {
  const session = getSessionFromCookies(cookieStore);
  if (session) {
    return { userId: session.id, sessionId: null };
  }
  const guestId = cookieStore.get(GUEST_CART_COOKIE)?.value || null;
  return { userId: null, sessionId: guestId };
}

export function generateGuestId() {
  return crypto.randomBytes(16).toString('hex');
}
