'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore, buildScenarios } from '@/lib/store';
import { useMonitoring } from '@/lib/useMonitoring';
import AppLayout from '../AppLayout';
import CameraGrid from '../CameraGrid';
import AlertManagerModal from '../AlertManagerModal';
import IncidentDetailModal from '../IncidentDetailModal';
import { Domain, FeedItem, Incident } from '@/lib/types';
import { generateReport } from '@/lib/report';

const domColors: Record<Domain, string> = { cctv: '#1a7fe8', access: '#22c55e', machine: '#f59e0b', network: '#ef4444' };
const domIcons: Record<Domain, string> = { cctv: '📷', access: '🔑', machine: '⚙️', network: '🌐' };

const normalTemplates: Record<string, Record<Domain, string[]>> = {
  warehouse: {
    cctv: ['Motion – Zone A Racking Aisle', 'Staff detected – Loading Bay', 'Vehicle at Main Gate', 'Zone C – clear', 'Forklift activity – Zone A', 'Personnel count 3 – Zone B'],
    access: ['Badge scan – Main Gate (Emp #047)', 'Entry – Bay Door 2', 'Exit – Staff Corridor', 'Visitor badge – Reception', 'Valid credential – Loading Bay'],
    machine: ['Forklift FL-04 – operational', 'Conveyor CB-2 – 85% capacity', 'Pallet Wrapper PW-1 – cycle OK', 'Temperature 18.3°C – nominal', 'Loading Crane – standby'],
    network: ['WMS sync – 192.168.1.45 normal', 'NVR heartbeat – OK', 'RFID reader – 12ms latency', 'Firewall: 0 blocked', 'ERP backup – scheduled'],
  },
  workshop: {
    cctv: ['Bay 1 – technician at lift', 'Customer in reception area', 'Bay 2 – MOT in progress', 'Parts store – staff entry', 'Bay 3 – clear'],
    access: ['Badge – Workshop Entry (Tech #T003)', 'Customer zone – 2 persons', 'Parts Store access – authorised', 'Office entry – manager'],
    machine: ['Hydraulic Lift HL-1 – operational', 'Diagnostic Terminal – running', 'Tyre Changer – idle', 'Brake Tester – calibrated'],
    network: ['Diagnostic PC – connected', 'Workshop system – synced', 'CCTV NVR – online', 'Manufacturer portal – OK'],
  },
  logistics: {
    cctv: ['Inbound dock – HGV arriving', 'Outbound dock – load complete', 'Cold storage – normal', 'Perimeter – clear'],
    access: ['Driver badge – Dock Gate A', 'Forklift operator – authorised', 'Cold store entry – compliance', 'Dispatch team – clocked in'],
    machine: ['Reach Truck RT-3 – 6km/h', 'Dock Leveller DL-1 – deployed', 'Refrigeration – 2°C nominal', 'Conveyor – running'],
    network: ['ERP Terminal – normal', 'Barcode server – connected', 'WMS sync – complete', 'Firewall – 0 alerts'],
  },
  supply: {
    cctv: ['Loading bay – activity normal', 'Packaging area – staff present', 'Security perimeter – clear'],
    access: ['Staff entry – authorised', 'Loading bay access – shift start', 'Security gate – vehicle checked'],
    machine: ['Packaging line – operational', 'Forklift #2 – running', 'Temperature monitor – nominal'],
    network: ['SAP system – connected', 'WMS – normal traffic', 'Firewall – clean'],
  },
};

