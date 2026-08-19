'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useStore } from '@/lib/store';

export default function LoginScreen() {
  const { dispatch } = useStore();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    if (!email || !pass) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password: pass,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Try the demo account.');
        setLoading(false);
        return;
      }

      if (result?.ok) {
        dispatch({ type: 'SET_USER', user: { name: 'User', email } });
        dispatch({ type: 'SET_AUTHENTICATED', isAuthenticated: true });
        dispatch({ type: 'SET_SCREEN', screen: 'multiSite' });
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: process.env.NEXT_PUBLIC_TEST_ACCOUNT_EMAIL || 'test@cpsl.co.uk',
        password: process.env.NEXT_PUBLIC_TEST_ACCOUNT_PASSWORD || 'demo123456',
        redirect: false,
      });

      if (result?.ok) {
        dispatch({ type: 'SET_USER', user: { name: 'Demo User', email: process.env.NEXT_PUBLIC_TEST_ACCOUNT_EMAIL || 'test@cpsl.co.uk' } });
        dispatch({ type: 'SET_AUTHENTICATED', isAuthenticated: true });
        dispatch({ type: 'SET_SCREEN', screen: 'multiSite' });
      } else {
        setError('Demo login failed');
      }
    } catch (err) {
      setError('Demo login error');
      console.error('Demo login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(26,127,232,0.12) 0%, var(--bg) 65%)',
    }}>
      {/* Background grid lines */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(26,127,232,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,127,232,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, width: 400, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#fff' }}>C</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>CPSL Platform</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 0.8 }}>Cyber-Physical Security Layer</div>
          </div>
        </div>

        {/* IRE badge */}
        <div style={{ background: 'rgba(26,127,232,0.08)', border: '1px solid rgba(26,127,232,0.25)', borderRadius: 8, padding: '8px 12px', marginBottom: 28, fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🛡</span>
          <span>Incident Reconstruction Engine — TRL 7 Prototype · UK SME Security</span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 14px', outline: 'none', fontSize: 13 }}
            type="email"
            placeholder="you@cpsl.co.uk"
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
          <input
            value={pass}
            onChange={e => setPass(e.target.value)}
            style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 14px', outline: 'none', fontSize: 13 }}
            type="password"
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && login()}
          />
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, padding: '10px 12px', marginBottom: 16, fontSize: 12, color: '#dc2626' }}>
            {error}
          </div>
        )}

        <button
          onClick={login}
          disabled={loading}
          style={{ width: '100%', background: loading ? 'rgba(26,127,232,0.6)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', marginBottom: 10 }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>

        <button
          onClick={demoLogin}
          disabled={loading}
          style={{ width: '100%', background: 'rgba(26,127,232,0.2)', color: 'var(--accent)', border: '1px solid rgba(26,127,232,0.4)', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Loading...' : '🎭 Demo Login'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--muted)' }}>
          Use demo account to explore &nbsp;·&nbsp; Edge-first processing
        </div>
      </div>
    </div>
  );
}
