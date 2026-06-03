'use client';

import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';

export default function AlertRulesScreen() {
  const { state, dispatch } = useStore();

  const toggle = (id: string) => dispatch({ type: 'TOGGLE_RULE', id });

  const sevColor: Record<string, string> = {
    critical: 'var(--danger)',
    high: 'var(--warn)',
    medium: 'var(--accent)',
  };
  const sevBg: Record<string, string> = {
    critical: 'rgba(239,68,68,0.12)',
    high: 'rgba(245,158,11,0.12)',
    medium: 'rgba(26,127,232,0.12)',
  };
  const domColor: Record<string, string> = { cctv: '#1a7fe8', access: '#22c55e', machine: '#f59e0b', network: '#ef4444' };

  return (
    <AppLayout active="alertRules">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Alert Rules</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Configure cross-domain suspicion chain thresholds — Novel Point E: Response Guidance for Mixed Incidents</div>
          </div>
          <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            + New Rule
          </button>
        </div>

        {/* Novel point E callout */}
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff', flexShrink: 0 }}>E</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>Novel Point E — Response Guidance for Mixed Incidents</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>Alert rules in CPSL are cross-domain — a single rule can correlate a physical badge event with a network anomaly. When fired, each rule includes tailored response steps for the specific combination of events detected.</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {state.alertRules.map(rule => (
            <div key={rule.id} style={{ background: 'var(--surface)', border: `1px solid ${rule.enabled ? 'var(--border)' : 'var(--border)'}`, borderRadius: 12, padding: '16px 18px', opacity: rule.enabled ? 1 : 0.55 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Toggle */}
                <div onClick={() => toggle(rule.id)} style={{ width: 42, height: 24, borderRadius: 12, background: rule.enabled ? 'var(--ok)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: rule.enabled ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{rule.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: sevBg[rule.severity], color: sevColor[rule.severity] }}>{rule.severity.toUpperCase()}</span>
                    {rule.enabled && <span style={{ fontSize: 10, color: 'var(--ok)', fontWeight: 600 }}>● Active</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {rule.domains.map(d => (
                        <span key={d} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, background: domColor[d] + '18', color: domColor[d], fontWeight: 600 }}>{d.toUpperCase()}</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Threshold: {rule.threshold}% confidence</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 6, padding: '5px 12px', fontSize: 11, cursor: 'pointer' }}>Edit</button>
                  <button style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--danger)', borderRadius: 6, padding: '5px 12px', fontSize: 11, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>About Cross-Domain Rules</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
            Each alert rule monitors one or more data domains simultaneously. When events from different domains meet the configured threshold within the IRE&apos;s correlation window, a suspicion chain is triggered and Novel Point C (incident reconstruction) begins automatically. Rules with multiple domains implement Novel Point B (cross-domain suspicion chains).
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
