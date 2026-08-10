'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '../../../../../components/admin/ProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) setProduct(data.product);
        else setError(data.error || 'Product not found.');
      })
      .catch(() => setError('Something went wrong.'));
  }, [id]);

  const handleSubmit = async (data) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push('/admin/products');
      return true;
    }
    return false;
  };

  if (error) return <div className="admin-page"><p className="auth-error">{error}</p></div>;
  if (!product) return <div className="admin-page"><p>Loading...</p></div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Edit Product</h1>
      <div className="admin-panel">
        <ProductForm initial={product} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
