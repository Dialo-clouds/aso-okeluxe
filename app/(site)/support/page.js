'use client';

import { useState } from 'react';
import { useAuth } from '../../../components/AuthContext';

export default function SupportPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError('Network error — please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <section className="support-page">
      <div className="support-head">
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Customer Care</div>
        <h2>How can we help?</h2>
        <p>Questions about an order, a piece, or a vendor — send us a note and we'll get back to you.</p>
      </div>

      {status === 'sent' ? (
        <div className="support-success">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Message Sent</div>
          <p>Thank you — we've received your message and will respond to your email soon.</p>
          <button className="btn-ghost" style={{ borderColor: 'var(--line)', color: 'var(--ink)', marginTop: 20 }} onClick={() => setStatus('idle')}>
            Send Another Message
          </button>
        </div>
      ) : (
        <form className="support-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="field">
            <label>Your Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g. Question about my order" />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} />
          </div>
          <button className="auth-submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </section>
  );
}