function getNorm(type: string, domain: Domain) {
  const t = normalTemplates[type] || normalTemplates.warehouse;
  const arr = t[domain] || t.cctv;
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTime() { return new Date().toTimeString().slice(0, 8); }

export default function DashboardScreen() {
  const { state, dispatch } = useStore();
  const { monitoring, startMonitoring: globalStartMonitoring, stopMonitoring: globalStopMonitoring } = useMonitoring();
  const site = state.activeSite;

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [feeds, setFeeds] = useState<Record<Domain, FeedItem[]>>({ cctv: [], access: [], machine: [], network: [] });
  const [counts, setCounts] = useState<Record<Domain, number>>({ cctv: 0, access: 0, machine: 0, network: 0 });
  const [totalEvents, setTotalEvents] = useState(0);
  const [latency, setLatency] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [threatScore, setThreatScore] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [chainLatency, setChainLatency] = useState(0);
  const [chainEvents, setChainEvents] = useState<{ domain: Domain; label: string; time: string; conf: number }[]>([]);
  const [alertActive, setAlertActive] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [narText, setNarText] = useState('');
  const [narActive, setNarActive] = useState(false);
  const [narReady, setNarReady] = useState(false);
  const [incidentQueue, setIncidentQueue] = useState<Incident[]>([]);
  const [timeline, setTimeline] = useState<{ icon: string; color: string; ev: string; time: string }[]>([]);
  const [siteRisk, setSiteRisk] = useState<string>('Low');
  const [activeScenario, setActiveScenario] = useState<Incident | null>(null);
  const [uptime] = useState(() => `${Math.floor(Math.random() * 8 + 1)}h ${Math.floor(Math.random() * 59)}m`);
  const [alertManagerOpen, setAlertManagerOpen] = useState(false);
  const [alertManagerIncident, setAlertManagerIncident] = useState<Incident | null>(null);
  const [incidentDetailOpen, setIncidentDetailOpen] = useState(false);
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null);
  const [activityBars] = useState(() => Array.from({ length: 24 }, (_, i) => ({ hour: i, normal: Math.floor(Math.random() * 60 + 20), anomaly: Math.random() < 0.2 ? Math.floor(Math.random() * 40 + 10) : 0 })));

  const openAlertManager = useCallback((inc?: Incident) => {
    setAlertManagerIncident(inc || activeScenario);
    setAlertManagerOpen(true);
  }, [activeScenario]);

  const monTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const chainTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chainFired = useRef([false, false, false]);

  const addFeedItem = useCallback((domain: Domain, event: string, isAnom: boolean) => {
    const item: FeedItem = { id: Date.now() + Math.random() + '', icon: domIcons[domain], event, time: getTime(), isAnom, domain };
    setFeeds(prev => ({ ...prev, [domain]: [item, ...prev[domain]].slice(0, 12) }));
    setCounts(prev => ({ ...prev, [domain]: prev[domain] + 1 }));
    setTotalEvents(prev => prev + 1);
    setTimeline(prev => [{ icon: domIcons[domain], color: domColors[domain], ev: event, time: getTime() }, ...prev].slice(0, 8));
  }, []);

  const fireChain = useCallback((idx: number) => {
    try {
      console.log('fireChain called with idx:', idx, 'site:', site);
      if (!site) {
        console.error('No site selected, fireChain returning early');
        return;
      }
      const scenarios = buildScenarios(site);
      console.log('Scenarios built:', scenarios.length);
      const sc = scenarios[idx];
      if (!sc) {
        console.error('No scenario found at index:', idx);
        return;
      }
      console.log('Incident scenario:', sc);
      const riskLevel = sc.severity === 'critical' ? 'Critical' : sc.severity === 'high' ? 'High' : 'Medium';

    setActiveScenario(sc);
    setAlertActive(true);
    setAlertTitle(`Chain ID: ${sc.id} — ${sc.title}`);
    setSiteRisk(riskLevel);
    setIncidentQueue(prev => {
      const updated = [sc, ...prev.filter(i => i.id !== sc.id)];
      return updated;
    });

    // Add to global incidents queue
    dispatch({ type: 'ADD_INCIDENT', incident: sc });

    // Immediately sync to monitoring data
    dispatch({
      type: 'UPDATE_MONITORING_DATA',
      data: {
        activeScenario: sc,
        alertActive: true,
        alertTitle: `Chain ID: ${sc.id} — ${sc.title}`,
        siteRisk: riskLevel,
      },
    });

    // Open the incident detail modal first to show full incident info
    setTimeout(() => {
      console.log('Opening incident detail modal with scenario:', sc);
      setDetailIncident(sc);
      setIncidentDetailOpen(true);
    }, 500);

    let step = 0;
    const evs = sc.chain;

    const runStep = () => {
      if (step >= evs.length) {
        const threatScore = parseInt(sc.threatScore);
        const confidence = sc.confidence;
        setThreatScore(threatScore);
        setConfidence(confidence);
        setNarText(sc.narrative);
        setNarActive(true);
        setNarReady(true);

        // Persist to global state
        setTimeout(() => {
          dispatch({
            type: 'UPDATE_MONITORING_DATA',
            data: {
              threatScore,
              confidence,
              narText: sc.narrative,
              narActive: true,
              narReady: true,
              activeScenario: sc,
              alertActive: true,
              siteRisk: sc.severity === 'critical' ? 'Critical' : sc.severity === 'high' ? 'High' : 'Medium',
            },
          });
        }, 100);
        return;
      }
      const e = evs[step];
      addFeedItem(e.domain, e.label, true);
      const pct = (step + 1) / evs.length;
      setThreatScore(Math.floor(pct * parseInt(sc.threatScore)));
      setConfidence(Math.floor(pct * sc.confidence));
      setChainLatency(sc.latency);
      setChainEvents(prev => [...prev, { domain: e.domain, label: e.label, time: getTime(), conf: e.conf }]);
      step++;
      // Realistic: 6-10 seconds between chain steps (slower for real-world simulation)
      chainTimers.current.push(setTimeout(runStep, 6000 + Math.random() * 4000));
    };

    // First anomaly appears after 5 seconds
    chainTimers.current.push(setTimeout(runStep, 5000));
    } catch (error) {
      console.error('Error in fireChain:', error);
    }
  }, [site, dispatch, addFeedItem]);

  const handleStartMonitoring = useCallback(() => {
    console.log('handleStartMonitoring called, site:', site);
    if (site) {
      globalStartMonitoring(site.id);
      dispatch({ type: 'UPDATE_SITE', site: { ...site, monitoring: true } });

      // Realistic: one event every 5-8 seconds (slower for realistic simulation)
      monTimer.current = setInterval(() => {
        const domains: Domain[] = ['cctv', 'access', 'machine', 'network'];
        const d = domains[Math.floor(Math.random() * 4)];
        addFeedItem(d, getNorm(site.type || 'warehouse', d), false);
        setLatency(Math.floor(Math.random() * 60 + 180));
        setCpuUsage(Math.floor(Math.random() * 15 + 18));
      }, 5000 + Math.random() * 3000);

      // Realistic: Incidents fire at realistic intervals
      // First incident after 40-50 seconds
      // Second incident after 90-110 seconds
      // Third incident after 150-180 seconds
      chainFired.current = [false, false, false];
      console.log('Setting up realistic incident timers');
      chainTimers.current.push(setTimeout(() => {
        console.log('Incident 0 detected!');
        if (!chainFired.current[0]) { chainFired.current[0] = true; fireChain(0); }
      }, 40000 + Math.random() * 10000));

      chainTimers.current.push(setTimeout(() => {
        console.log('Incident 1 detected!');
        if (!chainFired.current[1]) { chainFired.current[1] = true; fireChain(1); }
      }, 90000 + Math.random() * 20000));

      chainTimers.current.push(setTimeout(() => {
        console.log('Incident 2 detected!');
        if (!chainFired.current[2]) { chainFired.current[2] = true; fireChain(2); }
      }, 150000 + Math.random() * 30000));
    } else {
      console.log('handleStartMonitoring: NO SITE AVAILABLE');
    }
  }, [site, dispatch, globalStartMonitoring, addFeedItem, fireChain]);

  const handleStopMonitoring = useCallback(() => {
    globalStopMonitoring();
    if (site) dispatch({ type: 'UPDATE_SITE', site: { ...site, monitoring: false } });
    if (monTimer.current) clearInterval(monTimer.current);
    chainTimers.current.forEach(clearTimeout);
    chainTimers.current = [];
  }, [site, dispatch, globalStopMonitoring]);

  const toggleMonitoring = () => {
    if (monitoring.isActive) {
      handleStopMonitoring();
    } else {
      setChainEvents([]); setThreatScore(null); setConfidence(0);
      setAlertActive(false); setNarReady(false); setNarActive(false); setNarText('');
      handleStartMonitoring();
    }
  };

  // Load monitoring data from global state when component mounts
  useEffect(() => {
    const globalData = state.monitoringData;
    if (globalData && globalData.feeds && Object.keys(globalData.feeds).length > 0) {
      setFeeds(globalData.feeds);
      setCounts(globalData.counts);
      setTotalEvents(globalData.totalEvents);
      setLatency(globalData.latency);
      setCpuUsage(globalData.cpuUsage);
      setThreatScore(globalData.threatScore);
      setConfidence(globalData.confidence);
      setChainLatency(globalData.chainLatency);
      setChainEvents(globalData.chainEvents);
      setAlertActive(globalData.alertActive);
      setAlertTitle(globalData.alertTitle);
      setNarText(globalData.narText);
      setNarActive(globalData.narActive);
      setNarReady(globalData.narReady);
      setIncidentQueue(globalData.incidentQueue);
      setTimeline(globalData.timeline);
      setSiteRisk(globalData.siteRisk);
      setActiveScenario(globalData.activeScenario);
    }
  }, [state.monitoringData]);

  // Sync all state changes to global state periodically
  useEffect(() => {
    if (monitoring.isActive) {
      const syncInterval = setInterval(() => {
        dispatch({
          type: 'UPDATE_MONITORING_DATA',
          data: {
            feeds,
            counts,
            totalEvents,
            latency,
            cpuUsage,
            threatScore,
            confidence,
            chainLatency,
            chainEvents,
            alertActive,
            alertTitle,
            narText,
            narActive,
            narReady,
            incidentQueue,
            timeline,
            siteRisk,
            activeScenario,
          },
        });
      }, 1000); // Sync every second

      return () => clearInterval(syncInterval);
    }
  }, [
    monitoring.isActive,
    dispatch,
    feeds,
    counts,
    totalEvents,
    latency,
    cpuUsage,
    threatScore,
    confidence,
    chainLatency,
    chainEvents,
    alertActive,
    alertTitle,
    narText,
    narActive,
    narReady,
    incidentQueue,
    timeline,
    siteRisk,
    activeScenario,
  ]);

  useEffect(() => {
    if (!site) return;
    // If monitoring was active from global state, continue it
    if (monitoring.isActive && monitoring.activeSiteId === site.id) {
      monTimer.current = setInterval(() => {
        const domains: Domain[] = ['cctv', 'access', 'machine', 'network'];
        const d = domains[Math.floor(Math.random() * 4)];
        addFeedItem(d, getNorm(site.type || 'warehouse', d), false);
        setLatency(Math.floor(Math.random() * 60 + 180));
        setCpuUsage(Math.floor(Math.random() * 15 + 18));
      }, 2500 + Math.random() * 1500);
    }

    return () => {
      if (monTimer.current) clearInterval(monTimer.current);
      // Don't clear chainTimers here - they're managed by handleStopMonitoring
    };
  }, [site?.id, monitoring.isActive, monitoring.activeSiteId, addFeedItem]); // eslint-disable-line

  const openModal = (inc: Incident) => dispatch({ type: 'SET_MODAL_INCIDENT', incident: inc });
  const openDetail = (inc: Incident) => {
    dispatch({ type: 'SET_DETAIL_INCIDENT', incident: inc });
    dispatch({ type: 'SET_SCREEN', screen: 'incidentDetail' });
  };

  const riskColor = siteRisk === 'Critical' ? 'var(--danger)' : siteRisk === 'High' ? 'var(--warn)' : siteRisk === 'Medium' ? 'var(--accent)' : 'var(--ok)';
  const typeIcons: Record<string, string> = { warehouse: '🏭', workshop: '🔧', logistics: '🚚', supply: '📦' };

  // PHYSICAL domains: cctv, access, machine — CYBER domains: network
  const domainType = (d: Domain) => d === 'network' ? 'CYBER' : 'PHYSICAL';
  const domainTypeColor = (d: Domain) => d === 'network' ? '#8b5cf6' : '#06b6d4';

  if (!site) {
    return (
      <AppLayout active="dashboard">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 48 }}>🏭</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Select a site first to see monitoring</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 420 }}>No site is currently selected. Choose a site to begin real-time cross-domain monitoring and threat analysis.</div>
          <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'multiSite' })}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ⊞ Go to Multi-Site — Select a Site
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
    {incidentDetailOpen && (
      <IncidentDetailModal
        incident={detailIncident}
        onClose={() => setIncidentDetailOpen(false)}
        onAlert={() => {
          setIncidentDetailOpen(false);
          setAlertManagerIncident(detailIncident);
          setAlertManagerOpen(true);
        }}
      />
    )}
    {alertManagerOpen && <AlertManagerModal incident={alertManagerIncident} onClose={() => setAlertManagerOpen(false)} />}
    <AppLayout active="dashboard">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {typeIcons[site?.type || 'warehouse']} {site?.name || 'No site selected'}
            </div>
            {monitoring.isActive ? (
              <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', color: 'var(--ok)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)', animation: 'blink 1.5s infinite' }} /> LIVE · {formatTime(monitoring.elapsedSeconds)}
              </div>
            ) : (
              <div style={{ background: 'rgba(100,116,139,0.12)', border: '1px solid var(--border)', color: 'var(--muted)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>⏸ PAUSED</div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              { label: 'Events', value: totalEvents.toString() },
              { label: 'Latency', value: latency ? latency + 'ms' : '—' },
              { label: 'Uptime', value: uptime },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 20, fontSize: 11 }}>
                {s.label}: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
            <button onClick={toggleMonitoring}
              style={{ background: monitoring.isActive ? 'var(--danger)' : 'var(--ok)', color: monitoring.isActive ? '#fff' : '#000', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {monitoring.isActive ? '⏸ Stop Monitoring' : '▶ Start Monitoring'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', overflow: 'hidden' }}>
          <main style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {!monitoring.isActive ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 48 }}>⏸</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Monitoring Paused</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 380 }}>All data source feeds are paused. Click Start Monitoring to resume real-time analysis.</div>
                <button onClick={toggleMonitoring} style={{ background: 'var(--ok)', color: '#000', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>▶ Start Monitoring</button>
              </div>
            ) : <>

              {/* Stats row — from Figma */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {[
                  { label: 'SITE RISK SCORE', value: threatScore ?? '—', sub: alertActive ? '↑ Active Investigation' : 'Nominal', color: threatScore && threatScore > 75 ? 'var(--danger)' : threatScore && threatScore > 50 ? 'var(--warn)' : 'var(--ok)' },
                  { label: 'ACTIVE INCIDENTS', value: incidentQueue.length, sub: incidentQueue.filter(i => i.severity === 'critical').length + ' critical · ' + incidentQueue.filter(i => i.severity === 'high').length + ' high', color: incidentQueue.length > 0 ? 'var(--danger)' : 'var(--ok)' },
                  { label: 'SUSPICION CHAINS', value: chainEvents.length > 0 ? Math.ceil(chainEvents.length / 2) : 0, sub: 'Cross-domain sequences', color: 'var(--chain)' },
                  { label: 'CORRELATION RATE', value: confidence > 0 ? confidence + '%' : '94%', sub: 'Above detection threshold', color: 'var(--ok)' },
                  { label: 'FALSE POSITIVES', value: '↓ 95%', sub: 'vs generic IT tools', color: 'var(--ok)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Alert banner */}
              {alertActive && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.45)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, animation: 'pulseRed 2s infinite' }}>
                  <div style={{ fontSize: 20 }}>🚨</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: 13 }}>CRITICAL — Active Suspicion Chain Detected</div>
                    <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>{alertTitle}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {incidentQueue[0] && <>
                      <button onClick={() => openModal(incidentQueue[0])} style={alertBtn('var(--danger)', '#fff')}>Investigate →</button>
                      <button onClick={() => generateReport(incidentQueue[0])} style={alertBtn('transparent', 'var(--danger)', 'var(--danger)')}>📥 Report</button>
                      <button onClick={() => openAlertManager(incidentQueue[0])} style={alertBtn('transparent', 'var(--warn)', 'var(--warn)')}>📧 Alert Manager</button>
                    </>}
                  </div>
                </div>
              )}

              {/* CCTV Camera Grid */}
              <CameraGrid alertActive={alertActive} monitoring={monitoring.isActive} />

              {/* IRE Suspicion Chain */}
              <Section title="⛓ Suspicion Chain" badge="IRE ENGINE ACTIVE">
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                    <div style={{ textAlign: 'center', minWidth: 60 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, color: threatScore == null ? 'var(--muted)' : threatScore > 75 ? 'var(--danger)' : threatScore > 50 ? 'var(--warn)' : 'var(--ok)' }}>
                        {threatScore ?? '—'}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Threat Score</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 5 }}>
                        <span>IRE Confidence (Novel Point C — Partial Evidence Reconstruction)</span>
                        <span style={{ fontWeight: 700, color: confidence > 0 ? 'var(--accent)' : 'var(--muted)' }}>{confidence}%</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--border)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: confidence + '%', background: `linear-gradient(90deg, var(--accent), var(--danger))`, borderRadius: 3, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ok)' }}>{chainLatency || '—'}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>ms latency</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 4, gap: 2 }}>
                    {chainEvents.length === 0 ? (
                      <div style={{ color: 'var(--muted)', fontSize: 12, padding: '8px 4px' }}>Monitoring all sources — suspicion chain appears when correlated anomalies are detected...</div>
                    ) : chainEvents.map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        {i > 0 && <div style={{ color: 'var(--chain)', fontSize: 16, padding: '0 4px' }}>→</div>}
                        <div style={{ background: 'rgba(139,92,246,0.08)', border: `1px solid rgba(139,92,246,0.3)`, borderTop: `2px solid ${domColors[e.domain]}`, borderRadius: 8, padding: '8px 12px', minWidth: 130 }}>
                          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>{e.domain}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{e.label}</div>
                          <span style={{ fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 3, background: domainType(e.domain) === 'CYBER' ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.15)', color: domainTypeColor(e.domain), letterSpacing: 0.5 }}>
                            {domainType(e.domain)}
                          </span>
                          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{e.time}</div>
                          <div style={{ fontSize: 10, color: 'var(--chain)', fontWeight: 700, marginTop: 2 }}>Conf: {e.conf}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              {/* 4 Live Feeds */}
              <Section title="◈ Live Data Source Feeds">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {(['cctv', 'access', 'machine', 'network'] as Domain[]).map(d => (
                    <div key={d} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: domColors[d], animation: monitoring && site?.sources[d] ? 'blink 2s infinite' : 'none' }} />
                          {d === 'cctv' ? 'CCTV Metadata' : d === 'access' ? 'Access Control' : d === 'machine' ? 'Machine Telemetry' : 'Network Telemetry'}
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--muted)', background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4 }}>{counts[d]}</span>
                      </div>
                      <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                        {feeds[d].length === 0 ? (
                          <div style={{ padding: '12px 14px', color: 'var(--muted)', fontSize: 11 }}>Waiting for events...</div>
                        ) : feeds[d].map(item => (
                          <div key={item.id} style={{ padding: '6px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 8, background: item.isAnom ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                            <span style={{ fontSize: 12, marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 11, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                                <span style={{ flex: 1 }}>{item.event}</span>
                                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: item.isAnom ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.12)', color: item.isAnom ? 'var(--danger)' : 'var(--ok)', flexShrink: 0 }}>
                                  {item.isAnom ? 'ANOMALY' : 'NORMAL'}
                                </span>
                              </div>
                              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* IRE Narrative (Novel Point D) */}
              <Section title="📋 IRE — Incident Reconstruction Engine">
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>Novel Point D: Operational Narrative Output</div>
                    <div style={{ fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10, background: narActive ? 'rgba(239,68,68,0.15)' : 'rgba(139,92,246,0.12)', border: narActive ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(139,92,246,0.3)', color: narActive ? 'var(--danger)' : 'var(--chain)' }}>
                      {narActive ? 'INCIDENT RECONSTRUCTED' : 'AWAITING DATA'}
                    </div>
                  </div>
                  {narText ? (
                    <div style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text)' }}
                      dangerouslySetInnerHTML={{ __html: narText.replace(/<div class="hbox">/g, '<div style="background:rgba(26,127,232,0.07);border-left:2px solid var(--accent);padding:8px 12px;border-radius:0 6px 6px 0;margin:10px 0;font-size:12px;">') }} />
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                      The Incident Reconstruction Engine (IRE) is monitoring all four data sources in real time. A plain-English incident narrative will be generated automatically when correlated anomalies form a suspicion chain. This is Novel Point D — operational narrative output instead of technical dashboards.
                    </div>
                  )}
                  {narReady && activeScenario && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                      <NarBtn primary onClick={() => openModal(activeScenario)}>🔍 Full Reconstruction</NarBtn>
                      <NarBtn onClick={() => generateReport(activeScenario)}>📥 Download Report</NarBtn>
                      <NarBtn onClick={() => openDetail(activeScenario)}>📄 View Full Detail</NarBtn>
                      <NarBtn onClick={() => openAlertManager(activeScenario)}>📧 Alert Security Team</NarBtn>
                      <NarBtn>📋 Log to Queue</NarBtn>
                    </div>
                  )}
                </div>
              </Section>

              {/* 24-hr Activity Chart */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>24-HR Event Activity vs Site Baseline</div>
                {alertActive && <div style={{ fontSize: 11, color: 'var(--danger)', marginBottom: 10 }}>● Anomaly threshold crossed at {chainEvents[0]?.time || '—'} — correlated across {chainEvents.length} domain{chainEvents.length !== 1 ? 's' : ''}</div>}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
                  {activityBars.map((bar, i) => {
                    const maxH = 60;
                    const normalH = Math.max(4, (bar.normal / 100) * maxH);
                    const anomH = bar.anomaly ? Math.max(4, (bar.anomaly / 60) * maxH) : 0;
                    const isNow = i === new Date().getHours();
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        {anomH > 0 && <div style={{ width: '100%', height: anomH, background: 'rgba(239,68,68,0.7)', borderRadius: '2px 2px 0 0', minHeight: 4 }} title={`Anomaly: ${bar.anomaly}`} />}
                        <div style={{ width: '100%', height: normalH - (anomH || 0), background: isNow ? 'rgba(26,127,232,0.8)' : 'rgba(26,127,232,0.3)', borderRadius: anomH ? '0' : '2px 2px 0 0', minHeight: 3 }} title={`Normal: ${bar.normal}`} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {[0, 6, 12, 18, 23].map(h => <span key={h} style={{ fontSize: 9, color: 'var(--muted)' }}>{String(h).padStart(2, '0')}:00</span>)}
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--muted)' }}>
                    <div style={{ width: 10, height: 8, background: 'rgba(26,127,232,0.4)', borderRadius: 2 }} /> Normal activity
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--muted)' }}>
                    <div style={{ width: 10, height: 8, background: 'rgba(239,68,68,0.7)', borderRadius: 2 }} /> Anomaly detected
                  </div>
                </div>
              </div>

              {/* Incident Queue */}
              <Section title="⚠ Active Incident Queue">
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Queue</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{incidentQueue.length} active</span>
                      <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'incidentQueue' })}
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--accent)', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>
                        View All →
                      </button>
                    </div>
                  </div>
                  {incidentQueue.length === 0 ? (
                    <div style={{ padding: 14, color: 'var(--muted)', fontSize: 12 }}>No active incidents — all systems nominal</div>
                  ) : incidentQueue.map((inc, i) => (
                    <div key={inc.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <SevBadge sev={inc.severity} />
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{inc.title}</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{inc.id} · {inc.chain.length} domains · Conf: {inc.confidence}%</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openModal(inc)} style={smallBtn}>Investigate</button>
                        <button onClick={() => generateReport(inc)} style={smallBtn}>📥</button>
                        <button onClick={() => openAlertManager(inc)} style={{ ...smallBtn, color: 'var(--warn)' }}>📧</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </>}
          </main>

          {/* Right panel */}
          <aside style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)', overflowY: 'auto', padding: 0, display: 'flex', flexDirection: 'column' }}>
            <RPanel title="IRE Performance">
              {[['Detection accuracy', '91%', 'ok'], ['False pos. reduction', '95%', 'ok'], ['Avg latency', '<500ms', 'ok'], ['Partial reconstruction', '94%', 'ok'], ['System uptime', '99.9%', 'ok']].map(([l, v, c]) => (
                <RRow key={l} label={l} value={v} color={c} />
              ))}
            </RPanel>

            <RPanel title="Site Baseline">
              {[['Access window', '07:00–19:00', 'accent'], ['Avg daily events', '1,247', ''], ['Site risk', siteRisk, siteRisk === 'Critical' ? 'danger' : siteRisk === 'High' ? 'warn' : siteRisk === 'Medium' ? 'accent' : 'ok'], ['CPU usage', cpuUsage ? cpuUsage + '%' : '—', ''], ['Data leaves site', 'Never', 'ok']].map(([l, v, c]) => (
                <RRow key={l} label={l} value={v} color={c} />
              ))}
            </RPanel>

            <RPanel title="Novel Points Active">
              {[
                { l: 'A', t: 'Brownfield Intelligence', c: '#f59e0b' },
                { l: 'B', t: 'Suspicion Chains', c: '#8b5cf6' },
                { l: 'C', t: 'IRE Reconstruction', c: '#1a7fe8' },
                { l: 'D', t: 'Narrative Output', c: '#22c55e' },
                { l: 'E', t: 'Response Guidance', c: '#ef4444' },
              ].map(n => (
                <div key={n.l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 11 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: n.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 9, color: '#fff', flexShrink: 0 }}>{n.l}</div>
                  <span style={{ color: 'var(--muted2)' }}>{n.t}</span>
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: monitoring ? 'var(--ok)' : 'var(--muted)', animation: monitoring ? 'blink 2s infinite' : 'none' }} />
                </div>
              ))}
            </RPanel>

            <RPanel title="Recent Activity">
              {timeline.length === 0 ? (
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>No activity yet</div>
              ) : timeline.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '4px 0' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: e.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, marginTop: 1 }}>{e.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text)', lineHeight: 1.3 }}>{e.ev}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)' }}>{e.time}</div>
                  </div>
                </div>
              ))}
            </RPanel>
          </aside>
        </div>
      </div>
    </AppLayout>
    </>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

