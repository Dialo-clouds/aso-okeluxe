'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import { useLanguage } from '../../../components/LanguageContext';
import { PRODUCTS, SHOP_BANNER_IMAGE } from '../../../lib/products';

const FILTERS = [
  { key: 'all', labelKey: 'shop_filter_all' },
  { key: 'navy', labelKey: 'shop_filter_navy' },
  { key: 'purple', labelKey: 'shop_filter_purple' },
  { key: 'brown', labelKey: 'shop_filter_brown' },
  { key: 'gold', labelKey: 'shop_filter_gold' },
  { key: 'multicolor', labelKey: 'shop_filter_multicolor' },
];

function ShopContent() {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.weave === filter);
    if (query) {
      list = list.filter((p) => {
        const name = (p.name[lang] || p.name.en || '').toLowerCase();
        const tag = (p.tag[lang] || p.tag.en || '').toLowerCase();
        return name.includes(query) || tag.includes(query);
      });
    }
    return list;
  }, [filter, query, lang]);

  return (
    <section className="shop" style={{ paddingTop: 160, minHeight: '100vh' }}>
      <div className="shop-head reveal in">
        <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('shop_eyebrow')}</div>
        <h2>{t('shop_title')}</h2>
        <p>{t('shop_sub')}</p>
      </div>

      <div className="shop-banner reveal in">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SHOP_BANNER_IMAGE} alt="Aso Oke color range" />
      </div>

      {query && (
        <div style={{ textAlign: 'center', marginBottom: 24, fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: 'rgba(23,20,15,.55)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchParams.get('q')}"
        </div>
      )}

      <div className="shop-filters reveal in">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`shop-filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="shop-grid reveal in">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      <div className="trust-strip reveal in">
        <div className="trust-item">{t('trust1')}</div>
        <div className="trust-item">{t('trust2')}</div>
        <div className="trust-item">{t('trust3')}</div>
        <div className="trust-item">{t('trust4')}</div>
      </div>
    </section>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
