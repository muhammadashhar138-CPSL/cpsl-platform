'use client';

import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';

export default function ProfileScreen() {
  const { state, dispatch } = useStore();

  return (
    <AppLayout active="profile">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: 800 }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>Profile</div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 20, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', flexShrink: 0 }}>MA</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{state.user?.name || 'Muhammad Ashhar'}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>{state.user?.email || 'ashhar@cpsl.co.uk'}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Platform Admin', 'MSc Cyber Security & Forensics', 'University of Westminster', 'AI/ML Architecture'].map(t => (
                <span key={t} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(26,127,232,0.1)', border: '1px solid rgba(26,127,232,0.25)', color: 'var(--accent)', fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
          <button onClick={() => { dispatch({ type: 'SET_USER', user: null }); dispatch({ type: 'SET_SCREEN', screen: 'login' }); }}
            style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 7, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>
            Sign out
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Platform Summary</div>
            {[['Sites managed', state.sites.length], ['Incidents detected', state.allIncidents.length], ['Reports generated', state.allIncidents.length], ['IRE engine', 'Active']].map(([k, v]) => (
              <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Company</div>
            {[['Company', 'Cyber-Physical Security Layer'], ['Abbreviation', 'CPSL'], ['Location', 'United Kingdom'], ['Visa type', 'Innovator Founder Visa'], ['TRL level', 'TRL 7 — Operational Prototype']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
