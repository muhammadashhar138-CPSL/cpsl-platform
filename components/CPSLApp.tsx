'use client';

import { StoreProvider, useStore } from '@/lib/store';
import ErrorBoundary from './ErrorBoundary';
import LoginScreen from './screens/LoginScreen';
import MultiSiteScreen from './screens/MultiSiteScreen';
import AddSiteScreen from './screens/AddSiteScreen';
import DashboardScreen from './screens/MonitorScreen';
import IncidentQueueScreen from './screens/IncidentQueueScreen';
import DataSourcesScreen from './screens/DataSourcesScreen';
import SiteBaselinesScreen from './screens/SiteBaselinesScreen';
import AlertRulesScreen from './screens/AlertRulesScreen';
import ReportsScreen from './screens/ReportsScreen';
import TeamRolesScreen from './screens/TeamRolesScreen';
import SettingsScreen from './screens/SettingsScreen';
import IncidentDetailScreen from './screens/IncidentDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import HelpScreen from './screens/HelpScreen';
import AboutScreen from './screens/AboutScreen';
import IncidentModal from './IncidentModal';

function AppRouter() {
  const { state } = useStore();
  const s = state.screen;

  return (
    <>
      {s === 'login'          && <LoginScreen />}
      {s === 'multiSite'      && <MultiSiteScreen />}
      {s === 'addSite'        && <AddSiteScreen />}
      {s === 'dashboard'      && <DashboardScreen />}
      {s === 'incidentQueue'  && <IncidentQueueScreen />}
      {s === 'dataSources'    && <DataSourcesScreen />}
      {s === 'siteBaselines'  && <SiteBaselinesScreen />}
      {s === 'alertRules'     && <AlertRulesScreen />}
      {s === 'reports'        && <ReportsScreen />}
      {s === 'teamRoles'      && <TeamRolesScreen />}
      {s === 'settings'       && <SettingsScreen />}
      {s === 'incidentDetail' && <IncidentDetailScreen />}
      {s === 'profile'        && <ProfileScreen />}
      {s === 'help'           && <HelpScreen />}
      {s === 'about'          && <AboutScreen />}
      {state.modalIncident    && <IncidentModal />}
    </>
  );
}

export default function CPSLApp() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppRouter />
      </StoreProvider>
    </ErrorBoundary>
  );
}
