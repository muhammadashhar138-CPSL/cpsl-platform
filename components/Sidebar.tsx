'use client';

import { useStore } from '@/lib/store';
import { Screen } from '@/lib/types';

interface NavItem {
  screen: Screen;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { screen: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { screen: 'incidentQueue', label: 'Incident Queue', icon: '⚠' },
  { screen: 'dataSources', label: 'Data Sources', icon: '◈' },
  { screen: 'siteBaselines', label: 'Site Baselines', icon: '◎' },
  { screen: 'alertRules', label: 'Alert Rules', icon: '⚡' },
  { screen: 'multiSite', label: 'Multi-Site', icon: '⊞' },
  { screen: 'reports', label: 'Reports', icon: '☰' },
  { screen: 'teamRoles', label: 'Team & Roles', icon: '👥' },
  { screen: 'settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar({ active }: { active: Screen }) {
  const { state, dispatch } = useStore();

  const incidentCount = state.allIncidents.filter(i => i.severity === 'critical').length;
  const nav = (s: Screen) => dispatch({ type: 'SET_SCREEN', screen: s });

  return (
    <aside style={{
      width: 220,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
      overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#fff', flexShrink: 0 }}>C</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', letterSpacing: 0.3 }}>CPSL</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 0.5 }}>Cyber-Physical</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '10px 0' }}>
        {navItems.map(item => {
          const isActive = active === item.screen;
          const isBadged = item.screen === 'incidentQueue' && incidentCount > 0;
          return (
            <div
              key={item.screen}
              onClick={() => nav(item.screen)}
              style={{
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                color: isActive ? 'var(--accent)' : 'var(--muted2)',
                background: isActive ? 'rgba(26,127,232,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--muted2)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {isBadged && (
                <div style={{ background: 'var(--danger)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 8, minWidth: 16, textAlign: 'center' }}>{incidentCount}</div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
        {([['about', '◉', 'About CPSL'], ['help', '?', 'Help']] as const).map(([sc, ic, lb]) => (
          <div key={sc} onClick={() => nav(sc as import('@/lib/types').Screen)}
            style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: active === sc ? 'var(--accent)' : 'var(--muted)', fontSize: 12, borderLeft: active === sc ? '2px solid var(--accent)' : '2px solid transparent', background: active === sc ? 'rgba(26,127,232,0.06)' : 'transparent' }}>
            <span style={{ fontSize: 13, width: 18, textAlign: 'center' }}>{ic}</span>
            <span>{lb}</span>
          </div>
        ))}
      </div>

      {/* User section */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}
          onClick={() => nav('profile')}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>MA</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{state.user?.name || 'Muhammad Ashhar'}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>Admin</div>
          </div>
        </div>
        <button
          onClick={() => { dispatch({ type: 'SET_USER', user: null }); nav('login'); }}
          style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 6, padding: '5px 0', fontSize: 11, cursor: 'pointer' }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
