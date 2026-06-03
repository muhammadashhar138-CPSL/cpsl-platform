'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';

export default function SettingsScreen() {
  const { state } = useStore();
  const [notif, setNotif] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [sensitivity, setSensitivity] = useState('medium');
  const [edge, setEdge] = useState(true);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <div onClick={toggle} style={{ width: 42, height: 23, borderRadius: 12, background: on ? 'var(--ok)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 17, height: 17, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
    </div>
  );

  const Row = ({ label, sub, control }: { label: string; sub: string; control: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)', gap: 16 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>
      </div>
      {control}
    </div>
  );

  return (
    <AppLayout active="settings">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: 720 }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>Platform configuration and preferences</div>

        {[{
          title: 'Alerts & Notifications',
          rows: [
            { label: 'In-app incident alerts', sub: 'Show red banner when a suspicion chain fires', ctrl: <Toggle on={notif} toggle={() => setNotif(!notif)} /> },
            { label: 'Email alerts', sub: 'Send email notification on critical incidents', ctrl: <Toggle on={emailAlerts} toggle={() => setEmailAlerts(!emailAlerts)} /> },
            { label: 'Auto-download reports', sub: 'Automatically download PDF when incident is reconstructed', ctrl: <Toggle on={autoDownload} toggle={() => setAutoDownload(!autoDownload)} /> },
          ]
        }, {
          title: 'Detection & IRE',
          rows: [
            {
              label: 'Chain detection sensitivity',
              sub: 'Higher = more alerts but may increase false positives',
              ctrl: (
                <select value={sensitivity} onChange={e => setSensitivity(e.target.value)}
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
                  <option value="low">Low (threshold: 80%)</option>
                  <option value="medium">Medium (threshold: 65%)</option>
                  <option value="high">High (threshold: 50%)</option>
                </select>
              )
            }
          ]
        }, {
          title: 'Privacy & Data',
          rows: [
            { label: 'Edge-first processing', sub: 'All processing stays on-site — no raw data transmitted', ctrl: <Toggle on={edge} toggle={() => setEdge(!edge)} /> },
          ]
        }, {
          title: 'Account',
          rows: [
            { label: 'Signed in as', sub: state.user?.email || 'ashhar@cpsl.co.uk', ctrl: null },
            { label: 'Platform version', sub: 'CPSL v1.0 — TRL 7 Prototype', ctrl: null },
          ]
        }].map(section => (
          <div key={section.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ padding: '9px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{section.title}</div>
            {section.rows.map(r => <Row key={r.label} label={r.label} sub={r.sub} control={r.ctrl} />)}
          </div>
        ))}

        <button onClick={save}
          style={{ background: saved ? 'var(--ok)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>
    </AppLayout>
  );
}
