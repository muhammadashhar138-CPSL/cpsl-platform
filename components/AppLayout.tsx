'use client';

import Sidebar from './Sidebar';
import { Screen } from '@/lib/types';

export default function AppLayout({ active, children }: { active: Screen; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar active={active} />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
