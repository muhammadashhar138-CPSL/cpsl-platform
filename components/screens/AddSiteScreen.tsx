'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';
import { Domain, Site, SiteType } from '@/lib/types';

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 8, color: 'var(--text)', padding: '10px 14px', outline: 'none', fontSize: 13,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

export default function AddSiteScreen() {
  const { dispatch } = useStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState<SiteType | ''>('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [sources, setSources] = useState<Record<Domain, boolean>>({ cctv: true, access: true, machine: true, network: true });

  const nav = (s: import('@/lib/types').Screen) => dispatch({ type: 'SET_SCREEN', screen: s });

  const next = () => {
    if (step === 1) {
      if (!name.trim()) { alert('Please enter a site name.'); return; }
      if (!type) { alert('Please select a site type.'); return; }
      if (!city.trim()) { alert('Please enter a city/location.'); return; }
    }
    if (step === 2 && !Object.values(sources).some(v => v)) { alert('Select at least one data source.'); return; }
    setStep(s => s + 1);
  };

  const create = () => {
    const site: Site = {
      id: 'site-' + Date.now(),
      name: name.trim(), type: type as SiteType, city: city.trim(),
      address: address.trim(), contact: contact.trim(),
      contactEmail: contactEmail.trim(), sources,
      monitoring: false, created: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_SITE', site });
    nav('multiSite');
  };

  const sourceItems = [
    { key: 'cctv' as Domain, icon: '📷', label: 'CCTV Metadata', sub: 'Motion events, zone data — no raw video stored' },
    { key: 'access' as Domain, icon: '🔑', label: 'Access Control', sub: 'Badge scans, door events, out-of-hours access' },
    { key: 'machine' as Domain, icon: '⚙️', label: 'Machine Telemetry', sub: 'PLC logs, equipment state, downtime events' },
    { key: 'network' as Domain, icon: '🌐', label: 'Network Telemetry', sub: 'Traffic anomalies, port scans, unusual connections' },
  ];

  const stepDot = (n: number) => ({
    width: 28, height: 28, borderRadius: '50%',
    background: n < step ? 'var(--ok)' : n === step ? 'var(--accent)' : 'var(--surface2)',
    border: `2px solid ${n < step ? 'var(--ok)' : n === step ? 'var(--accent)' : 'var(--border)'}`,
    color: n <= step ? '#fff' : 'var(--muted)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
  });

  return (
    <AppLayout active="multiSite">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => nav('multiSite')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>← Back</button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Add New Site</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Connect a new warehouse, workshop, or logistics site to CPSL</div>
          </div>
        </div>

        <div style={{ maxWidth: 620 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
              {[1, 2, 3].map((n, idx) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={stepDot(n) as React.CSSProperties}>{n < step ? '✓' : n}</div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: n === step ? 'var(--text)' : 'var(--muted)' }}>
                      {['Site Details', 'Data Sources', 'Confirm'][idx]}
                    </span>
                  </div>
                  {idx < 2 && <div style={{ flex: 1, height: 1, background: 'var(--border)', margin: '0 12px' }} />}
                </div>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && <>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Site Details</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>Enter basic information about your site.</div>
              <Field label="Site Name *">
                <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="e.g. Western Deals Ltd — Birmingham Warehouse" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Site Type *">
                  <select value={type} onChange={e => setType(e.target.value as SiteType)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select type...</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="workshop">Vehicle Workshop</option>
                    <option value="logistics">Logistics Hub</option>
                    <option value="supply">Supply Chain Depot</option>
                  </select>
                </Field>
                <Field label="City / Location *">
                  <input value={city} onChange={e => setCity(e.target.value)} style={inputStyle} placeholder="e.g. Birmingham" />
                </Field>
              </div>
              <Field label="Site Address">
                <input value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} placeholder="Full address" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Contact Person">
                  <input value={contact} onChange={e => setContact(e.target.value)} style={inputStyle} placeholder="Site manager name" />
                </Field>
                <Field label="Contact Email">
                  <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} style={inputStyle} placeholder="manager@co.uk" />
                </Field>
              </div>
              <WizFooter onBack={() => nav('multiSite')} backLabel="Cancel" onNext={next} nextLabel="Next: Data Sources →" />
            </>}

            {/* Step 2 */}
            {step === 2 && <>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Data Sources</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>Select which data sources are available. CPSL works with your existing hardware — no replacements needed.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {sourceItems.map(({ key, icon, label, sub }) => (
                  <div key={key} onClick={() => setSources(p => ({ ...p, [key]: !p[key] }))}
                    style={{ background: sources[key] ? 'rgba(26,127,232,0.07)' : 'var(--surface2)', border: `2px solid ${sources[key] ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: 18 }}>{icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                      <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: 4, border: `2px solid ${sources[key] ? 'var(--accent)' : 'var(--border)'}`, background: sources[key] ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>
                        {sources[key] ? '✓' : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <Field label="CCTV System">
                  <select style={{ ...inputStyle, cursor: 'pointer' }}><option>Hikvision</option><option>Dahua</option><option>Axis</option><option>Generic ONVIF</option></select>
                </Field>
                <Field label="Access System">
                  <select style={{ ...inputStyle, cursor: 'pointer' }}><option>Paxton Net2</option><option>HID</option><option>Honeywell</option><option>Generic</option></select>
                </Field>
              </div>
              <Field label="Edge Hardware">
                <select style={{ ...inputStyle, cursor: 'pointer' }}><option>NVIDIA Jetson (Recommended)</option><option>Raspberry Pi 5</option><option>Existing server</option></select>
              </Field>
              <WizFooter onBack={() => setStep(1)} onNext={next} nextLabel="Next: Confirm →" />
            </>}

            {/* Step 3 */}
            {step === 3 && <>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Confirm & Create Site</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>Review your site details before creating.</div>
              <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                {[['Site Name', name], ['Type', type], ['Location', city + (address ? ', ' + address : '')], ['Contact', contact + (contactEmail ? ` (${contactEmail})` : '')], ['Data Sources', Object.entries(sources).filter(([, v]) => v).map(([k]) => k).join(', ')]].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                    <span style={{ color: 'var(--muted)' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                ✓ CPSL will begin learning your site baseline immediately. Full anomaly detection activates after 48 hours of learning.
              </div>
              <WizFooter onBack={() => setStep(2)} onNext={create} nextLabel="✓ Create Site & Start Monitoring" nextGreen />
            </>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function WizFooter({ onBack, backLabel = '← Back', onNext, nextLabel = 'Next →', nextGreen = false }: { onBack: () => void; backLabel?: string; onNext: () => void; nextLabel?: string; nextGreen?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
      <button onClick={onBack} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '9px 20px', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>{backLabel}</button>
      <button onClick={onNext} style={{ background: nextGreen ? 'var(--ok)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{nextLabel}</button>
    </div>
  );
}
