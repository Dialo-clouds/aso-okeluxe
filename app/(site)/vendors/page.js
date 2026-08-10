'use client';

import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';
import { VENDORS } from '../../../lib/vendors';

export default function VendorsPage() {
  const { lang, t } = useLanguage();

  return (
    <section className="vendors-page" style={{ paddingTop: 160, minHeight: '100vh' }}>
      <div className="vendors-head reveal in">
        <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('vendors_page_eyebrow')}</div>
        <h2>{t('vendors_page_title')}</h2>
        <p>{t('vendors_page_sub')}</p>
      </div>

      <div className="vendors-grid reveal in">
        {VENDORS.map((v) => (
          <div className="vendor-card" key={v.id}>
            <div className="vendor-swatch" style={{ background: v.swatch }}></div>
            <div className="vendor-info">
              <div className="vendor-name-row">
                <div className="vendor-name">{v.name}</div>
                {v.verified && <span className="vendor-badge">{t('vendor_verified')}</span>}
              </div>
              <div className="vendor-location">{v.location}</div>
              <div className="vendor-specialty">{v.specialty[lang]}</div>
              <button className="btn-ghost vendor-shop-btn">{t('vendor_view_shop')}</button>
            </div>
          </div>
        ))}
      </div>

      <div className="vendors-apply reveal in">
        <h3>{t('vendors_apply_title')}</h3>
        <p>{t('vendors_apply_sub')}</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup"><button className="btn-primary">{t('vendors_apply_cta')}</button></Link>
          <Link href="/vendor"><button className="btn-ghost" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>{t('vendors_dash_link')}</button></Link>
        </div>
      </div>
    </section>
  );
}
