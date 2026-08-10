'use client';

import { useLanguage } from './LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer>
      <div className="wordmark">ASO OKE <span>LUXE</span></div>
      <div>{t('footer_text')}</div>
    </footer>
  );
}
