export type SiteType = 'warehouse' | 'workshop' | 'logistics' | 'supply';
export type Severity = 'critical' | 'high' | 'medium';
export type Domain = 'cctv' | 'access' | 'machine' | 'network';

export interface Site {
  id: string;
  name: string;
  type: SiteType;
  city: string;
  address: string;
  contact: string;
  contactEmail: string;
  sources: Record<Domain, boolean>;
  monitoring: boolean;
  created: string;
}

export interface ChainEvent {
  domain: Domain;
  label: string;
  detail: string;
  conf: number;
}

export interface Incident {
  id: string;
  severity: Severity;
  title: string;
  threatScore: string;
  confidence: number;
  latency: number;
  gapsFilled: number;
  classification: string;
  siteName: string;
  siteType: SiteType;
  time: string;
  chain: ChainEvent[];
  narrative: string;
  response: string[];
}

export interface FeedItem {
  id: string;
  icon: string;
  event: string;
  time: string;
  isAnom: boolean;
  domain: Domain;
}

export type Screen =
  | 'login'
  | 'multiSite'       // 1. Multi-Site overview (home after login)
  | 'addSite'         // 2. Add site wizard
  | 'dashboard'       // 3. Main monitoring dashboard
  | 'incidentQueue'   // 4. Incident queue full page
  | 'dataSources'     // 5. Data sources feeds
  | 'siteBaselines'   // 6. Site baselines
  | 'alertRules'      // 7. Alert rules config
  | 'reports'         // 8. Reports + downloads
  | 'teamRoles'       // 9. Team & roles
  | 'settings'        // 10. Settings
  | 'incidentDetail'  // 11. Full incident detail page
  | 'profile'         // 12. Profile
  | 'help'            // 13. Help
  | 'about';          // 14. About CPSL
