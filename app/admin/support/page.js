'use client';

import { Fragment, useEffect, useState } from 'react';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    fetch('/api/support')
      .then((res) => res.json())
      .then((data) => {
        if (data.tickets) setTickets(data.tickets);
        else setError(data.error || 'Something went wrong.');
      })
      .catch(() => setError('Something went wrong loading tickets.'));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/support/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Support Tickets</h1>
      {error && <p className="auth-error">{error}</p>}

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr><th>From</th><th>Subject</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {tickets?.map((t) => (
              <Fragment key={t.id}>
                <tr>
                  <td>{t.name} <span style={{ color: 'rgba(23,20,15,.4)', fontSize: 11 }}>({t.email})</span></td>
                  <td>{t.subject}</td>
                  <td>
                    <select
                      value={t.status}
                      onChange={(e) => updateStatus(t.id, e.target.value)}
                      className="admin-status-select"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="admin-table-actions">
                    <button onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                      {expanded === t.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expanded === t.id && (
                  <tr>
                    <td colSpan={4} className="admin-ticket-detail">{t.message}</td>
                  </tr>
                )}
              </Fragment>
            ))}
            {tickets?.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'rgba(23,20,15,.5)' }}>No support tickets yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
