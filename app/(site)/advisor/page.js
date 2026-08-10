'use client';

import OccasionPicker from '../../../components/OccasionPicker';
import { useLanguage } from '../../../components/LanguageContext';

const STYLED_LOOKS = [
  "/products/18-model-black-grey-gele-outfit.jpg",
  "/products/19-model-brown-stripe-gele-outfit.jpg",
  "/products/20-couple-green-agbada-iro-buba.jpg",
];

export default function AdvisorPage() {
  const { t } = useLanguage();

  return (
    <section className="advisor" style={{ minHeight: '100vh', paddingTop: 160, display: 'block' }}>
      <div className="reveal in" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('advisor_eyebrow')}</div>
        <h2 style={{ fontSize: 'clamp(34px,5vw,52px)', margin: '16px 0 20px' }}>{t('advisor_page_title')}</h2>
        <p style={{ maxWidth: 560, margin: '0 auto' }}>{t('advisor_page_sub')}</p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto' }} className="reveal in">
        <OccasionPicker />
      </div>

      <div className="styled-looks reveal in">
        <div className="styled-looks-title">{t('styled_looks_title')}</div>
        <div className="styled-looks-grid">
          {STYLED_LOOKS.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} key={src} alt="Aso Oke styling reference" />
          ))}
        </div>
        <div className="styled-looks-note">{t('styled_looks_note')}</div>
      </div>

      <div className="advisor-note-box reveal in">
        <div className="note-title">{t('advisor_page_note_title')}</div>
        <p>{t('advisor_page_note')}</p>
      </div>
    </section>
  );
}
