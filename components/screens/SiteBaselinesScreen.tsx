'use client';

import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';

export default function SiteBaselinesScreen() {
  const { state } = useStore();
  const site = state.activeSite;

  const baselines = [
    { label: 'Normal Access Window', value: '07:00 – 19:00', status: 'Learned', detail: 'Based on 847 badge events over 14 days' },
    { label: 'Avg Daily Badge Scans', value: '124 / day', status: 'Learned', detail: 'Includes all doors, all shifts' },
    { label: 'Avg Daily CCTV Events', value: '1,247 / day', status: 'Learned', detail: 'Motion detection events — Zone A–D' },
    { label: 'Machine Active Hours', value: '07:30 – 18:30', status: 'Learned', detail: 'Forklift + conveyor operational windows' },
    { label: 'Normal Network Traffic', value: '2.4 GB / day', status: 'Learned', detail: 'WMS, ERP, NVR heartbeats' },
    { label: 'Out-of-Hours Activity', value: '0–3 events', status: 'Threshold set', detail: 'Anything >3 triggers suspicion scoring' },
    { label: 'Expected Staff Count (peak)', value: '12–18 persons', status: 'Learned', detail: 'Zone B between 09:00–17:00' },
    { label: 'Anomaly Detection Active', value: 'Yes — 48h complete', status: 'Active', detail: 'Full IRE analysis running' },
  ];

  const learnMetrics = [
    { label: 'Baseline learning progress', value: 100, color: 'var(--ok)' },
    { label: 'Model confidence', value: 87, color: 'var(--accent)' },
    { label: 'Data coverage (4 domains)', value: site ? Object.values(site.sources).filter(Boolean).length / 4 * 100 : 75, color: 'var(--accent)' },
  ];

  return (
    <AppLayout active="siteBaselines">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Site Baselines</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {site ? site.name : 'All sites'} · Novel Point A: CPSL learns your site-specific normal behaviour before alerting
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Baseline table */}
          <div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Learned Baseline Parameters
              </div>
              {baselines.map((b, i) => (
                <div key={b.label} style={{ padding: '12px 18px', borderBottom: i < baselines.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{b.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.detail}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{b.value}</div>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 600, background: b.status === 'Active' ? 'rgba(34,197,94,0.12)' : b.status === 'Learned' ? 'rgba(26,127,232,0.12)' : 'rgba(245,158,11,0.12)', color: b.status === 'Active' ? 'var(--ok)' : b.status === 'Learned' ? 'var(--accent)' : 'var(--warn)' }}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Learning Progress</div>
              {learnMetrics.map(m => (
                <div key={m.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11 }}>
                    <span style={{ color: 'var(--muted)' }}>{m.label}</span>
                    <span style={{ fontWeight: 700, color: m.color }}>{Math.round(m.value)}%</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--border)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: m.value + '%', background: m.color, borderRadius: 3, transition: 'width 1s' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ok)', marginBottom: 6 }}>✓ Baseline Complete</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                The IRE has completed 14 days of baseline learning for this site. Full anomaly detection and cross-domain suspicion chain firing is now active.
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Novel Point A — Why This Matters</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
                Unlike enterprise OT platforms that require clean, structured telemetry, CPSL's baseline engine works in "brownfield" environments — where logs are patchy, timestamps are inconsistent, and legacy hardware produces incomplete data. This is a core novel innovation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
