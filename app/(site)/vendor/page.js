'use client';

import VendorDash from '../../../components/VendorDash';
import { useLanguage } from '../../../components/LanguageContext';

export default function VendorPage() {
  const { t } = useLanguage();

  return (
    <section className="dash" style={{ paddingTop: 160, minHeight: '100vh' }}>
      <div className="dash-head reveal in">
        <div className="eyebrow">{t('dash_eyebrow')}</div>
        <h2>{t('dash_title')}</h2>
        <p>{t('dash_sub')}</p>
      </div>
      <VendorDash />

      <div className="vendor reveal in" style={{ background: 'transparent', paddingBottom: 0 }}>
        <div className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold-bright)' }}>{t('vendor_eyebrow')}</div>
        <h2 style={{ color: 'var(--paper)' }}>{t('vendor_title')}</h2>
        <p style={{ color: 'rgba(245,239,226,.6)' }}>{t('vendor_sub')}</p>
        <button className="btn-primary">{t('vendor_cta')}</button>
      </div>
    </section>
  );
}
