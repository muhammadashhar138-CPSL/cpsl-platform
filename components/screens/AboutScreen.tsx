'use client';

import AppLayout from '../AppLayout';

export default function AboutScreen() {
  return (
    <AppLayout active="about">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: 860 }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>About CPSL</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>Cyber-Physical Security Layer — Platform Overview</div>

        <div style={{ background: 'linear-gradient(135deg, rgba(26,127,232,0.1) 0%, rgba(139,92,246,0.05) 100%)', border: '1px solid rgba(26,127,232,0.2)', borderRadius: 14, padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, background: 'var(--accent)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#fff' }}>C</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>Cyber-Physical Security Layer</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Industrial Intelligence Platform for UK SMEs · TRL 7 Prototype</div>
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--muted2)' }}>
            CPSL introduces an innovative industrial intelligence platform that bridges the visibility gap for small-to-medium UK warehouses and vehicle workshops using AI-powered real-time incident reconstruction. By combining cross-domain signal fusion, computer vision metadata, and probabilistic modeling, the system enables the instant conversion of fragmented operational logs into coherent &ldquo;Incident Narratives.&rdquo;
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            { name: 'Muhammad Ashhar', role: 'Co-Founder · AI Architecture', init: 'MA', detail: 'Directed the AI model architecture, feature extraction, and classification models for cross-domain anomaly detection. MSc Cyber Security & Forensics, University of Westminster.' },
            { name: 'Ahtisham Javed', role: 'Co-Founder · IoT Security', init: 'AJ', detail: 'Led IoT security validation and Incident Reconstruction logic. Professional background in logistics operations (FedEx Express). MSc Cyber Security & Forensics, University of Westminster.' },
          ].map(f => (
            <div key={f.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>{f.init}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{f.role}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted2)', lineHeight: 1.7 }}>{f.detail}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Platform Status</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'TRL Level', value: '7 — Operational Prototype', color: 'var(--ok)' },
              { label: 'IRE Accuracy', value: '91% in high-noise environments', color: 'var(--accent)' },
              { label: 'Latency', value: '<500ms correlation', color: 'var(--ok)' },
              { label: 'False Pos. Reduction', value: '95% vs. generic IT tools', color: 'var(--ok)' },
              { label: 'Data Sovereignty', value: 'Edge-only — never leaves site', color: 'var(--ok)' },
              { label: 'Visa Programme', value: 'UK Innovator Founder Visa', color: 'var(--accent)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
