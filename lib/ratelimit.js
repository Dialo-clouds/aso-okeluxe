import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let limiters = null;
let warnedOnce = false;

function getLimiters() {
  if (limiters) return limiters;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (!warnedOnce) {
      console.warn(
        'Rate limiting is DISABLED — UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set. ' +
          'This is fine for local dev, but set these up before real production traffic. See README.'
      );
      warnedOnce = true;
    }
    return null;
  }

  const redis = new Redis({ url, token });

  limiters = {
    // 5 attempts per minute per IP on login/signup — generous for a real user, tight for a brute-force script.
    auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m'), prefix: 'rl:auth' }),
    // 10 payment-initiation attempts per minute per IP.
    payment: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'), prefix: 'rl:payment' }),
  };
  return limiters;
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Returns { allowed: boolean, configured: boolean }.
 * If Upstash isn't configured, allowed is always true (fails open in dev,
 * but you should configure this before going live — see README).
 */
export async function checkRateLimit(bucket, identifier) {
  const active = getLimiters();
  if (!active || !active[bucket]) {
    return { allowed: true, configured: false };
  }
  const result = await active[bucket].limit(identifier);
  return { allowed: result.success, configured: true, remaining: result.remaining };
}
