'use client';

import Link from 'next/link';
import { useCart } from '../../../components/CartContext';

function formatNaira(kobo) {
  return '₦' + (kobo / 100).toLocaleString();
}

export default function CartPage() {
  const { items, subtotalKobo, updateItem, removeItem, loading } = useCart();

  if (loading) {
    return (
      <section className="cart-page">
        <p style={{ textAlign: 'center' }}>Loading your bag...</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="cart-page cart-empty">
        <h2>Your bag is empty.</h2>
        <p>Explore the collection and add a piece you love.</p>
        <Link href="/shop"><button className="btn-primary">Browse the Shop</button></Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2 className="cart-title">Your Bag</h2>
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.id}>
            <div
              className="cart-row-swatch"
              style={
                item.product.image
                  ? { backgroundImage: `url(${item.product.image})` }
                  : { background: 'var(--gold-bright)' }
              }
            ></div>
            <div className="cart-row-info">
              <div className="cart-row-name">{item.product.name}</div>
              <div className="cart-row-price">{formatNaira(item.product.priceKobo)}</div>
            </div>
            <div className="cart-row-qty">
              <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
            </div>
            <div className="cart-row-linetotal">{formatNaira(item.product.priceKobo * item.quantity)}</div>
            <button className="cart-row-remove" onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-summary-row cart-summary-total">
          <span>Subtotal</span>
          <span>{formatNaira(subtotalKobo)}</span>
        </div>
        <Link href="/checkout">
          <button className="btn-primary" style={{ width: '100%', marginTop: 20 }}>Proceed to Checkout</button>
        </Link>
      </div>
    </section>
  );
}
