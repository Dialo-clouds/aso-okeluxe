'use client';

import { useEffect, useState } from 'react';

function formatNaira(kobo) {
  return '₦' + (kobo / 100).toLocaleString();
}

const STATUS_OPTIONS = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/orders?admin=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        else setError(data.error || 'Something went wrong.');
      })
      .catch(() => setError('Something went wrong loading orders.'));
  };

  useEffect(load, []);

  const updateStatus = async (orderId, status) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Orders</h1>
      {error && <p className="auth-error">{error}</p>}
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders?.map((o) => (
              <tr key={o.id}>
                <td>#{o.id.slice(0, 8)}</td>
                <td>{o.user?.name || '—'}</td>
                <td>{o.items.length}</td>
                <td>{formatNaira(o.totalKobo)}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="admin-status-select"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders?.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(23,20,15,.5)' }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
