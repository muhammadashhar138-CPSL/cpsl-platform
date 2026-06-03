'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';
import { generateReport } from '@/lib/report';
import { Incident } from '@/lib/types';

export default function IncidentQueueScreen() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [search, setSearch] = useState('');

  const filtered = [...state.allIncidents].reverse().filter(i => {
    if (filter !== 'all' && i.severity !== filter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.siteName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openDetail = (inc: Incident) => {
    dispatch({ type: 'SET_DETAIL_INCIDENT', incident: inc });
    dispatch({ type: 'SET_SCREEN', screen: 'incidentDetail' });
  };

  const openModal = (inc: Incident) => dispatch({ type: 'SET_MODAL_INCIDENT', incident: inc });

  const sevCounts = {
    all: state.allIncidents.length,
    critical: state.allIncidents.filter(i => i.severity === 'critical').length,
    high: state.allIncidents.filter(i => i.severity === 'high').length,
    medium: state.allIncidents.filter(i => i.severity === 'medium').length,
  };

  const domColors: Record<string, string> = { cctv: '#1a7fe8', access: '#22c55e', machine: '#f59e0b', network: '#ef4444' };

  return (
    <AppLayout active="incidentQueue">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Incident Queue</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>All reconstructed incidents across all sites — Novel Point B: Cross-Domain Suspicion Chains</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search incidents..."
              style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '8px 14px', outline: 'none', fontSize: 13 }} />
          </div>
          {(['all', 'critical', 'high', 'medium'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ background: filter === f ? 'var(--accent)' : 'var(--surface)', border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`, color: filter === f ? '#fff' : 'var(--muted)', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontWeight: filter === f ? 600 : 400 }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({sevCounts[f]})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 12, border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No incidents yet</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Start monitoring a site to detect and reconstruct incidents.</div>
            <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'multiSite' })}
              style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              → Go to Sites
            </button>
          </div>
        ) : filtered.map(inc => (
          <div key={inc.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              {/* Severity icon */}
              <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, background: inc.severity === 'critical' ? 'rgba(239,68,68,0.12)' : inc.severity === 'high' ? 'rgba(245,158,11,0.12)' : 'rgba(26,127,232,0.12)' }}>
                {inc.severity === 'critical' ? '🔴' : inc.severity === 'high' ? '🟠' : '🟡'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <SevBadge sev={inc.severity} />
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{inc.title}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                  {inc.id} · Site: {inc.siteName} · {inc.time} · IRE Confidence: {inc.confidence}%
                </div>
                {/* Chain domains */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                  {inc.chain.map((e, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 600, color: domColors[e.domain] }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: domColors[e.domain] }} />
                      {e.domain.toUpperCase()}
                      {i < inc.chain.length - 1 && <span style={{ color: 'var(--chain)', marginLeft: 4 }}>→</span>}
                    </div>
                  ))}
                  <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(139,92,246,0.12)', color: 'var(--chain)', fontWeight: 600 }}>{inc.classification}</span>
                </div>
                {/* Brief narrative preview */}
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, overflow: 'hidden', maxHeight: 36 }}>
                  {inc.chain.map(e => e.label).join(' → ')}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'flex-end', flexShrink: 0 }}>
                <button onClick={() => openDetail(inc)}
                  style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  📄 Full Detail
                </button>
                <button onClick={() => openModal(inc)}
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 7, padding: '6px 14px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  🔍 Quick View
                </button>
                <button onClick={() => generateReport(inc)}
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 7, padding: '6px 14px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  📥 Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

function SevBadge({ sev }: { sev: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    critical: { bg: 'rgba(239,68,68,0.15)', color: 'var(--danger)' },
    high: { bg: 'rgba(245,158,11,0.15)', color: 'var(--warn)' },
    medium: { bg: 'rgba(26,127,232,0.15)', color: 'var(--accent)' },
  };
  const c = cfg[sev] || cfg.medium;
  return <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: c.bg, color: c.color }}>{sev.toUpperCase()}</span>;
}
