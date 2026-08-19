'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Site, Incident, Screen, Domain, FeedItem } from './types';
import { Settings } from './settingsTypes';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  sites: string[];
  status: 'active' | 'invited';
}

export interface AlertRule {
  id: string;
  name: string;
  domains: string[];
  threshold: number;
  severity: 'critical' | 'high' | 'medium';
  enabled: boolean;
}

export interface MonitoringSession {
  isActive: boolean;
  startTime: string | null;
  elapsedSeconds: number;
  activeSiteId: string | null;
  pausedAt?: number;
}

export interface MonitoringData {
  feeds: Record<Domain, FeedItem[]>;
  counts: Record<Domain, number>;
  totalEvents: number;
  latency: number;
  cpuUsage: number;
  threatScore: number | null;
  confidence: number;
  chainLatency: number;
  chainEvents: { domain: Domain; label: string; time: string; conf: number }[];
  alertActive: boolean;
  alertTitle: string;
  narText: string;
  narActive: boolean;
  narReady: boolean;
  incidentQueue: Incident[];
  timeline: { icon: string; color: string; ev: string; time: string }[];
  siteRisk: string;
  activeScenario: Incident | null;
}

interface AppState {
  screen: Screen;
  sites: Site[];
  allIncidents: Incident[];
  activeSite: Site | null;
  user: { name: string; email: string } | null;
  modalIncident: Incident | null;
  detailIncident: Incident | null;
  team: TeamMember[];
  alertRules: AlertRule[];
  settings: Settings | null;
  isAuthenticated: boolean;
  monitoring: MonitoringSession;
  monitoringData: MonitoringData;
}

type Action =
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'ADD_SITE'; site: Site }
  | { type: 'DELETE_SITE'; id: string }
  | { type: 'UPDATE_SITE'; site: Site }
  | { type: 'ADD_INCIDENT'; incident: Incident }
  | { type: 'SET_ACTIVE_SITE'; site: Site | null }
  | { type: 'SET_USER'; user: { name: string; email: string } | null }
  | { type: 'SET_MODAL_INCIDENT'; incident: Incident | null }
  | { type: 'SET_DETAIL_INCIDENT'; incident: Incident | null }
  | { type: 'ADD_TEAM_MEMBER'; member: TeamMember }
  | { type: 'REMOVE_TEAM_MEMBER'; id: string }
  | { type: 'TOGGLE_RULE'; id: string }
  | { type: 'LOAD_STORAGE'; sites: Site[]; incidents: Incident[] }
  | { type: 'SET_SETTINGS'; settings: Settings }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
  | { type: 'SET_AUTHENTICATED'; isAuthenticated: boolean }
  | { type: 'START_MONITORING'; siteId: string }
  | { type: 'STOP_MONITORING' }
  | { type: 'PAUSE_MONITORING' }
  | { type: 'RESUME_MONITORING' }
  | { type: 'UPDATE_MONITORING_TIME'; elapsedSeconds: number }
  | { type: 'LOAD_MONITORING_STATE'; monitoring: MonitoringSession }
  | { type: 'UPDATE_MONITORING_DATA'; data: Partial<MonitoringData> }
  | { type: 'ADD_FEED_ITEM'; domain: Domain; item: FeedItem }
  | { type: 'UPDATE_MONITORING_METRICS'; latency: number; cpuUsage: number; totalEvents: number }
  | { type: 'SET_ACTIVE_SCENARIO'; scenario: Incident | null }
  | { type: 'LOAD_MONITORING_DATA'; data: MonitoringData }
  | { type: 'CLEAR_MONITORING_DATA' }
  | { type: 'LOGOUT' };

