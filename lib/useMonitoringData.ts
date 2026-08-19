import { useCallback } from 'react';
import { useStore } from './store';
import { Domain, FeedItem, Incident } from './types';

export function useMonitoringData() {
  const { state, dispatch } = useStore();
  const data = state.monitoringData;

  const addFeedItem = useCallback((domain: Domain, event: string, isAnom: boolean) => {
    const item: FeedItem = {
      id: Date.now() + Math.random() + '',
      icon: { cctv: '📷', access: '🔑', machine: '⚙️', network: '🌐' }[domain],
      event,
      time: new Date().toTimeString().slice(0, 8),
      isAnom,
      domain,
    };
    dispatch({ type: 'ADD_FEED_ITEM', domain, item });
  }, [dispatch]);

  const updateMetrics = useCallback((latency: number, cpuUsage: number) => {
    dispatch({
      type: 'UPDATE_MONITORING_METRICS',
      latency,
      cpuUsage,
      totalEvents: data.totalEvents + 1,
    });
  }, [dispatch, data.totalEvents]);

  const setAlertState = useCallback((alertActive: boolean, alertTitle: string) => {
    dispatch({
      type: 'UPDATE_MONITORING_DATA',
      data: { alertActive, alertTitle },
    });
  }, [dispatch]);

  const setNarrativeState = useCallback((narText: string, narActive: boolean, narReady: boolean, threatScore: number, confidence: number) => {
    dispatch({
      type: 'UPDATE_MONITORING_DATA',
      data: { narText, narActive, narReady, threatScore, confidence },
    });
  }, [dispatch]);

  const setChainEvents = useCallback((chainEvents: any[]) => {
    dispatch({
      type: 'UPDATE_MONITORING_DATA',
      data: { chainEvents },
    });
  }, [dispatch]);

  const setSiteRisk = useCallback((siteRisk: string) => {
    dispatch({
      type: 'UPDATE_MONITORING_DATA',
      data: { siteRisk },
    });
  }, [dispatch]);

  const setIncidentQueue = useCallback((incidentQueue: Incident[]) => {
    dispatch({
      type: 'UPDATE_MONITORING_DATA',
      data: { incidentQueue },
    });
  }, [dispatch]);

  const setTimeline = useCallback((timeline: any[]) => {
    dispatch({
      type: 'UPDATE_MONITORING_DATA',
      data: { timeline },
    });
  }, [dispatch]);

  const setActiveScenario = useCallback((scenario: Incident | null) => {
    dispatch({
      type: 'SET_ACTIVE_SCENARIO',
      scenario,
    });
  }, [dispatch]);

  const clearData = useCallback(() => {
    dispatch({ type: 'CLEAR_MONITORING_DATA' });
  }, [dispatch]);

  return {
    data,
    addFeedItem,
    updateMetrics,
    setAlertState,
    setNarrativeState,
    setChainEvents,
    setSiteRisk,
    setIncidentQueue,
    setTimeline,
    setActiveScenario,
    clearData,
  };
}
