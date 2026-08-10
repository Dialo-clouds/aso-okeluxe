'use client';

import Link from 'next/link';
import SwatchFan from '../../components/SwatchFan';
import ProductCard from '../../components/ProductCard';
import VendorDash from '../../components/VendorDash';
import { useLanguage } from '../../components/LanguageContext';
import { PRODUCTS } from '../../lib/products';

export default function HomePage() {
  const { t } = useLanguage();
  const previewProducts = PRODUCTS.slice(0, 8);

  return (
    <>
      <section className="hero-banner">
        <div className="hero-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/products/20-couple-green-agbada-iro-buba-upscaled.jpg" alt="Couple wearing Aso Oke" />
          <div className="hero-media-grain"></div>
        </div>
        <div className="hero-content-panel">
          <div className="eyebrow">{t('hero_eyebrow')}</div>
          <h1>{t('hero_title_word1')} {t('hero_title_word2')} <em>{t('hero_title_word3')}</em></h1>
          <p className="sub">{t('hero_sub')}</p>
          <div className="hero-ctas">
            <a href="#shop-preview"><button className="btn-primary">{t('hero_cta1')}</button></a>
            <Link href="/shop"><button className="btn-ghost">{t('hero_cta2')}</button></Link>
          </div>
          <div className="hero-trust-row">
            <span>{t('trust1')}</span>
            <span>{t('trust2')}</span>
            <span>{t('trust3')}</span>
          </div>
        </div>
      </section>

      <section className="shop" id="shop-preview" style={{ paddingTop: 60 }}>
        <div className="shop-head reveal in">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('shop_eyebrow')}</div>
          <h2>{t('shop_title')}</h2>
          <p>{t('shop_sub')}</p>
        </div>
        <div className="shop-grid reveal in">
          {previewProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 46 }} className="reveal in">
          <Link href="/shop"><button className="btn-ghost" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>{t('shop_view_all')}</button></Link>
        </div>
        <div className="trust-strip reveal in">
          <div className="trust-item">{t('trust1')}</div>
          <div className="trust-item">{t('trust2')}</div>
          <div className="trust-item">{t('trust3')}</div>
          <div className="trust-item">{t('trust4')}</div>
        </div>
      </section>

      <div className="statbar">
        <div className="stat reveal"><div className="num">4″</div><div className="label">{t('stat1')}</div></div>
        <div className="stat reveal"><div className="num">8–14</div><div className="label">{t('stat2')}</div></div>
        <div className="stat reveal"><div className="num">2–3 wks</div><div className="label">{t('stat3')}</div></div>
        <div className="stat reveal"><div className="num">3</div><div className="label">{t('stat4')}</div></div>
      </div>

      <section className="weaves" id="weaves">
        <div className="weaves-head reveal">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('weaves_eyebrow')}</div>
          <h2>{t('weaves_title')}</h2>
          <p>{t('weaves_sub')}</p>
        </div>
        <div className="strip-row reveal">
          <div className="strip sanyan">
            <div className="strip-name">{t('weave1_name')}</div>
            <h3>{t('weave1_title')}</h3>
            <p>{t('weave1_desc')}</p>
          </div>
          <div className="strip alaari">
            <div className="strip-name">{t('weave2_name')}</div>
            <h3>{t('weave2_title')}</h3>
            <p>{t('weave2_desc')}</p>
          </div>
          <div className="strip etu">
            <div className="strip-name">{t('weave3_name')}</div>
            <h3>{t('weave3_title')}</h3>
            <p>{t('weave3_desc')}</p>
          </div>
        </div>
      </section>

      <section className="featured" id="featured">
        <div className="featured-copy reveal">
          <div className="eyebrow">{t('featured_eyebrow')}</div>
          <h2>{t('featured_title')}</h2>
          <p>{t('featured_sub')}</p>
          <div className="hint">{t('featured_hint')}</div>
        </div>
        <div className="fan-wrap reveal">
          <SwatchFan />
        </div>
      </section>

      <section className="advisor" id="advisor">
        <div className="reveal">
          <div className="eyebrow">{t('advisor_eyebrow')}</div>
          <h2>{t('advisor_title_pre')}<em>{t('advisor_title_em')}</em>{t('advisor_title_post')}</h2>
          <p>{t('advisor_sub')}</p>
          <Link href="/advisor">
            <button className="btn-ghost" style={{ borderColor: 'rgba(245,239,226,.3)' }}>{t('advisor_cta')}</button>
          </Link>
        </div>
        <div className="advisor-card reveal">
          <div className="prompt">// occasion: traditional wedding, 200 guests</div>
          <div className="swatch-row">
            <div className="swatch" style={{ background: '#96392B' }}></div>
            <div className="swatch" style={{ background: '#B8944F' }}></div>
            <div className="swatch" style={{ background: '#D7C7A0' }}></div>
          </div>
          <div className="advisor-result">Aláàrí + Antique Gold + Sànyán</div>
          <div className="advisor-note">Warm-dominant pairing. Gold thread bridges the red and beige so the aso-ebi photographs cohesively in both daylight and indoor lighting.</div>
          <div className="match-tag">96% MATCH CONFIDENCE</div>
        </div>
      </section>

      <section className="dash">
        <div className="dash-head reveal">
          <div className="eyebrow">{t('dash_eyebrow')}</div>
          <h2>{t('dash_title')}</h2>
          <p>{t('dash_sub')}</p>
        </div>
        <VendorDash />
      </section>

      <section className="vendor reveal" id="vendor">
        <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('vendor_eyebrow')}</div>
        <h2>{t('vendor_title')}</h2>
        <p>{t('vendor_sub')}</p>
        <Link href="/vendors">
          <button className="btn-primary" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>{t('vendor_cta')}</button>
        </Link>
      </section>
    </>
  );
}
