'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';
import { useAuth } from '../../../components/AuthContext';

export default function SignupPage() {
  const { t } = useLanguage();
  const { refresh } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      await refresh();
      router.push('/');
    } catch (err) {
      setError('Network error — please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t('auth_signup_title')}</h1>
        <div className="sub">{t('auth_signup_sub')}</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t('auth_name')}</label>
            <input type="text" placeholder="Adaeze Okafor" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t('auth_email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t('auth_password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '...' : t('auth_submit_signup')}
          </button>
        </form>
        <div className="auth-switch">
          <Link href="/login">{t('auth_switch_to_signin')}</Link>
        </div>
      </div>
    </div>
  );
}
