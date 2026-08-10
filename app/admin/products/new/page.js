'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '../../../../components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push('/admin/products');
      return true;
    }
    return false;
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">New Product</h1>
      <div className="admin-panel">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
      </div>
    </div>
  );
}
