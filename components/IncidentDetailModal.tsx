'use client';

import { Incident, Domain } from '@/lib/types';

interface Props {
  incident: Incident | null;
  onClose: () => void;
  onAlert?: () => void;
}

const domColors: Record<Domain, string> = { cctv: '#1a7fe8', access: '#22c55e', machine: '#f59e0b', network: '#ef4444' };
const domIcons: Record<Domain, string> = { cctv: '📷', access: '🔑', machine: '⚙️', network: '🌐' };

export default function IncidentDetailModal({ incident, onClose, onAlert }: Props) {
  if (!incident) return null;

  const severityColors = {
    critical: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#dc2626' },
    high: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', text: '#ea580c' },
    medium: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#1d4ed8' },
  };

  const colors = severityColors[incident.severity];

  return (
    <div onClick={e => { if ((e.target as HTMLElement).id === 'incident-overlay') onClose(); }}
      id="incident-overlay"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, width: 700, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>🚨 Incident Detected</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{incident.time}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 24, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Incident Summary */}
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
            <div style={{ fontSize: 24 }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{incident.severity.toUpperCase()} • {incident.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Chain ID: {incident.id}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <span><strong>Threat:</strong> {incident.threatScore}%</span>
                <span><strong>Confidence:</strong> {incident.confidence}%</span>
                <span><strong>Domains:</strong> {incident.chain.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chain Events Timeline */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Suspicion Chain</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {incident.chain.map((event, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 8, borderLeft: `3px solid ${domColors[event.domain]}` }}>
                <div style={{ fontSize: 18, minWidth: 24 }}>{domIcons[event.domain]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{event.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'pre-line' }}>{event.detail}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>Confidence: {event.conf}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Incident Narrative (IRE Analysis)</div>
          <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: 14, fontSize: 13, lineHeight: 1.7, color: 'var(--text)' }} dangerouslySetInnerHTML={{ __html: incident.narrative }} />
        </div>

        {/* Response Recommendations */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Recommended Response</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {incident.response.map((action, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 8 }}>
                <div style={{ fontSize: 16, minWidth: 24 }}>{i + 1}.</div>
                <div style={{ fontSize: 12, color: 'var(--text)' }}>{action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onAlert} style={{ flex: 1, background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            📤 Send Alert
          </button>
          <button onClick={onClose} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
