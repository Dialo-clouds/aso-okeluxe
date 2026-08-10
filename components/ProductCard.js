'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { useCart } from './CartContext';

export default function ProductCard({ product }) {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();
  const [status, setStatus] = useState('idle'); // idle | adding | added | error
  const price = typeof product.price === 'object' ? product.price[lang] : product.price;
  const isBespoke = typeof product.price === 'object';

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('adding');
    const ok = await addItem(product.id, 1);
    setStatus(ok ? 'added' : 'error');
    setTimeout(() => setStatus('idle'), 1600);
  };

  return (
    <div className="product-card">
      <div className="product-swatch" style={!product.image ? { background: product.bg } : undefined}>
        {product.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name[lang]} className="product-photo" />
        )}
        <div className="product-overlay"><span>{t('product_view')}</span></div>
      </div>
      <div className="product-info">
        <div className="product-tag">{product.tag[lang]}</div>
        <div className="product-name">{product.name[lang]}</div>
        <div className="product-price">{price}</div>
        {isBespoke ? (
          <Link href="/advisor">
            <button className="add-to-cart-btn">Start with Àrò</button>
          </Link>
        ) : (
          <button className="add-to-cart-btn" onClick={handleAdd} disabled={status === 'adding'}>
            {status === 'added' ? 'Added ✓' : status === 'error' ? 'Try again' : status === 'adding' ? 'Adding...' : 'Add to Bag'}
          </button>
        )}
      </div>
    </div>
  );
}
