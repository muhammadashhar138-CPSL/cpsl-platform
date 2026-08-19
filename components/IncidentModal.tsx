'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { generateReport } from '@/lib/report';
import AlertManagerModal from './AlertManagerModal';

const domColors: Record<string, string> = { cctv: '#1a7fe8', access: '#22c55e', machine: '#f59e0b', network: '#ef4444' };

export default function IncidentModal() {
  const { state, dispatch } = useStore();
  const s = state.modalIncident;
  const [alertOpen, setAlertOpen] = useState(false);
  if (!s) return null;

  const close = () => dispatch({ type: 'SET_MODAL_INCIDENT', incident: null });
  const openDetail = () => {
    dispatch({ type: 'SET_DETAIL_INCIDENT', incident: s });
    close();
    dispatch({ type: 'SET_SCREEN', screen: 'incidentDetail' });
  };

  return (
    <div id="modal-overlay" onClick={e => { if ((e.target as HTMLElement).id === 'modal-overlay') close(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, width: 820, maxWidth: '95vw', maxHeight: '88vh', overflowY: 'auto', padding: 26 }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Chain ID: {s.id} · {s.severity.toUpperCase()} · Site: {s.siteName}</div>
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {/* Narrative */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--chain)', marginBottom: 6 }}>IRE — PLAIN ENGLISH NARRATIVE (Novel Point D)</div>
        <div style={{ fontSize: 13, lineHeight: 1.75, background: 'var(--surface2)', borderRadius: 8, padding: '14px 16px', border: '1px solid var(--border)', marginBottom: 18 }}
          dangerouslySetInnerHTML={{ __html: s.narrative.replace(/<div class="hbox">/g, '<div style="background:rgba(26,127,232,0.07);border-left:2px solid var(--accent);padding:8px 12px;border-radius:0 6px 6px 0;margin:10px 0;font-size:12px;">') }} />

        {/* Chain */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--chain)', marginBottom: 10 }}>SUSPICION CHAIN — CROSS-DOMAIN (Novel Point B)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', paddingBottom: 12, marginBottom: 18 }}>
          {s.chain.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {i > 0 && <div style={{ color: 'var(--chain)', fontSize: 20 }}>→</div>}
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderTop: `3px solid ${domColors[e.domain]}`, borderRadius: 8, padding: '10px 12px', minWidth: 140 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: domColors[e.domain], marginBottom: 3 }}>{e.domain}</div>
                <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>{e.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }} dangerouslySetInnerHTML={{ __html: e.detail.replace('\n', '<br>') }} />
                <div style={{ fontSize: 10, color: 'var(--chain)', marginTop: 2, fontWeight: 700 }}>Conf: {e.conf}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics + Response */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>IRE Metrics</div>
            {[['Confidence', s.confidence + '%'], ['Domains correlated', s.chain.length.toString()], ['Data gaps filled (Novel C)', s.gapsFilled + ' probabilistically'], ['Processing latency', s.latency + 'ms'], ['Classification', s.classification]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Response Guidance (Novel Point E)</div>
            {s.response.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, paddingBottom: 6, fontSize: 12 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div>{r}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => generateReport(s)} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>📥 Download PDF Report</button>
          <button onClick={() => setAlertOpen(true)} style={{ flex: 1, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--warn)', borderRadius: 8, padding: '10px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>📧 Alert Manager</button>
          <button onClick={openDetail} style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '10px 16px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>📄 Full Detail</button>
          <button onClick={close} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '10px 14px', fontSize: 12, cursor: 'pointer' }}>✕</button>
        </div>
      </div>
      {alertOpen && <AlertManagerModal incident={s} onClose={() => setAlertOpen(false)} />}
    </div>
  );
}
