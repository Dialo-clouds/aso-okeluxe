'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageContext';

const HEIGHTS = [26, 38, 24, 50, 44, 62, 74];
const LABELS = ['-6', '-5', '-4', '-3', '-2', '-1', '0'];

export default function VendorDash() {
  const { t } = useLanguage();
  const panelRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="dash-panel reveal" ref={panelRef}>
      <div className="dash-bar">
        <div className="dots"><span></span><span></span><span></span></div>
        <div className="title">VENDOR.ASOOKELUXE / DASHBOARD</div>
        <div style={{ width: 40 }}></div>
      </div>
      <div className="dash-stats">
        <div className="dash-stat"><div className="num">₦2.4M</div><div className="label">{t('dash_stat1')}</div></div>
        <div className="dash-stat"><div className="num">37</div><div className="label">{t('dash_stat2')}</div></div>
        <div className="dash-stat"><div className="num">112</div><div className="label">{t('dash_stat3')}</div></div>
      </div>
      <div className="dash-chart">
        {HEIGHTS.map((h, i) => (
          <div className="col" key={i}>
            <div className="bar" style={{ height: animated ? `${h}px` : '0px' }}></div>
            <div className="day">{LABELS[i]}</div>
          </div>
        ))}
      </div>
      <div className="dash-orders">
        <div className="dash-order-row head">
          <span>{t('dash-col1')}</span><span>{t('dash-col2')}</span><span>{t('dash-col3')}</span><span>{t('dash-col4')}</span>
        </div>
        <div className="dash-order-row"><span>#AOL-1042</span><span>Aláàrí Aso-Ebi Set (5pc)</span><span>T.A.</span><span className="status-pill paid">{t('dash-paid')}</span></div>
        <div className="dash-order-row"><span>#AOL-1041</span><span>Ẹ̀tù Agbada — Bespoke</span><span>K.O.</span><span className="status-pill shipped">{t('dash-shipped')}</span></div>
        <div className="dash-order-row"><span>#AOL-1040</span><span>Sànyán Wrapper</span><span>B.N.</span><span className="status-pill new">{t('dash-new')}</span></div>
        <div className="dash-order-row"><span>#AOL-1039</span><span>Gold-Thread Gele</span><span>F.A.</span><span className="status-pill paid">{t('dash-paid')}</span></div>
      </div>
    </div>
  );
}
