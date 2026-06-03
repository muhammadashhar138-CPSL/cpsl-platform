'use client';

import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';
import { Site } from '@/lib/types';

const typeConfig = {
  warehouse: { icon: '🏭', label: 'Warehouse', color: '#1a7fe8', bg: 'rgba(26,127,232,0.12)' },
  workshop:  { icon: '🔧', label: 'Vehicle Workshop', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  logistics: { icon: '🚚', label: 'Logistics Hub', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  supply:    { icon: '📦', label: 'Supply Chain Depot', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
};

export default function MultiSiteScreen() {
  const { state, dispatch } = useStore();

  const openSite = (site: Site) => {
    dispatch({ type: 'SET_ACTIVE_SITE', site });
    dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
  };

  const deleteSite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Remove this site?')) return;
    dispatch({ type: 'DELETE_SITE', id });
  };

  const incCount = (name: string) => state.allIncidents.filter(i => i.siteName === name).length;
  const totalInc = state.allIncidents.length;
  const activeSites = state.sites.filter(s => s.monitoring).length;

  return (
    <AppLayout active="multiSite">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Multi-Site Overview</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Manage all your warehouses, workshops, and logistics sites in one place</div>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'addSite' })}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            + Add New Site
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Sites', value: state.sites.length, icon: '🏭', color: 'var(--accent)' },
            { label: 'Monitoring Active', value: activeSites, icon: '🟢', color: 'var(--ok)' },
            { label: 'Total Incidents', value: totalInc, icon: '⚠️', color: 'var(--danger)' },
            { label: 'IRE Accuracy', value: '91%', icon: '🎯', color: 'var(--chain)' },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: c.color, marginBottom: 2 }}>{c.value}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Sites grid */}
        {state.sites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 12, border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏭</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No sites added yet</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>Add your first warehouse, workshop or logistics site to start monitoring.</div>
            <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'addSite' })}
              style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              + Add Your First Site
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {state.sites.map(site => {
              const tc = typeConfig[site.type] || typeConfig.warehouse;
              const inc = incCount(site.name);
              return (
                <div key={site.id} onClick={() => openSite(site)}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>

                  {/* Delete btn */}
                  <button onClick={e => deleteSite(e, site.id)}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 6, padding: '3px 8px', fontSize: 11, cursor: 'pointer', opacity: 0.6 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.6'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}>
                    ✕
                  </button>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{tc.icon}</div>
                    <div style={{ flex: 1, paddingRight: 32 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, lineHeight: 1.3 }}>{site.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{tc.label} · {site.city}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
                    {site.address && <div>{site.address}</div>}
                    {site.contact && <div>Contact: {site.contact}</div>}
                    <div style={{ marginTop: 4 }}>
                      Sources: {Object.entries(site.sources).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: site.monitoring ? 'var(--ok)' : 'var(--muted)', animation: site.monitoring ? 'blink 1.5s infinite' : 'none' }} />
                      <span style={{ color: site.monitoring ? 'var(--ok)' : 'var(--muted)' }}>
                        {site.monitoring ? 'Monitoring Active' : 'Not Monitoring'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--surface2)', borderRadius: 6, padding: '3px 8px' }}>
                      {inc} incident{inc !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
