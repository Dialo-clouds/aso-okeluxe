'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/vendors', label: 'Vendors' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/credits', label: 'Credits' },
  { href: '/admin/support', label: 'Support' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Hide ONLY the main site nav by its ID, plus grain/cursor/footer
    const mainNav = document.getElementById('mainNav');
    const grain = document.querySelector('.grain');
    const cursor = document.getElementById('cRing');
    const cursorDot = document.getElementById('cDot');
    const footer = document.querySelector('footer');

    if (mainNav) mainNav.style.display = 'none';
    if (grain) grain.style.display = 'none';
    if (cursor) cursor.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      if (mainNav) mainNav.style.display = '';
      if (grain) grain.style.display = '';
      if (cursor) cursor.style.display = '';
      if (cursorDot) cursorDot.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          ASO OKE <span>LUXE</span>
          <div className="admin-logo-tag">Admin</div>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">{user?.name || 'Admin'}</div>
          <button className="admin-logout-btn" onClick={logout}>Log Out</button>
          <Link href="/" className="admin-back-link">← Back to site</Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}