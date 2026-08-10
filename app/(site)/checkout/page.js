'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';

function formatNaira(kobo) {
  return '₦' + (kobo / 100).toLocaleString();
}

export default function CheckoutPage() {
  const { items, subtotalKobo, refresh } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [creditBalanceKobo, setCreditBalanceKobo] = useState(0);
  const [useCredit, setUseCredit] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch('/api/credits')
      .then((res) => res.json())
      .then((data) => setCreditBalanceKobo(data.creditBalanceKobo || 0))
      .catch(() => setCreditBalanceKobo(0));
  }, [user]);

  if (!authLoading && !user) {
    return (
      <section className="checkout-page checkout-empty">
        <h2>Please sign in to check out</h2>
        <p>Your bag is saved — sign in or create an account to continue.</p>
        <Link href="/login?redirect=/checkout"><button className="btn-primary">Sign In</button></Link>
      </section>
    );
  }

  if (!authLoading && items.length === 0 && !placing) {
    return (
      <section className="checkout-page checkout-empty">
        <h2>Your bag is empty</h2>
        <Link href="/shop"><button className="btn-primary">Browse the Shop</button></Link>
      </section>
    );
  }

  const creditToApply = useCredit ? Math.min(creditBalanceKobo, subtotalKobo) : 0;
  const totalAfterCredit = subtotalKobo - creditToApply;

  const handlePlaceOrder = async () => {
    setError('');
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useCredit }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong placing your order.');
        setPlacing(false);
        return;
      }
      await refresh();
      router.push(`/orders/${data.order.id}`);
    } catch (err) {
      setError('Network error — please check your connection and try again.');
      setPlacing(false);
    }
  };

  return (
    <section className="checkout-page">
      <h2 className="cart-title">Checkout</h2>
      <p className="checkout-note">
        {totalAfterCredit === 0
          ? 'Your store credit covers this order in full — no payment needed.'
          : "Pay by bank transfer on the next screen once you place your order."}
      </p>
      {error && <div className="auth-error">{error}</div>}

      <div className="cart-summary">
        {items.map((item) => (
          <div className="cart-summary-row" key={item.id}>
            <span>{item.product.name} × {item.quantity}</span>
            <span>{formatNaira(item.product.priceKobo * item.quantity)}</span>
          </div>
        ))}
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{formatNaira(subtotalKobo)}</span>
        </div>

        {creditBalanceKobo > 0 && (
          <label className="checkout-credit-row">
            <span>
              <input type="checkbox" checked={useCredit} onChange={(e) => setUseCredit(e.target.checked)} />
              {' '}Use store credit ({formatNaira(creditBalanceKobo)} available)
            </span>
            {useCredit && <span>−{formatNaira(creditToApply)}</span>}
          </label>
        )}

        <div className="cart-summary-row cart-summary-total">
          <span>Total{totalAfterCredit === 0 ? '' : ' (Due)'}</span>
          <span>{formatNaira(totalAfterCredit)}</span>
        </div>
      </div>

      <button className="btn-primary" style={{ width: '100%' }} onClick={handlePlaceOrder} disabled={placing}>
        {placing ? 'Placing order...' : 'Place Order'}
      </button>
    </section>
  );
}
