'use client';

import { useState } from 'react';
import { useStore, TeamMember } from '@/lib/store';
import AppLayout from '../AppLayout';

export default function TeamRolesScreen() {
  const { state, dispatch } = useStore();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Site Manager');

  const invite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const member: TeamMember = {
      id: 'tm-' + Date.now(),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      sites: [],
      status: 'invited',
    };
    dispatch({ type: 'ADD_TEAM_MEMBER', member });
    setInviteName(''); setInviteEmail(''); setShowInvite(false);
  };

  const roleColors: Record<string, string> = {
    'Platform Admin': 'var(--danger)',
    'Security Analyst': 'var(--accent)',
    'Site Manager': 'var(--ok)',
    'Viewer': 'var(--muted)',
  };

  const inp: React.CSSProperties = { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--text)', padding: '8px 12px', outline: 'none', fontSize: 13 };

  return (
    <AppLayout active="teamRoles">
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Team & Roles</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Manage who has access to which sites and what they can do</div>
          </div>
          <button onClick={() => setShowInvite(!showInvite)}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            + Invite Member
          </button>
        </div>

        {/* Invite form */}
        {showInvite && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Invite New Team Member</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Full Name</label><input value={inviteName} onChange={e => setInviteName(e.target.value)} style={inp} placeholder="Jane Smith" /></div>
              <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Email</label><input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={inp} placeholder="jane@company.co.uk" /></div>
              <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  <option>Platform Admin</option><option>Security Analyst</option><option>Site Manager</option><option>Viewer</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={invite} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Send Invite</button>
              <button onClick={() => setShowInvite(false)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 7, padding: '8px 18px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Team table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 200px 120px 100px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
            {['Member', 'Role', 'Email', 'Status', 'Actions'].map(h => (
              <div key={h} style={{ padding: '9px 16px', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</div>
            ))}
          </div>
          {state.team.map(m => (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 200px 120px 100px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--muted2)', flexShrink: 0 }}>
                  {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</span>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: roleColors[m.role] || 'var(--muted)' }}>{m.role}</span>
              </div>
              <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)' }}>{m.email}</div>
              <div style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: m.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: m.status === 'active' ? 'var(--ok)' : 'var(--warn)' }}>
                  {m.status === 'active' ? '● Active' : '◌ Invited'}
                </span>
              </div>
              <div style={{ padding: '12px 16px' }}>
                {m.id !== 't1' && (
                  <button onClick={() => dispatch({ type: 'REMOVE_TEAM_MEMBER', id: m.id })}
                    style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--danger)', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Roles description */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
          {[
            { role: 'Platform Admin', desc: 'Full access to all sites, settings, team management, and alert rules', color: 'var(--danger)' },
            { role: 'Security Analyst', desc: 'Can view all incidents, download reports, and configure alert rules', color: 'var(--accent)' },
            { role: 'Site Manager', desc: 'Can view and manage assigned sites only. Can download reports.', color: 'var(--ok)' },
            { role: 'Viewer', desc: 'Read-only access to dashboards and reports for assigned sites', color: 'var(--muted)' },
          ].map(r => (
            <div key={r.role} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: r.color, marginBottom: 6 }}>{r.role}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