const demoSites: Site[] = [
  {
    id: 's1',
    name: 'Western Deals Ltd — Birmingham Warehouse',
    type: 'warehouse',
    city: 'Birmingham',
    address: '14 Industrial Park, Smethwick, B66 2PA',
    contact: 'James Patel',
    contactEmail: 'j.patel@westerndeals.co.uk',
    sources: { cctv: true, access: true, machine: true, network: true },
    monitoring: false,
    created: new Date().toISOString(),
  },
  {
    id: 's2',
    name: 'Habib Trading Ltd — Vehicle Workshop',
    type: 'workshop',
    city: 'Birmingham',
    address: '22 Fordrough Lane, Birmingham, B9 5LQ',
    contact: 'Tariq Habib',
    contactEmail: 'tariq@habibtrading.co.uk',
    sources: { cctv: true, access: true, machine: true, network: false },
    monitoring: false,
    created: new Date().toISOString(),
  },
  {
    id: 's3',
    name: 'Eastern Trading Ltd — Supply Chain Depot',
    type: 'supply',
    city: 'Coventry',
    address: 'Unit 7, Rowleys Green Industrial Estate, CV6 6AW',
    contact: 'Sarah Ellis',
    contactEmail: 's.ellis@easterntrading.co.uk',
    sources: { cctv: true, access: true, machine: false, network: true },
    monitoring: false,
    created: new Date().toISOString(),
  },
];

const defaultTeam: TeamMember[] = [
  { id: 't1', name: 'Muhammad Ashhar', role: 'Platform Admin', email: 'ashhar@cpsl.co.uk', sites: ['s1', 's2', 's3'], status: 'active' },
  { id: 't2', name: 'Ahtisham Javed', role: 'Security Analyst', email: 'ahtisham@cpsl.co.uk', sites: ['s1', 's2', 's3'], status: 'active' },
  { id: 't3', name: 'James Patel', role: 'Site Manager', email: 'j.patel@westerndeals.co.uk', sites: ['s1'], status: 'active' },
  { id: 't4', name: 'Tariq Habib', role: 'Site Manager', email: 'tariq@habibtrading.co.uk', sites: ['s2'], status: 'invited' },
];

