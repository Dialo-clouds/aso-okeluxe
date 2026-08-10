'use client';

import { useEffect, useState } from 'react';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch('/api/vendors')
      .then((res) => res.json())
      .then((data) => setVendors(data.vendors || []))
      .catch(() => setError('Something went wrong loading vendors.'));
  };

  useEffect(load, []);

  const toggleVerified = async (vendor) => {
    const res = await fetch(`/api/vendors/${vendor.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: !vendor.verified }),
    });
    if (res.ok) load();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location, specialty, verified: false }),
    });
    setSaving(false);
    if (res.ok) {
      setName(''); setLocation(''); setSpecialty('');
      setShowForm(false);
      load();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Vendors</h1>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New Vendor'}
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {showForm && (
        <div className="admin-panel" style={{ marginBottom: 24 }}>
          <form onSubmit={handleCreate} className="admin-form">
            <div className="field"><label>Vendor Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="field"><label>Location</label><input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <div className="field"><label>Specialty</label><input value={specialty} onChange={(e) => setSpecialty(e.target.value)} /></div>
            <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Vendor'}</button>
          </form>
        </div>
      )}

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Location</th><th>Specialty</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {vendors?.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.location || '—'}</td>
                <td>{v.specialty || '—'}</td>
                <td>
                  <span className={`status-pill ${v.verified ? 'paid' : 'pending'}`}>
                    {v.verified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="admin-table-actions">
                  <button onClick={() => toggleVerified(v)}>
                    {v.verified ? 'Unverify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
            {vendors?.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(23,20,15,.5)' }}>No vendors yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
