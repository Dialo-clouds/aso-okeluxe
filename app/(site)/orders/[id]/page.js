'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

function formatNaira(kobo) {
  return '₦' + (kobo / 100).toLocaleString();
}

// Flutterwave's exact response shape for a bank-transfer charge isn't fully
// confirmed against a live test from this environment — this tries a few
// likely paths and falls back to showing the raw response so nothing is
// silently hidden if the shape is different than expected.
function extractBankDetails(charge) {
  const candidates = [
    charge?.data?.meta?.authorization,
    charge?.meta?.authorization,
    charge?.data?.next_action?.payment_instruction,
    charge?.next_action?.payment_instruction,
    charge?.data,
  ].filter(Boolean);

  for (const c of candidates) {
    if (c && (c.account_number || c.accountNumber || c.bank_name || c.bankName)) {
      return {
        accountNumber: c.account_number || c.accountNumber,
        bankName: c.bank_name || c.bankName,
        expiresAt: c.expires_at || c.expiresAt,
      };
    }
  }
  return null;
}

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [charge, setCharge] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [initiating, setInitiating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const loadOrder = useCallback(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else setError(data.error || 'Order not found.');
      })
      .catch(() => setError('Something went wrong loading your order.'));
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const startPayment = async () => {
    setPaymentError('');
    setInitiating(true);
    try {
      const res = await fetch('/api/payments/flutterwave/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPaymentError(data.error || 'Could not start payment.');
        setInitiating(false);
        return;
      }
      setCharge(data.charge);
      setInitiating(false);
    } catch (err) {
      setPaymentError('Network error starting payment.');
      setInitiating(false);
    }
  };

  const checkPayment = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/payments/flutterwave/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();
      if (data.status === 'PAID') {
        loadOrder();
      } else {
        setPaymentError('Not confirmed yet — bank transfers can take a few minutes. Try again shortly.');
      }
    } catch (err) {
      setPaymentError('Network error checking payment.');
    } finally {
      setVerifying(false);
    }
  };

  if (error) {
    return <section className="checkout-page checkout-empty"><p>{error}</p></section>;
  }
  if (!order) {
    return <section className="checkout-page checkout-empty"><p>Loading your order...</p></section>;
  }

  const bankDetails = extractBankDetails(charge);

  return (
    <section className="checkout-page" style={{ textAlign: 'center' }}>
      <div className="eyebrow" style={{ justifyContent: 'center' }}>Order Confirmed</div>
      <h2 className="cart-title" style={{ marginTop: 12 }}>Order #{order.id.slice(0, 8)}</h2>
      <p className="checkout-note">Status: <strong>{order.status}</strong></p>

      <div className="cart-summary" style={{ textAlign: 'left' }}>
        {order.items.map((item) => (
          <div className="cart-summary-row" key={item.id}>
            <span>{item.product.name} × {item.quantity}</span>
            <span>{formatNaira(item.priceKobo * item.quantity)}</span>
          </div>
        ))}
        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span>{formatNaira(order.totalKobo)}</span>
        </div>
      </div>

      {order.status === 'PENDING' && (
        <div className="payment-box">
          {paymentError && <div className="auth-error">{paymentError}</div>}
          {!charge ? (
            <>
              <p className="checkout-note">Pay by bank transfer — we'll generate a one-time account number for this order.</p>
              <button className="btn-primary" onClick={startPayment} disabled={initiating}>
                {initiating ? 'Generating account...' : 'Get Bank Transfer Details'}
              </button>
            </>
          ) : bankDetails ? (
            <>
              <div className="payment-details">
                <div className="payment-details-row"><span>Bank</span><strong>{bankDetails.bankName}</strong></div>
                <div className="payment-details-row"><span>Account Number</span><strong>{bankDetails.accountNumber}</strong></div>
                <div className="payment-details-row"><span>Amount</span><strong>{formatNaira(order.totalKobo)}</strong></div>
              </div>
              <p className="checkout-note">Transfer the exact amount to the account above, then tap the button below.</p>
              <button className="btn-primary" onClick={checkPayment} disabled={verifying}>
                {verifying ? 'Checking...' : "I've Made the Transfer"}
              </button>
            </>
          ) : (
            <>
              <p className="checkout-note">
                Payment was started but the account details couldn't be read from Flutterwave's response in the expected format.
                This can happen with the v4 beta API — check the raw response below and compare against your Flutterwave dashboard.
              </p>
              <details style={{ textAlign: 'left', fontSize: 12, background: 'rgba(0,0,0,.04)', padding: 12, borderRadius: 6 }}>
                <summary style={{ cursor: 'pointer' }}>Raw Flutterwave response (debug)</summary>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(charge, null, 2)}</pre>
              </details>
              <button className="btn-primary" onClick={checkPayment} disabled={verifying} style={{ marginTop: 16 }}>
                {verifying ? 'Checking...' : 'Check Payment Status Anyway'}
              </button>
            </>
          )}
        </div>
      )}

      {order.status === 'PAID' && (
        <p className="checkout-note" style={{ color: 'var(--alaari)', fontWeight: 600 }}>Payment confirmed — thank you!</p>
      )}
    </section>
  );
}