const defaultRules: AlertRule[] = [
  { id: 'r1', name: 'After-Hours Motion + Badge', domains: ['cctv', 'access'], threshold: 70, severity: 'critical', enabled: true },
  { id: 'r2', name: 'Unscheduled Machine Stoppage', domains: ['machine', 'network'], threshold: 75, severity: 'high', enabled: true },
  { id: 'r3', name: 'Tailgating Detection', domains: ['cctv', 'access'], threshold: 65, severity: 'high', enabled: true },
  { id: 'r4', name: 'Large Outbound Data Transfer', domains: ['network', 'access'], threshold: 80, severity: 'critical', enabled: true },
  { id: 'r5', name: 'Repeated Badge Failures', domains: ['access'], threshold: 60, severity: 'medium', enabled: false },
  { id: 'r6', name: 'Network Port Scan', domains: ['network'], threshold: 85, severity: 'high', enabled: true },
];

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SCREEN': return { ...state, screen: action.screen };
    case 'ADD_SITE': {
      const sites = [...state.sites, action.site];
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_sites', JSON.stringify(sites));
      return { ...state, sites };
    }
    case 'DELETE_SITE': {
      const sites = state.sites.filter(s => s.id !== action.id);
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_sites', JSON.stringify(sites));
      return { ...state, sites };
    }
    case 'UPDATE_SITE': {
      const sites = state.sites.map(s => s.id === action.site.id ? action.site : s);
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_sites', JSON.stringify(sites));
      return { ...state, sites };
    }
    case 'ADD_INCIDENT': {
      if (state.allIncidents.find(i => i.id === action.incident.id)) return state;
      const incidents = [...state.allIncidents, action.incident];
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_incidents', JSON.stringify(incidents));
      return { ...state, allIncidents: incidents };
    }
    case 'SET_ACTIVE_SITE': return { ...state, activeSite: action.site };
    case 'SET_USER': return { ...state, user: action.user };
    case 'SET_MODAL_INCIDENT': return { ...state, modalIncident: action.incident };
    case 'SET_DETAIL_INCIDENT': return { ...state, detailIncident: action.incident };
    case 'ADD_TEAM_MEMBER': return { ...state, team: [...state.team, action.member] };
    case 'REMOVE_TEAM_MEMBER': return { ...state, team: state.team.filter(m => m.id !== action.id) };
    case 'TOGGLE_RULE': return { ...state, alertRules: state.alertRules.map(r => r.id === action.id ? { ...r, enabled: !r.enabled } : r) };
    case 'LOAD_STORAGE': return { ...state, sites: action.sites, allIncidents: action.incidents };
    case 'SET_SETTINGS': return { ...state, settings: action.settings };
    case 'UPDATE_SETTINGS': {
      const settings = state.settings ? { ...state.settings, ...action.settings } : action.settings as Settings;
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_settings', JSON.stringify(settings));
      return { ...state, settings };
    }
    case 'SET_AUTHENTICATED': return { ...state, isAuthenticated: action.isAuthenticated };
    case 'START_MONITORING': {
      const monitoring = {
        isActive: true,
        startTime: new Date().toISOString(),
        elapsedSeconds: 0,
        activeSiteId: action.siteId,
      };
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_monitoring', JSON.stringify(monitoring));
      return { ...state, monitoring };
    }
    case 'STOP_MONITORING': {
      const monitoring = { ...state.monitoring, isActive: false, startTime: null, elapsedSeconds: 0, activeSiteId: null };
      if (typeof window !== 'undefined') localStorage.removeItem('cpsl_monitoring');
      return { ...state, monitoring };
    }
    case 'PAUSE_MONITORING': {
      const monitoring = { ...state.monitoring, isActive: false, pausedAt: state.monitoring.elapsedSeconds };
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_monitoring', JSON.stringify(monitoring));
      return { ...state, monitoring };
    }
    case 'RESUME_MONITORING': {
      const monitoring = { ...state.monitoring, isActive: true, startTime: new Date().toISOString() };
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_monitoring', JSON.stringify(monitoring));
      return { ...state, monitoring };
    }
    case 'UPDATE_MONITORING_TIME': {
      const monitoring = { ...state.monitoring, elapsedSeconds: action.elapsedSeconds };
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_monitoring', JSON.stringify(monitoring));
      return { ...state, monitoring };
    }
    case 'LOAD_MONITORING_STATE': {
      return { ...state, monitoring: action.monitoring };
    }
    case 'UPDATE_MONITORING_DATA': {
      const monitoringData = { ...state.monitoringData, ...action.data };
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_monitoring_data', JSON.stringify(monitoringData));
      return { ...state, monitoringData };
    }
    case 'ADD_FEED_ITEM': {
      const feeds = { ...state.monitoringData.feeds, [action.domain]: [action.item, ...state.monitoringData.feeds[action.domain]].slice(0, 12) };
      const counts = { ...state.monitoringData.counts, [action.domain]: state.monitoringData.counts[action.domain] + 1 };
      const monitoringData = { ...state.monitoringData, feeds, counts, totalEvents: state.monitoringData.totalEvents + 1 };
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_monitoring_data', JSON.stringify(monitoringData));
      return { ...state, monitoringData };
    }
    case 'UPDATE_MONITORING_METRICS': {
      const monitoringData = { ...state.monitoringData, latency: action.latency, cpuUsage: action.cpuUsage, totalEvents: action.totalEvents };
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_monitoring_data', JSON.stringify(monitoringData));
      return { ...state, monitoringData };
    }
    case 'SET_ACTIVE_SCENARIO': {
      const monitoringData = { ...state.monitoringData, activeScenario: action.scenario };
      if (typeof window !== 'undefined') localStorage.setItem('cpsl_monitoring_data', JSON.stringify(monitoringData));
      return { ...state, monitoringData };
    }
    case 'LOAD_MONITORING_DATA': {
      return { ...state, monitoringData: action.data };
    }
    case 'CLEAR_MONITORING_DATA': {
      if (typeof window !== 'undefined') localStorage.removeItem('cpsl_monitoring_data');
      return { ...state, monitoringData: defaultMonitoringData };
    }
    case 'LOGOUT': {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cpsl_sites');
        localStorage.removeItem('cpsl_incidents');
        localStorage.removeItem('cpsl_settings');
        localStorage.removeItem('cpsl_monitoring');
        localStorage.removeItem('cpsl_monitoring_data');
      }
      return { ...initialState, screen: 'login' };
    }
    default: return state;
  }
}

const defaultSettings: Settings = {
  siteName: 'CPSL Platform',
  siteType: 'platform',
  contactEmail: 'admin@cpsl.co.uk',
  subscriptionLevel: 'enterprise',
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    incidentNotifications: true,
  },
  dataRetention: 90,
  twoFactorEnabled: false,
  integrations: {
    slack: { configured: false },
    teams: { configured: false },
    webhooks: { configured: false },
  },
};

