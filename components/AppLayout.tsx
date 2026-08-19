'use client';

import Sidebar from './Sidebar';
import { Screen } from '@/lib/types';
import { useStore } from '@/lib/store';

export default function AppLayout({ active, children }: { active: Screen; children: React.ReactNode }) {
  const { state } = useStore();
  const monitoring = state.monitoring;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar active={active} />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
        {/* Monitoring Status Bar - Shows on All Pages */}
        {monitoring.isActive && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)',
            borderBottom: '1px solid rgba(34,197,94,0.3)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(34,197,94,0.15)',
                padding: '6px 12px',
                borderRadius: 6,
                color: '#22c55e',
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  animation: 'blink 1.5s infinite',
                }} />
                🔴 MONITORING ACTIVE
              </div>
              <span style={{ color: 'var(--muted)' }}>
                Elapsed: <span style={{ color: '#22c55e', fontWeight: 700 }}>{formatTime(monitoring.elapsedSeconds)}</span>
              </span>
              {monitoring.activeSiteId && (
                <span style={{ color: 'var(--muted)' }}>
                  • Site ID: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{monitoring.activeSiteId}</span>
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              Go to Dashboard to manage monitoring
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
