'use client';

import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';

export default function HelpScreen() {
  const { dispatch } = useStore();
  const nav = (s: import('@/lib/types').Screen) => dispatch({ type: 'SET_SCREEN', screen: s });

  return (
    <AppLayout active="help">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: 900 }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Help & Getting Started</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>How to use the CPSL platform</div>

        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Quick Start Guide</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {[
            { n: 1, title: 'Add a Site', desc: 'Go to Multi-Site, click "+ Add New Site". Enter site name, type, and location. Select which data sources (CCTV, Access, Machine, Network) are available at the site.', cta: 'Add Site', screen: 'addSite' as const },
            { n: 2, title: 'Open Monitoring Dashboard', desc: 'Click any site card to open the live monitoring Dashboard. Monitoring starts automatically. Live events from all 4 data sources appear in real time (every 2–4 seconds).', cta: null, screen: null },
            { n: 3, title: 'Wait for a Suspicion Chain', desc: 'The IRE (Incident Reconstruction Engine) monitors for cross-domain anomaly patterns. After ~25 seconds, a suspicion chain fires automatically — a red alert banner appears.', cta: null, screen: null },
            { n: 4, title: 'Read the Narrative (Novel Point D)', desc: 'Scroll down to the IRE section. A plain-English story of the incident appears automatically — who did what, when, why it\'s suspicious. No technical jargon.', cta: null, screen: null },
            { n: 5, title: 'Download a Report', desc: 'Click "📥 Download Report" on any incident. A full PDF-quality report opens in a new tab — includes narrative, suspicion chain, IRE metrics, and response steps. Click "Print/Save as PDF" to save.', cta: null, screen: null },
            { n: 6, title: 'View Incident Queue & Reports', desc: 'Use the left sidebar to navigate to Incident Queue (all active incidents) and Reports (all historical reports with download buttons).', cta: 'View Reports', screen: 'reports' as const },
          ].map(s => (
            <div key={s.n} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted2)', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
              {s.cta && s.screen && (
                <button onClick={() => nav(s.screen!)} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                  {s.cta} →
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>5 Novel Points Explained</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
          {[
            { l: 'A', color: '#f59e0b', title: 'Brownfield SME Intelligence', desc: 'Works with old, incomplete, patchy data from legacy CCTV and PLCs — no "rip and replace" needed.' },
            { l: 'B', color: '#8b5cf6', title: 'Cross-Domain Suspicion Chains', desc: 'Links badge + motion + machine + network events into a single suspicious sequence.' },
            { l: 'C', color: '#1a7fe8', title: 'Incident Reconstruction (IRE)', desc: 'Fills data gaps probabilistically. Reconstructs full incident even when sensors fail.' },
            { l: 'D', color: '#22c55e', title: 'Operational Narrative Output', desc: 'Plain-English stories, not technical dashboards. Non-expert managers can act immediately.' },
            { l: 'E', color: '#ef4444', title: 'Mixed-Incident Response Guidance', desc: 'Response steps tailored to combined physical+cyber incidents — not just cyber or physical alone.' },
          ].map(n => (
            <div key={n.l} style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderLeft: `3px solid ${n.color}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000', flexShrink: 0 }}>{n.l}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{n.title}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{n.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>FAQ</div>
        {[
          { q: 'Does CPSL store video footage?', a: 'No. Only metadata (motion zones, timestamps) is processed. Raw video never leaves your site. This is edge-first processing for privacy compliance.' },
          { q: 'How fast are incident chains detected?', a: 'The IRE correlation latency is under 500ms. In this demo, the first chain fires after ~25 seconds of monitoring. In production, real anomalies trigger chains within milliseconds of correlated events.' },
          { q: 'What hardware is needed?', a: 'An NVIDIA Jetson, Raspberry Pi 5, or any on-site server. CPSL is hardware-agnostic and works with existing Hikvision, Dahua, Paxton, and any ONVIF-compatible systems.' },
          { q: 'How do I stop and restart monitoring?', a: 'Click "⏸ Stop Monitoring" or "▶ Start Monitoring" in the top-right of the Dashboard. The pause/resume button appears on all views.' },
        ].map(f => (
          <div key={f.q} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>Q: {f.q}</div>
            <div style={{ fontSize: 12, color: 'var(--muted2)', lineHeight: 1.7 }}>{f.a}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
