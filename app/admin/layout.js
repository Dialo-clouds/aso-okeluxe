'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { useState } from 'react';

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-shell">
      {/* Mobile hamburger */}
      <button className="admin-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>

      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          ASO OKE <span>LUXE</span>
          <div className="admin-logo-tag">Admin</div>
        </div>
        <nav className="admin-nav" onClick={() => setMenuOpen(false)}>
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