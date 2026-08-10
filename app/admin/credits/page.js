'use client';

import { useEffect, useState } from 'react';

function formatNaira(kobo) {
  return '₦' + (kobo / 100).toLocaleString();
}

export default function AdminCreditsPage() {
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [amountNaira, setAmountNaira] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    fetch('/api/credits?admin=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTransactions(data.transactions);
        else setError(data.error || 'Something went wrong.');
      })
      .catch(() => setError('Something went wrong loading transactions.'));
  };

  useEffect(load, []);

  const handleGrant = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amountKobo: Math.round(parseFloat(amountNaira) * 100),
          reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Something went wrong.');
        setSaving(false);
        return;
      }
      setSuccess(`Credit updated for ${email}.`);
      setEmail(''); setAmountNaira(''); setReason('');
      load();
    } catch (err) {
      setFormError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Credits & Wallet</h1>

      <div className="admin-panel" style={{ marginBottom: 24 }}>
        <div className="admin-panel-title">Grant or Adjust Credit</div>
        <p style={{ fontSize: 13, color: 'rgba(23,20,15,.55)', marginBottom: 16 }}>
          Use a negative amount to deduct credit (e.g. correcting a mistaken grant).
        </p>
        {formError && <div className="auth-error">{formError}</div>}
        {success && <div className="admin-success">{success}</div>}
        <form onSubmit={handleGrant} className="admin-form admin-form-inline">
          <div className="field"><label>Customer Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="field"><label>Amount (₦, use negative to deduct)</label><input type="number" step="1" value={amountNaira} onChange={(e) => setAmountNaira(e.target.value)} required /></div>
          <div className="field"><label>Reason</label><input value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="e.g. Refund for damaged item" /></div>
          <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Apply'}</button>
        </form>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="admin-panel">
        <div className="admin-panel-title">Recent Transactions</div>
        <table className="admin-table">
          <thead>
            <tr><th>Customer</th><th>Amount</th><th>Reason</th><th>Date</th></tr>
          </thead>
          <tbody>
            {transactions?.map((t) => (
              <tr key={t.id}>
                <td>{t.user?.name} <span style={{ color: 'rgba(23,20,15,.4)', fontSize: 11 }}>({t.user?.email})</span></td>
                <td style={{ color: t.amountKobo < 0 ? 'var(--alaari)' : 'inherit', fontWeight: 600 }}>
                  {t.amountKobo < 0 ? '−' : '+'}{formatNaira(Math.abs(t.amountKobo))}
                </td>
                <td>{t.reason}</td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {transactions?.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'rgba(23,20,15,.5)' }}>No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