const smallBtn: React.CSSProperties = { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' };

function alertBtn(bg: string, color: string, border?: string): React.CSSProperties {
  return { background: bg, color, border: `1px solid ${border || bg}`, borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' };
}

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        {title}
        {badge && <span style={{ background: 'var(--chain)', color: '#fff', fontSize: 9, padding: '1px 6px', borderRadius: 10, fontWeight: 700, letterSpacing: 0.5 }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function RPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function RRow({ label, value, color }: { label: string; value: string; color?: string }) {
  const clr: Record<string, string> = { ok: 'var(--ok)', warn: 'var(--warn)', danger: 'var(--danger)', accent: 'var(--accent)' };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 11 }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontWeight: 700, color: (color && clr[color]) || 'var(--text)' }}>{value}</span>
    </div>
  );
}

function NarBtn({ children, onClick, primary }: { children: React.ReactNode; onClick?: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick} style={{ background: primary ? 'rgba(26,127,232,0.12)' : 'var(--surface2)', border: `1px solid ${primary ? 'var(--accent)' : 'var(--border)'}`, color: primary ? 'var(--accent)' : 'var(--text)', padding: '6px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: primary ? 600 : 400 }}>
      {children}
    </button>
  );
}

function SevBadge({ sev }: { sev: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    critical: { bg: 'rgba(239,68,68,0.15)', color: 'var(--danger)' },
    high: { bg: 'rgba(245,158,11,0.15)', color: 'var(--warn)' },
    medium: { bg: 'rgba(26,127,232,0.15)', color: 'var(--accent)' },
  };
  const c = cfg[sev] || cfg.medium;
  return <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: c.bg, color: c.color }}>{sev.toUpperCase()}</span>;
}
