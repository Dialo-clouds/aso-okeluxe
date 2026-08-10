'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';
import { useAuth } from '../../../components/AuthContext';

function LoginForm() {
  const { t } = useLanguage();
  const { refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      await refresh();
      const redirectTarget = searchParams.get('redirect') || (data.user?.role === 'ADMIN' ? '/admin' : '/');
      router.push(redirectTarget);
    } catch (err) {
      setError('Network error — please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t('auth_signin_title')}</h1>
        <div className="sub">{t('auth_signin_sub')}</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t('auth_email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t('auth_password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '...' : t('auth_submit_signin')}
          </button>
        </form>
        <div className="auth-switch">
          <Link href="/signup">{t('auth_switch_to_signup')}</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
