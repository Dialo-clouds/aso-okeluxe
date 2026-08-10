'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function formatNaira(kobo) {
  return '₦' + (kobo / 100).toLocaleString();
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setError('Something went wrong loading products.'));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) load();
    else alert('Could not delete this product.');
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Products</h1>
        <Link href="/admin/products/new"><button className="btn-primary">+ New Product</button></Link>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Weave</th><th>Price</th><th>Vendor</th><th></th></tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.weave || '—'}</td>
                <td>{formatNaira(p.priceKobo)}</td>
                <td>{p.vendor?.name || '—'}</td>
                <td className="admin-table-actions">
                  <Link href={`/admin/products/${p.id}/edit`}>Edit</Link>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {products?.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(23,20,15,.5)' }}>No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
