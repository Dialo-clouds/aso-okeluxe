'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { ADVISOR } from '../lib/advisorData';

const OCCASIONS = ['wedding', 'naming', 'chieftaincy', 'everyday'];

export default function OccasionPicker() {
  const { lang, t } = useLanguage();
  const [occasion, setOccasion] = useState('wedding');
  const [fading, setFading] = useState(false);

  const handlePick = (key) => {
    if (key === occasion) return;
    setFading(true);
    setTimeout(() => {
      setOccasion(key);
      setFading(false);
    }, 220);
  };

  const entry = ADVISOR[occasion];
  const data = entry[lang];

  return (
    <div className="advisor-card">
      <div className="occasion-row">
        {OCCASIONS.map((key) => (
          <button
            key={key}
            className={`occasion-btn ${occasion === key ? 'active' : ''}`}
            onClick={() => handlePick(key)}
          >
            {t('occasion_' + key)}
          </button>
        ))}
      </div>
      <div className={`advisor-fade ${fading ? 'fading' : ''}`}>
        <div className="prompt">{data.prompt}</div>
        <div className="swatch-row">
          {entry.colors.map((c, i) => (
            <div key={i} className="swatch" style={{ background: c }}></div>
          ))}
        </div>
        <div className="advisor-result">{data.result}</div>
        <div className="advisor-note">{data.note}</div>
        <div className="match-tag">{data.tag}</div>
      </div>
    </div>
  );
}
