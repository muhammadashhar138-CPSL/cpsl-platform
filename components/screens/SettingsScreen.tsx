'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import AppLayout from '../AppLayout';
import { Settings } from '@/lib/settingsTypes';

export default function SettingsScreen() {
  const { state, dispatch } = useStore();
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'notifications' | 'privacy' | 'system' | 'billing'>('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<'api' | 'slack' | 'teams' | 'webhooks' | 'upgrade' | 'payment' | null>(null);
  const [apiKey, setApiKey] = useState('sk_live_' + Math.random().toString(36).substring(2, 15));
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/...');
  const [teamsWebhook, setTeamsWebhook] = useState('https://outlook.webhook.office.com/...');
  const [webhookUrl, setWebhookUrl] = useState('https://your-webhook-url.com/...');
  const [cardNumber, setCardNumber] = useState('4242');

  const [settings, setSettings] = useState<Settings>(state.settings || {
    siteName: 'CPSL Platform',
    siteType: 'platform',
    contactEmail: state.user?.email || 'admin@cpsl.co.uk',
    subscriptionLevel: 'enterprise',
    notifications: { emailAlerts: true, smsAlerts: false, incidentNotifications: true },
    dataRetention: 90,
    twoFactorEnabled: false,
    integrations: { slack: { configured: false }, teams: { configured: false }, webhooks: { configured: false } },
  });

  useEffect(() => {
    // Load settings from localStorage instead of API
    setLoading(false);
    const savedSettings = localStorage.getItem('cpsl_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Failed to parse settings:', err);
      }
    }
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage instead of API
      localStorage.setItem('cpsl_settings', JSON.stringify(settings));
      dispatch({ type: 'SET_SETTINGS', settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    // Client-side logout
    dispatch({ type: 'SET_USER', user: null });
    dispatch({ type: 'SET_AUTHENTICATED', isAuthenticated: false });
    dispatch({ type: 'SET_SCREEN', screen: 'login' });
  };

  const configureIntegration = (service: 'slack' | 'teams' | 'webhooks') => {
    setModal(service);
  };

  const saveIntegration = (service: 'slack' | 'teams' | 'webhooks') => {
    setSettings({
      ...settings,
      integrations: {
        ...settings.integrations,
        [service]: { configured: true, webhook: service === 'slack' ? slackWebhook : service === 'teams' ? teamsWebhook : '' }
      }
    });
    setModal(null);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => (
    <div onClick={() => onChange(!checked)} style={{ width: 42, height: 23, borderRadius: 12, background: checked ? 'var(--ok)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: checked ? 21 : 3, width: 17, height: 17, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{title}</div>
      {children}
    </div>
  );

  const Row = ({ label, sub, control }: { label: string; sub: string; control: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>
      </div>
      {control}
    </div>
  );

  const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, width: 500, maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>{title}</div>
        {children}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          {modal === 'api' ? (
            <button onClick={() => { setModal(null); }} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>Copy & Close</button>
          ) : modal === 'payment' ? (
            <button onClick={() => { setModal(null); }} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>Update Card</button>
          ) : modal === 'upgrade' ? (
            <button onClick={() => { setModal(null); }} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
          ) : (
            <button onClick={() => saveIntegration(modal as any)} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>Save Integration</button>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Data & Privacy' },
    { id: 'system', label: 'System' },
    { id: 'billing', label: 'Billing' },
  ] as const;

  if (loading) return <AppLayout active="settings"><div style={{ padding: '28px 32px' }}>Loading settings...</div></AppLayout>;

  return (
    <AppLayout active="settings">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: 900 }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Platform configuration and preferences</div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background: 'none', border: 'none', padding: '8px 12px', fontSize: 13, fontWeight: 600, color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : 'none',
            }}>{tab.label}</button>
          ))}
        </div>

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <>
            <Section title="Site Information">
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Site Name</label>
                <input value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 13, outline: 'none' }} />
              </div>
              <div style={{ padding: '16px 18px' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Contact Email</label>
                <input value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} type="email" style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 13, outline: 'none' }} />
              </div>
            </Section>

            <Section title="Subscription">
              <Row label="Subscription Level" sub="Current plan and features" control={
                <select value={settings.subscriptionLevel} onChange={e => setSettings({ ...settings, subscriptionLevel: e.target.value as any })} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', padding: '8px 12px', fontSize: 12, cursor: 'pointer' }}>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              } />
              <Row label="Platform Version" sub="CPSL v1.0 — TRL 7 Prototype" control={<span style={{ fontSize: 12, color: 'var(--muted)' }}>v1.0</span>} />
            </Section>
          </>
        )}

        {/* INTEGRATIONS TAB */}
        {activeTab === 'integrations' && (
          <Section title="Connected Services">
            <Row label="Slack Integration" sub={settings.integrations.slack?.configured ? 'Connected' : 'Not configured'} control={
              <button onClick={() => configureIntegration('slack')} style={{ background: settings.integrations.slack?.configured ? 'rgba(34,197,94,0.1)' : 'rgba(26,127,232,0.1)', border: settings.integrations.slack?.configured ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(26,127,232,0.3)', color: settings.integrations.slack?.configured ? '#22c55e' : 'var(--accent)', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                {settings.integrations.slack?.configured ? '✓ Configured' : 'Configure'}
              </button>
            } />
            <Row label="Microsoft Teams Integration" sub={settings.integrations.teams?.configured ? 'Connected' : 'Not configured'} control={
              <button onClick={() => configureIntegration('teams')} style={{ background: settings.integrations.teams?.configured ? 'rgba(34,197,94,0.1)' : 'rgba(26,127,232,0.1)', border: settings.integrations.teams?.configured ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(26,127,232,0.3)', color: settings.integrations.teams?.configured ? '#22c55e' : 'var(--accent)', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                {settings.integrations.teams?.configured ? '✓ Configured' : 'Configure'}
              </button>
            } />
            <Row label="Webhooks" sub={settings.integrations.webhooks?.configured ? 'Enabled' : 'Not configured'} control={
              <button onClick={() => configureIntegration('webhooks')} style={{ background: settings.integrations.webhooks?.configured ? 'rgba(34,197,94,0.1)' : 'rgba(26,127,232,0.1)', border: settings.integrations.webhooks?.configured ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(26,127,232,0.3)', color: settings.integrations.webhooks?.configured ? '#22c55e' : 'var(--accent)', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                {settings.integrations.webhooks?.configured ? '✓ Configured' : 'Configure'}
              </button>
            } />
          </Section>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <Section title="Alert Preferences">
            <Row label="Email Alerts" sub="Send email notification on critical incidents" control={
              <Toggle checked={settings.notifications.emailAlerts} onChange={val => setSettings({ ...settings, notifications: { ...settings.notifications, emailAlerts: val } })} />
            } />
            <Row label="SMS Alerts" sub="Send SMS for critical security events" control={
              <Toggle checked={settings.notifications.smsAlerts} onChange={val => setSettings({ ...settings, notifications: { ...settings.notifications, smsAlerts: val } })} />
            } />
            <Row label="Incident Notifications" sub="In-app alerts when suspicion chains fire" control={
              <Toggle checked={settings.notifications.incidentNotifications} onChange={val => setSettings({ ...settings, notifications: { ...settings.notifications, incidentNotifications: val } })} />
            } />
          </Section>
        )}

        {/* DATA & PRIVACY TAB */}
        {activeTab === 'privacy' && (
          <>
            <Section title="Data Retention">
              <Row label="Retention Period" sub="How long to keep incident history and logs" control={
                <select value={settings.dataRetention} onChange={e => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', padding: '8px 12px', fontSize: 12, cursor: 'pointer' }}>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days</option>
                  <option value={365}>1 year</option>
                </select>
              } />
            </Section>
            <Section title="Privacy & Security">
              <Row label="Edge-First Processing" sub="All processing stays on-site — no raw data transmitted" control={
                <span style={{ fontSize: 11, padding: '4px 8px', background: 'rgba(34,197,94,0.2)', borderRadius: 4, color: '#22c55e' }}>✓ Enabled</span>
              } />
              <Row label="Two-Factor Authentication" sub={settings.twoFactorEnabled ? 'Enabled' : 'Disabled'} control={
                <Toggle checked={settings.twoFactorEnabled} onChange={val => setSettings({ ...settings, twoFactorEnabled: val })} />
              } />
            </Section>
          </>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <Section title="System Settings">
            <Row label="Signed in as" sub={state.user?.email || 'user@cpsl.co.uk'} control={<span style={{ fontSize: 12, color: 'var(--muted)' }}>Active</span>} />
            <Row label="API Access" sub="Manage API keys for integrations" control={
              <button onClick={() => setModal('api')} style={{ background: 'rgba(26,127,232,0.1)', border: '1px solid rgba(26,127,232,0.3)', color: 'var(--accent)', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                Manage
              </button>
            } />
            <Row label="Session Timeout" sub="Automatically log out after inactivity" control={
              <select defaultValue="30" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', padding: '8px 12px', fontSize: 12, cursor: 'pointer' }}>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="never">Never</option>
              </select>
            } />
            <Row label="Logout" sub="Sign out from this account" control={
              <button onClick={handleLogout} style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                Logout
              </button>
            } />
          </Section>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <>
            <Section title="Current Plan">
              <Row label="Plan" sub="Enterprise with unlimited sites and incidents" control={<span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Enterprise</span>} />
              <Row label="Billing Cycle" sub="Monthly subscription" control={<span style={{ fontSize: 12, color: 'var(--muted)' }}>Monthly</span>} />
              <Row label="Next Billing Date" sub="Your next payment is due" control={<span style={{ fontSize: 12, color: 'var(--muted)' }}>15 Sep 2026</span>} />
              <Row label="Action" sub="Upgrade or modify your plan" control={
                <button onClick={() => setModal('upgrade')} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  Upgrade
                </button>
              } />
            </Section>
            <Section title="Payment Method">
              <Row label="Card Ending in" sub="Visa" control={<span style={{ fontSize: 12, color: 'var(--muted)' }}>•••• {cardNumber}</span>} />
              <Row label="Update Payment" sub="Change your billing method" control={
                <button onClick={() => setModal('payment')} style={{ background: 'rgba(26,127,232,0.1)', border: '1px solid rgba(26,127,232,0.3)', color: 'var(--accent)', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  Update
                </button>
              } />
            </Section>
          </>
        )}

        {/* Save Button */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <button onClick={saveSettings} disabled={saving} style={{
            background: saved ? 'var(--ok)' : 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 700,
            fontSize: 13,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}>
            {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Modals */}
      {modal === 'api' && (
        <Modal title="API Keys" onClose={() => setModal(null)}>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Production Key</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all', color: 'var(--text)' }}>{apiKey}</div>
            <button onClick={() => navigator.clipboard.writeText(apiKey)} style={{ marginTop: 8, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>Copy Key</button>
          </div>
        </Modal>
      )}

      {modal === 'slack' && (
        <Modal title="Configure Slack" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Webhook URL</label>
            <input value={slackWebhook} onChange={e => setSlackWebhook(e.target.value)} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 12, outline: 'none' }} placeholder="https://hooks.slack.com/services/..." />
          </div>
        </Modal>
      )}

      {modal === 'teams' && (
        <Modal title="Configure Teams" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Webhook URL</label>
            <input value={teamsWebhook} onChange={e => setTeamsWebhook(e.target.value)} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 12, outline: 'none' }} placeholder="https://outlook.webhook.office.com/..." />
          </div>
        </Modal>
      )}

      {modal === 'webhooks' && (
        <Modal title="Configure Webhooks" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Webhook URL</label>
            <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 12, outline: 'none', marginBottom: 12 }} placeholder="https://your-webhook-url.com/..." />
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Events to Send</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                Incident Detection
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                Alert Triggered
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" style={{ cursor: 'pointer' }} />
                Settings Changed
              </label>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'payment' && (
        <Modal title="Update Payment Method" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Card Number</label>
            <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 12, outline: 'none', marginBottom: 12 }} placeholder="4242 4242 4242 4242" />

            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Expiry</label>
                <input style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 12, outline: 'none' }} placeholder="MM/YY" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>CVC</label>
                <input style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 12, outline: 'none' }} placeholder="123" />
              </div>
            </div>

            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Name on Card</label>
            <input style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 12px', fontSize: 12, outline: 'none' }} placeholder="Full Name" />
          </div>
        </Modal>
      )}

      {modal === 'upgrade' && (
        <Modal title="Upgrade Plan" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 12 }}>You are currently on the Enterprise plan. Contact our sales team for premium features or to discuss a custom plan tailored to your needs.</p>
            <button style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>Contact Sales</button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
