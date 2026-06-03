'use client';

import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';

const domConfig = [
  { key: 'cctv', label: 'CCTV Metadata', icon: '📷', color: '#1a7fe8', desc: 'Motion events, zone occupancy, and movement vectors — no raw video footage stored or transmitted', systems: ['Hikvision DS-2CD series', 'Dahua IPC-HFW', 'Axis P3245-V', 'Generic ONVIF 2.0+'], events: ['Zone motion detected', 'Object tracking active', 'Camera occlusion alert', 'Motion zone clear', 'PTZ movement logged'] },
  { key: 'access', label: 'Access Control', icon: '🔑', color: '#22c55e', desc: 'Badge scan events, door open/close logs, out-of-hours access attempts, and credential failures', systems: ['Paxton Net2 Pro', 'HID VertX EVO', 'Honeywell Pro-Watch', 'Generic Wiegand'], events: ['Badge scan – authorised', 'Door held open alert', 'Failed credential attempt', 'Exit logged', 'Override event'] },
  { key: 'machine', label: 'Machine Telemetry', icon: '⚙️', color: '#f59e0b', desc: 'PLC state logs, equipment start/stop events, unscheduled downtime, and temperature anomalies', systems: ['Siemens S7-1200 PLC', 'Allen-Bradley MicroLogix', 'Mitsubishi MELSEC', 'Generic Modbus/TCP'], events: ['Machine cycle start', 'Unscheduled stop', 'Temperature spike', 'Conveyor jam detected', 'Forklift key-on event'] },
  { key: 'network', label: 'Network Telemetry', icon: '🌐', color: '#ef4444', desc: 'Traffic anomalies, port scan detection, unusual outbound connections, and protocol deviations', systems: ['Cisco Meraki MX', 'Fortinet FortiGate', 'pfSense/OPNsense', 'Generic NetFlow/IPFIX'], events: ['Port scan detected', 'Anomalous traffic volume', 'New device on network', 'Unusual outbound connection', 'Protocol deviation logged'] },
];

export default function DataSourcesScreen() {
  const { state } = useStore();
  const site = state.activeSite;

  return (
    <AppLayout active="dataSources">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Data Sources</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {site ? `Monitoring: ${site.name}` : 'Configure and view data source feeds across your sites'} · Novel Point A: Brownfield SME Intelligence
          </div>
        </div>

        {/* Novel point A callout */}
        <div style={{ background: 'rgba(26,127,232,0.06)', border: '1px solid rgba(26,127,232,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#000', flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>Novel Point A — Brownfield SME Intelligence</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>CPSL works with your existing hardware. No "rip and replace" required. The IRE operates even when data is incomplete, inconsistent, or from legacy systems — purpose-built for UK SME brownfield environments.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {domConfig.map(d => {
            const isEnabled = site ? (site.sources[d.key as keyof typeof site.sources] ?? false) : true;
            return (
              <div key={d.key} style={{ background: 'var(--surface)', border: `1px solid ${isEnabled ? d.color + '40' : 'var(--border)'}`, borderRadius: 12, padding: 20, opacity: isEnabled ? 1 : 0.55 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: d.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{d.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{d.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                      <span style={{ color: isEnabled ? 'var(--ok)' : 'var(--muted)', fontWeight: 600 }}>● {isEnabled ? 'Active' : 'Not configured'}</span>
                      {site && ` · ${site.name}`}
                    </div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: isEnabled ? d.color : 'var(--muted)', animation: isEnabled ? 'blink 2s infinite' : 'none' }} />
                </div>

                <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>{d.desc}</p>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Compatible Systems</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {d.systems.map(s => (
                      <span key={s} style={{ fontSize: 10, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 5, padding: '2px 7px', color: 'var(--muted2)' }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Sample Events</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {d.events.map(e => (
                      <div key={e} style={{ fontSize: 11, color: 'var(--muted2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                        {e}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
