'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function LoginScreen() {
  const { dispatch } = useStore();
  const [email, setEmail] = useState('ashhar@cpsl.co.uk');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'SET_USER', user: { name: 'Muhammad Ashhar', email } });
      dispatch({ type: 'SET_SCREEN', screen: 'multiSite' });
    }, 800);
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

        <button
          onClick={login}
          disabled={loading}
          style={{ width: '100%', background: loading ? 'rgba(26,127,232,0.6)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--muted)' }}>
          Demo: any credentials work &nbsp;·&nbsp; Edge-first processing
        </div>
      </div>
    </div>
  );
}
