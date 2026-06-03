'use client';

import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';
import { generateReport } from '@/lib/report';
import { Incident } from '@/lib/types';

export default function ReportsScreen() {
  const { state, dispatch } = useStore();
  const incidents = [...state.allIncidents].reverse();

  const openDetail = (inc: Incident) => {
    dispatch({ type: 'SET_DETAIL_INCIDENT', incident: inc });
    dispatch({ type: 'SET_SCREEN', screen: 'incidentDetail' });
  };
  const openModal = (inc: Incident) => dispatch({ type: 'SET_MODAL_INCIDENT', incident: inc });

  const sevIcon = (s: string) => s === 'critical' ? '🔴' : s === 'high' ? '🟠' : '🟡';

  return (
    <AppLayout active="reports">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Incident Reports</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              All reconstructed incidents across all monitored sites. Reports include full IRE narrative, suspicion chain, and Novel Point E response guidance.
            </div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', fontSize: 12, color: 'var(--muted)' }}>
            Total: <strong style={{ color: 'var(--text)' }}>{state.allIncidents.length}</strong>
          </div>
        </div>

        {incidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 12, border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No reports yet</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Incident reports appear here once the IRE reconstructs incidents during live monitoring.</div>
            <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'multiSite' })}
              style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              → Start Monitoring
            </button>
          </div>
        ) : incidents.map(s => (
          <div key={s.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, background: s.severity === 'critical' ? 'rgba(239,68,68,0.12)' : s.severity === 'high' ? 'rgba(245,158,11,0.12)' : 'rgba(26,127,232,0.12)' }}>
              {sevIcon(s.severity)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                {s.id} &nbsp;·&nbsp; {s.siteName} &nbsp;·&nbsp; {s.time}
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600, background: s.severity === 'critical' ? 'rgba(239,68,68,0.15)' : s.severity === 'high' ? 'rgba(245,158,11,0.15)' : 'rgba(26,127,232,0.15)', color: s.severity === 'critical' ? 'var(--danger)' : s.severity === 'high' ? 'var(--warn)' : 'var(--accent)' }}>{s.severity.toUpperCase()}</span>
                {s.chain.map(e => <span key={e.domain} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--surface2)', color: 'var(--muted2)', fontWeight: 600 }}>{e.domain.toUpperCase()}</span>)}
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(139,92,246,0.12)', color: 'var(--chain)', fontWeight: 600 }}>{s.classification}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'flex-end', flexShrink: 0 }}>
              <button onClick={() => generateReport(s)}
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                📥 Download Report
              </button>
              <button onClick={() => openDetail(s)}
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '6px 16px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                📄 Full Detail
              </button>
              <button onClick={() => openModal(s)}
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '6px 16px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                🔍 Quick View
              </button>
              <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>Conf: {s.confidence}% · {s.chain.length} domains</div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
