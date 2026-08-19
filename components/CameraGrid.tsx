'use client';

import { useEffect, useState } from 'react';

const CAMS = [
  { id: 'CAM-01', zone: 'Zone A', label: 'Main Entrance',   status: 'clear'  },
  { id: 'CAM-02', zone: 'Zone B', label: 'Loading Bay',     status: 'motion' },
  { id: 'CAM-03', zone: 'Zone C', label: 'Staff Entry',     status: 'alert'  },
  { id: 'CAM-04', zone: 'Zone D', label: 'Server Room',     status: 'alert'  },
  { id: 'CAM-05', zone: 'Zone A', label: 'Racking Aisle 1', status: 'clear'  },
  { id: 'CAM-06', zone: 'Zone B', label: 'Racking Aisle 2', status: 'motion' },
  { id: 'CAM-07', zone: 'Zone E', label: 'Fire Exit',       status: 'clear'  },
  { id: 'CAM-08', zone: 'Zone F', label: 'Perimeter N',     status: 'clear'  },
  { id: 'CAM-09', zone: 'Zone F', label: 'Perimeter S',     status: 'clear'  },
  { id: 'CAM-10', zone: 'Zone G', label: 'Office Corridor', status: 'motion' },
];

export default function CameraGrid({ alertActive, monitoring }: { alertActive: boolean; monitoring: boolean }) {
  const [time, setTime] = useState('00:00:00');

  // Live clock — the only per-second update. No CSS animations anywhere.
  useEffect(() => {
    setTime(new Date().toTimeString().slice(0, 8));
    if (!monitoring) return;
    const t = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000);
    return () => clearInterval(t);
  }, [monitoring]);

  return (
    <div style={{ background: '#0e1829', border: '1px solid #1c2d47', borderRadius: 10, overflow: 'hidden', width: '100%' }}>

      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #1c2d47', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>📹 CCTV Overview — 10 Cameras</span>
        <span style={{ fontSize: 11, color: monitoring ? '#22c55e' : '#4a6080' }}>
          {monitoring ? '● Live' : '○ Paused'} · {time}
        </span>
      </div>

      {/* Grid of camera boxes */}
      <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {CAMS.map(cam => {
          const isAlert  = alertActive ? (cam.id === 'CAM-03' || cam.id === 'CAM-04') : cam.status === 'alert';
          const isMotion = !isAlert && cam.status === 'motion';

          const border = isAlert ? '2px solid #ef4444' : isMotion ? '2px solid #f59e0b' : '1px solid #1c2d47';
          const bg     = isAlert ? '#2a0e0e' : isMotion ? '#2a1f0a' : '#0a1422';
          const tag    = isAlert ? 'ALERT' : isMotion ? 'MOTION' : 'CLEAR';
          const tagBg  = isAlert ? '#ef4444' : isMotion ? '#f59e0b' : '#22c55e';
          const tagFg  = isMotion ? '#000' : '#fff';

          return (
            <div key={cam.id} style={{
              height: 110,
              borderRadius: 8,
              border,
              background: bg,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 8,
              color: '#e2e8f0',
            }}>
              {/* top row: zone + status tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{cam.zone}</span>
                <span style={{ fontSize: 9, fontWeight: 800, background: tagBg, color: tagFg, padding: '1px 6px', borderRadius: 4 }}>{tag}</span>
              </div>

              {/* middle: camera id */}
              <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 800, letterSpacing: 0.5, color: 'rgba(255,255,255,0.9)' }}>
                {cam.id}
              </div>

              {/* bottom: label + time */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>{cam.label}</span>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
