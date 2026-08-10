'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

export default function Nav() {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop');
  };

  return (
    <>
      <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="wordmark" style={{ textDecoration: 'none', color: 'inherit' }}>
          ASO OKE <span>LUXE</span>
        </Link>
        <div className="nav-links">
          <Link href="/#weaves">{t('nav_weaves')}</Link>
          <Link href="/#featured">{t('nav_featured')}</Link>
          <Link href="/shop">{t('nav_shop')}</Link>
          <Link href="/advisor">{t('nav_advisor')}</Link>
          <Link href="/vendors">{t('nav_vendor')}</Link>
          <Link href="/support">Support</Link>
          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={t('hero_search_placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">{t('hero_search_cta')}</button>
          </form>
          <div className="lang-toggle">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'yo' ? 'active' : ''} onClick={() => setLang('yo')}>YO</button>
          </div>
          <Link href="/cart" className="nav-cart-link">
            <span>Bag</span>
            {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
          </Link>
          {user ? (
            <div className="nav-account">
              <span className="nav-account-name">{user.name.split(' ')[0]}</span>
              <button className="btn-signin" onClick={logout}>Log Out</button>
            </div>
          ) : (
            <Link href="/login">
              <button className="btn-signin">{t('nav_signin')}</button>
            </Link>
          )}
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-panel ${mobileOpen ? 'open' : ''}`}>
        <form className="nav-search" onSubmit={(e) => { handleSearch(e); closeMobile(); }} style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder={t('hero_search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">{t('hero_search_cta')}</button>
        </form>
        <Link href="/#weaves" onClick={closeMobile}>{t('nav_weaves')}</Link>
        <Link href="/#featured" onClick={closeMobile}>{t('nav_featured')}</Link>
        <Link href="/shop" onClick={closeMobile}>{t('nav_shop')}</Link>
        <Link href="/advisor" onClick={closeMobile}>{t('nav_advisor')}</Link>
        <Link href="/vendors" onClick={closeMobile}>{t('nav_vendor')}</Link>
        <Link href="/support" onClick={closeMobile}>Support</Link>
        <Link href="/cart" onClick={closeMobile}>Bag {itemCount > 0 ? `(${itemCount})` : ''}</Link>
        {user ? (
          <button className="btn-signin" style={{ marginTop: 10 }} onClick={() => { logout(); closeMobile(); }}>Log Out ({user.name.split(' ')[0]})</button>
        ) : (
          <Link href="/login" onClick={closeMobile}>
            <button className="btn-signin" style={{ marginTop: 10 }}>{t('nav_signin')}</button>
          </Link>
        )}
        <button className="hamburger" style={{ position: 'absolute', top: 26, right: '6vw' }} onClick={closeMobile} aria-label="Close menu">
          <span style={{ width: 22 }}></span>
        </button>
      </div>
    </>
  );
}
