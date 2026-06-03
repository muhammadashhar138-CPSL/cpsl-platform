'use client';

import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';
import { generateReport } from '@/lib/report';

const domColors: Record<string, string> = { cctv: '#1a7fe8', access: '#22c55e', machine: '#f59e0b', network: '#ef4444' };

export default function IncidentDetailScreen() {
  const { state, dispatch } = useStore();
  const s = state.detailIncident;

  if (!s) return (
    <AppLayout active="incidentQueue">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 32 }}>📄</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>No incident selected</div>
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'incidentQueue' })}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          ← Back to Queue
        </button>
      </div>
    </AppLayout>
  );

  const sevColor = s.severity === 'critical' ? 'var(--danger)' : s.severity === 'high' ? 'var(--warn)' : 'var(--accent)';
  const sevBg = s.severity === 'critical' ? 'rgba(239,68,68,0.12)' : s.severity === 'high' ? 'rgba(245,158,11,0.12)' : 'rgba(26,127,232,0.12)';

  return (
    <AppLayout active="incidentQueue">
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 12, color: 'var(--muted)' }}>
          <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'incidentQueue' })}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, padding: 0 }}>
            ← Incident Queue
          </button>
          <span>/</span>
          <span>{s.id}</span>
        </div>

        {/* Header */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 5, background: sevBg, color: sevColor }}>{s.severity.toUpperCase()}</span>
                <span style={{ fontSize: 10, background: 'rgba(139,92,246,0.12)', color: 'var(--chain)', padding: '3px 10px', borderRadius: 5, fontWeight: 600 }}>IRE RECONSTRUCTED</span>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{s.id}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                Site: {s.siteName} &nbsp;·&nbsp; {s.time} &nbsp;·&nbsp; IRE Confidence: <strong style={{ color: sevColor }}>{s.confidence}%</strong> &nbsp;·&nbsp; {s.classification}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => generateReport(s)}
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                📥 Download PDF Report
              </button>
              <button style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer' }}>
                📧 Alert Manager
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* IRE Narrative — Novel Point D */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>IRE Narrative</div>
                <span style={{ fontSize: 10, color: 'var(--chain)', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>Novel Point D — Plain English Output</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--text)' }}
                dangerouslySetInnerHTML={{ __html: s.narrative.replace(/<div class="hbox">/g, '<div style="background:rgba(26,127,232,0.07);border-left:2px solid var(--accent);padding:8px 12px;border-radius:0 6px 6px 0;margin:12px 0;font-size:12px;">') }} />
            </div>

            {/* Suspicion Chain — Novel Point B */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Cross-Domain Suspicion Chain</div>
                <span style={{ fontSize: 10, color: 'var(--chain)', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>Novel Point B</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8, gap: 4 }}>
                {s.chain.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {i > 0 && <div style={{ color: 'var(--chain)', fontSize: 20, padding: '0 6px', marginTop: 10 }}>→</div>}
                    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderTop: `3px solid ${domColors[e.domain]}`, borderRadius: 10, padding: '12px 14px', minWidth: 155 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: domColors[e.domain], marginBottom: 4 }}>{e.domain}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{e.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: e.detail.replace('\n', '<br>') }} />
                      <div style={{ fontSize: 11, color: 'var(--chain)', fontWeight: 700, marginTop: 6 }}>Conf: {e.conf}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Guidance — Novel Point E */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Recommended Response Actions</div>
                <span style={{ fontSize: 10, color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>Novel Point E</span>
              </div>
              {s.response.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 13, paddingTop: 3 }}>{r}</div>
                  <button style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border)', color: 'var(--ok)', borderRadius: 6, padding: '3px 10px', fontSize: 10, cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start' }}>
                    ✓ Done
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>IRE Metrics</div>
              {[
                ['Confidence', s.confidence + '%'],
                ['Domains correlated', s.chain.length.toString()],
                ['Data gaps filled', s.gapsFilled + ' (Novel Point C)'],
                ['Processing latency', s.latency + 'ms'],
                ['Classification', s.classification],
                ['Threat score', s.threatScore + '/100'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Actions</div>
              {[
                { label: '📥 Download PDF Report', action: () => generateReport(s), primary: true },
                { label: '📧 Email to Security Team', action: () => alert('Email sent (demo)') },
                { label: '📋 Mark as Resolved', action: () => alert('Marked resolved (demo)') },
                { label: '🔗 Share Incident Link', action: () => alert('Link copied (demo)') },
              ].map(a => (
                <button key={a.label} onClick={a.action}
                  style={{ width: '100%', background: a.primary ? 'var(--accent)' : 'var(--surface2)', color: a.primary ? '#fff' : 'var(--text)', border: `1px solid ${a.primary ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, padding: '9px 14px', fontSize: 12, fontWeight: a.primary ? 700 : 400, cursor: 'pointer', marginBottom: 8, textAlign: 'left' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