const defaultMonitoring: MonitoringSession = {
  isActive: false,
  startTime: null,
  elapsedSeconds: 0,
  activeSiteId: null,
};

const defaultMonitoringData: MonitoringData = {
  feeds: { cctv: [], access: [], machine: [], network: [] },
  counts: { cctv: 0, access: 0, machine: 0, network: 0 },
  totalEvents: 0,
  latency: 0,
  cpuUsage: 0,
  threatScore: null,
  confidence: 0,
  chainLatency: 0,
  chainEvents: [],
  alertActive: false,
  alertTitle: '',
  narText: '',
  narActive: false,
  narReady: false,
  incidentQueue: [],
  timeline: [],
  siteRisk: 'Low',
  activeScenario: null,
};

const initialState: AppState = {
  screen: 'login',
  sites: [],
  allIncidents: [],
  activeSite: null,
  user: null,
  modalIncident: null,
  detailIncident: null,
  team: defaultTeam,
  alertRules: defaultRules,
  settings: defaultSettings,
  isAuthenticated: false,
  monitoring: defaultMonitoring,
  monitoringData: defaultMonitoringData,
};

const StoreContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedSites = localStorage.getItem('cpsl_sites');
    const storedIncidents = localStorage.getItem('cpsl_incidents');
    const storedMonitoring = localStorage.getItem('cpsl_monitoring');
    const storedMonitoringData = localStorage.getItem('cpsl_monitoring_data');
    const sites = storedSites ? JSON.parse(storedSites) : demoSites;
    const incidents = storedIncidents ? JSON.parse(storedIncidents) : [];
    const monitoring = storedMonitoring ? JSON.parse(storedMonitoring) : defaultMonitoring;
    const monitoringData = storedMonitoringData ? JSON.parse(storedMonitoringData) : defaultMonitoringData;
    if (!storedSites) localStorage.setItem('cpsl_sites', JSON.stringify(demoSites));
    dispatch({ type: 'LOAD_STORAGE', sites, incidents });
    dispatch({ type: 'LOAD_MONITORING_STATE', monitoring });
    dispatch({ type: 'LOAD_MONITORING_DATA', data: monitoringData });
    // Auto-select first site for demo convenience
    if (sites.length > 0) {
      dispatch({ type: 'SET_ACTIVE_SITE', site: sites[0] });
    }
  }, []);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function buildScenarios(site: Site): Incident[] {
  const ts = Date.now().toString().slice(-5);
  return [
    {
      id: 'SC-' + ts,
      severity: 'critical',
      title: 'Unauthorized After-Hours Access + System Disruption',
      threatScore: '87',
      confidence: 91,
      latency: 342,
      gapsFilled: 2,
      classification: 'Insider Threat / Sabotage',
      siteName: site.name,
      siteType: site.type,
      time: new Date().toLocaleString(),
      chain: [
        { domain: 'cctv', label: 'Motion detected — out of hours', detail: 'Zone C – Staff Entry\n23:41 — No scheduled personnel', conf: 72 },
        { domain: 'access', label: 'Badge override used', detail: 'Server Room Entry\n23:43 — Unauthorised credential', conf: 88 },
        { domain: 'machine', label: 'System emergency stop', detail: 'Conveyor CB-2 shutdown\n23:44 — No maintenance logged', conf: 94 },
        { domain: 'network', label: 'Port scan initiated', detail: '192.168.1.45 → WMS\n23:45 — 847 anomalous packets', conf: 91 },
      ],
      narrative: `At <strong>23:41</strong>, the CPSL platform detected motion in <strong>Zone C (Staff Entry)</strong> outside scheduled personnel hours. No staff were listed as on-site at this time per the site baseline model. <em>Initial suspicion score: 72 — borderline anomaly.</em><div class="hbox">Within 2 minutes, a badge credential was used to access the <strong>Server Room Entry</strong> at 23:43. The credential belongs to an account with no authorised access to this zone during night hours. The IRE elevated this to a HIGH threat designation.</div>At <strong>23:44</strong>, an unscheduled <strong>emergency stop was triggered on Conveyor Belt CB-2</strong> — no maintenance window existed in the system. At <strong>23:45</strong>, network telemetry detected an anomalous port scan from workstation <strong>192.168.1.45</strong> targeting the Warehouse Management System — 847 packets outside the normal traffic profile.<br/><br/><strong>IRE Assessment:</strong> The four-domain sequence constitutes a cross-domain suspicion chain consistent with an <em>insider threat or coordinated intrusion attempt</em>. Two data gaps were filled probabilistically. Overall IRE confidence: <strong>91%</strong>.`,
      response: [
        'Dispatch security to Server Room Entry immediately',
        'Suspend badge credential used at 23:43 — lock access',
        'Preserve all network logs from 192.168.1.45 for forensic review',
        'Inspect Conveyor CB-2 for physical tampering before restart',
        'Notify site manager — log as Priority 1 incident',
      ],
    },
    {
      id: 'SC-' + (parseInt(ts) + 1),
      severity: 'high',
      title: 'Tailgating + Unauthorised Equipment Use',
      threatScore: '74',
      confidence: 84,
      latency: 287,
      gapsFilled: 1,
      classification: 'Physical Access Violation',
      siteName: site.name,
      siteType: site.type,
      time: new Date().toLocaleString(),
      chain: [
        { domain: 'cctv', label: 'Tailgating detected', detail: 'Loading Bay\n14:12 — 2 persons, 1 badge', conf: 79 },
        { domain: 'access', label: 'Single badge, dual entry', detail: 'Bay Door 2\n14:12 — One scan for two', conf: 85 },
        { domain: 'machine', label: 'Equipment unauthorised use', detail: 'Forklift FL-04 started\n14:17 — No key log recorded', conf: 81 },
      ],
      narrative: `At <strong>14:12</strong>, CCTV metadata from the <strong>Loading Bay</strong> recorded two individuals entering through Bay Door 2, but only one badge was scanned. The IRE identified this as a <em>tailgating event</em> — a physical access policy violation.<div class="hbox">Five minutes later at <strong>14:17</strong>, Forklift <strong>FL-04</strong> was activated without a corresponding key-log entry. The IRE correlates this as likely operated by the unregistered individual who tailgated entry.</div><strong>IRE Assessment:</strong> Two-domain suspicion chain with 84% confidence. One data gap filled probabilistically.`,
      response: [
        'Review CCTV recording — identify second individual',
        'Interview badge holder for Bay Door 2 at 14:12',
        'Inspect Forklift FL-04 for damage or irregular use',
        'Issue tailgating policy reminder to all shift workers',
        'Log as Medium Priority — escalate if individual not identified',
      ],
    },
    {
      id: 'SC-' + (parseInt(ts) + 2),
      severity: 'medium',
      title: 'Anomalous Data Transfer + Out-of-Pattern Admin Access',
      threatScore: '61',
      confidence: 78,
      latency: 198,
      gapsFilled: 0,
      classification: 'Potential Data Exfiltration',
      siteName: site.name,
      siteType: site.type,
      time: new Date().toLocaleString(),
      chain: [
        { domain: 'access', label: 'Early admin credential used', detail: 'Server Room\n09:21 — Outside normal admin hours', conf: 72 },
        { domain: 'network', label: 'Large outbound data transfer', detail: 'NVR → External IP\n09:23 — 2.3GB unrecognised destination', conf: 83 },
      ],
      narrative: `At <strong>09:21</strong>, an admin credential accessed the <strong>Server Room</strong> outside the normal operational window. Two minutes later at <strong>09:23</strong>, a <strong>2.3GB outbound data transfer</strong> from the CCTV NVR was detected to an unrecognised external IP address.<div class="hbox">The IRE correlates the timing of admin access and large data transfer as a probable intentional data exfiltration attempt.</div><strong>IRE Assessment:</strong> Two-domain chain with 78% confidence. Classified as potential data exfiltration pending investigation.`,
      response: [
        'Block outbound IP immediately at firewall level',
        'Preserve full network logs from 09:21–09:30',
        'Verify with admin credential holder — confirm if intentional',
        'Review NVR configuration for any unauthorised changes',
        'Escalate to IT security lead — potential reportable incident',
      ],
    },
  ];
}

export type { Action };
export { demoSites };
export type { AppState };
