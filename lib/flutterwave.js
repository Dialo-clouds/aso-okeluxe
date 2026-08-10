// Flutterwave v4 integration.
//
// IMPORTANT: v4 is a public beta API. The OAuth token exchange below is
// documented and stable. The PWBT (Pay With Bank Transfer) charge-creation
// endpoint and payload shape are based on Flutterwave's published guides as
// of when this was built — double check the current endpoint/payload against
// https://developer.flutterwave.com/v4/docs before going live, since beta
// APIs can change. This has not been tested against a live sandbox from this
// environment (no network access here) — test it yourself before relying on it.

const FLW_IDP_URL = 'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';
const FLW_API_BASE = 'https://api.flutterwave.com/v4';

let cachedToken = null;
let cachedTokenExpiry = 0;

export async function getFlutterwaveAccessToken() {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiry - 30_000) {
    return cachedToken;
  }

  const clientId = process.env.FLW_CLIENT_ID;
  const clientSecret = process.env.FLW_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('FLW_CLIENT_ID and FLW_CLIENT_SECRET must be set in .env');
  }

  const res = await fetch(FLW_IDP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Flutterwave OAuth token request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  cachedTokenExpiry = now + (data.expires_in ? data.expires_in * 1000 : 10 * 60 * 1000);
  return cachedToken;
}

/**
 * Creates a Pay With Bank Transfer charge for an order.
 * Returns the virtual account details the customer should transfer money to.
 */
export async function createBankTransferCharge({ orderId, amountKobo, currency = 'NGN', customerEmail, customerName }) {
  const token = await getFlutterwaveAccessToken();
  const amountNaira = amountKobo / 100;

  const res = await fetch(`${FLW_API_BASE}/charges`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Trace-Id': `asookeluxe-${orderId}-${Date.now()}`,
      'X-Idempotency-Key': `order-${orderId}`,
    },
    body: JSON.stringify({
      currency,
      customer: {
        email: customerEmail,
        name: customerName,
      },
      payment_method: {
        type: 'bank_transfer',
      },
      amount: amountNaira,
      reference: orderId,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Flutterwave charge creation failed (${res.status}): ${JSON.stringify(data)}`);
  }

  return data;
}

export async function getChargeStatus(chargeId) {
  const token = await getFlutterwaveAccessToken();
  const res = await fetch(`${FLW_API_BASE}/charges/${chargeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Flutterwave charge status check failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}
