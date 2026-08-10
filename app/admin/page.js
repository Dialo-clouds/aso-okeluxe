'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function formatNaira(kobo) {
  return '₦' + (kobo / 100).toLocaleString();
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError('Something went wrong loading the dashboard.'));
  }, []);

  if (error) return <div className="admin-main"><p className="auth-error">{error}</p></div>;
  if (!stats) return <div className="admin-main"><p>Loading dashboard...</p></div>;

  return (
    <div className="admin-shell">
      {/* SIDEBAR - Matches your existing CSS */}
      <div className="admin-sidebar">
        <div className="admin-logo">AsoOke<span>Luxe</span></div>
        <div className="admin-logo-tag">Admin</div>
        
        <div className="admin-nav">
          <Link href="/admin" className="active">Overview</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/vendors">Vendors</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/credits">Credits</Link>
          <Link href="/admin/support">Support</Link>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user">Admin</div>
          <button className="admin-logout-btn">Log Out</button>
          <Link href="/" className="admin-back-link">← Back to site</Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main">
        
        <div className="admin-page-header">
          <h1 className="admin-title">Overview</h1>
        </div>

        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Total Revenue (Paid)</div>
            <div className="admin-stat-value">{formatNaira(stats.totalRevenueKobo)}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Total Orders</div>
            <div className="admin-stat-value">{stats.totalOrders}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Pending Payment</div>
            <div className="admin-stat-value">{stats.pendingOrders}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Products / Vendors</div>
            <div className="admin-stat-value">{stats.totalProducts} / {stats.totalVendors}</div>
          </div>
        </div>

        <div className="admin-chart-grid">
          <div className="admin-panel">
            <div className="admin-panel-title">Revenue — Last 14 Days</div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,20,15,.08)" />
                <XAxis dataKey="date" fontSize={11} stroke="rgba(23,20,15,.4)" />
                <YAxis fontSize={11} stroke="rgba(23,20,15,.4)" />
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="#96392B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-title">Top Products by Units Sold</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,20,15,.08)" />
                <XAxis type="number" fontSize={11} stroke="rgba(23,20,15,.4)" />
                <YAxis type="category" dataKey="name" width={140} fontSize={10} stroke="rgba(23,20,15,.4)" />
                <Tooltip />
                <Bar dataKey="unitsSold" fill="#B8944F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-title-row">
            <div className="admin-panel-title">Recent Orders</div>
            <Link href="/admin/orders" className="admin-panel-link">View all →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id.slice(0, 8)}</td>
                  <td>{o.customerName}</td>
                  <td>{formatNaira(o.totalKobo)}</td>
                  <td><span className={`status-pill ${o.status.toLowerCase()}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}