'use client';

import { useState } from 'react';
import { Incident } from '@/lib/types';

interface Props {
  incident: Incident | null;
  onClose: () => void;
}

const CONTACTS = [
  { name: 'James Patel', role: 'Site Manager', email: 'j.patel@westerndeals.co.uk', selected: true },
  { name: 'Muhammad Ashhar', role: 'Platform Admin', email: 'ashhar@cpsl.co.uk', selected: true },
  { name: 'Ahtisham Javed', role: 'Security Analyst', email: 'ahtisham@cpsl.co.uk', selected: false },
  { name: 'Security Control Room', role: 'On-call', email: 'security@cpsl.co.uk', selected: false },
];

export default function AlertManagerModal({ incident, onClose }: Props) {
  const [contacts, setContacts] = useState(CONTACTS);
  const [channel, setChannel] = useState<'email' | 'sms' | 'teams'>('email');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'standard'>('urgent');
  const [message, setMessage] = useState(
    incident ? `CPSL ALERT — ${incident.severity.toUpperCase()} incident detected at ${incident.siteName}.\n\nIncident: ${incident.title}\nChain ID: ${incident.id}\nIRE Confidence: ${incident.confidence}%\n\nImmediate action required. View full report in CPSL platform.` : ''
  );
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const toggle = (i: number) => setContacts(prev => prev.map((c, idx) => idx === i ? { ...c, selected: !c.selected } : c));

  const send = () => {
    const selected = contacts.filter(c => c.selected);
    if (selected.length === 0) { alert('Select at least one recipient.'); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  };

  const inp: React.CSSProperties = { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '8px 12px', outline: 'none', fontSize: 12, width: '100%' };

  return (
    <div onClick={e => { if ((e.target as HTMLElement).id === 'alert-overlay') onClose(); }}
      id="alert-overlay"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, width: 600, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: 26 }}>

        {sent ? (
          /* Success state */
          <div style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--ok)' }}>Alert Sent Successfully</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
              Notified {contacts.filter(c => c.selected).length} recipient{contacts.filter(c => c.selected).length !== 1 ? 's' : ''} via {channel === 'email' ? 'Email' : channel === 'sms' ? 'SMS' : 'Microsoft Teams'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--surface2)', borderRadius: 8, padding: '8px 14px', display: 'inline-block', marginBottom: 20 }}>
              {contacts.filter(c => c.selected).map(c => c.email).join(' · ')}
            </div>
            <br />
            <button onClick={onClose} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>📧 Alert Manager</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {incident ? `${incident.id} — ${incident.title}` : 'Send security alert'}
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Incident summary */}
            {incident && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ fontSize: 18 }}>🚨</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)' }}>{incident.severity.toUpperCase()} — {incident.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>IRE Confidence: {incident.confidence}% · {incident.chain.length} domains correlated</div>
                </div>
              </div>
            )}

            {/* Channel */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Channel</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {([['email', '📧', 'Email'], ['sms', '📱', 'SMS'], ['teams', '💬', 'MS Teams']] as const).map(([ch, ic, lb]) => (
                  <button key={ch} onClick={() => setChannel(ch)}
                    style={{ flex: 1, background: channel === ch ? 'rgba(26,127,232,0.12)' : 'var(--surface2)', border: `1px solid ${channel === ch ? 'var(--accent)' : 'var(--border)'}`, color: channel === ch ? 'var(--accent)' : 'var(--muted)', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: channel === ch ? 700 : 400, cursor: 'pointer' }}>
                    {ic} {lb}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Priority</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {([['urgent', '🔴', 'Urgent'], ['high', '🟠', 'High'], ['standard', '🟡', 'Standard']] as const).map(([p, ic, lb]) => (
                  <button key={p} onClick={() => setPriority(p)}
                    style={{ flex: 1, background: priority === p ? 'rgba(239,68,68,0.08)' : 'var(--surface2)', border: `1px solid ${priority === p ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`, color: priority === p ? 'var(--danger)' : 'var(--muted)', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: priority === p ? 700 : 400, cursor: 'pointer' }}>
                    {ic} {lb}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Recipients</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {contacts.map((c, i) => (
                  <div key={c.email} onClick={() => toggle(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: c.selected ? 'rgba(26,127,232,0.06)' : 'var(--surface2)', border: `1px solid ${c.selected ? 'rgba(26,127,232,0.3)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer' }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${c.selected ? 'var(--accent)' : 'var(--border)'}`, background: c.selected ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>
                      {c.selected ? '✓' : ''}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{c.role} · {c.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={send} disabled={sending}
                style={{ flex: 1, background: sending ? 'rgba(26,127,232,0.5)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 13, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {sending ? '⏳ Sending...' : `📤 Send Alert to ${contacts.filter(c => c.selected).length} recipient${contacts.filter(c => c.selected).length !== 1 ? 's' : ''}`}
              </button>
              <button onClick={onClose} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
