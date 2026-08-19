import { useEffect, useCallback } from 'react';
import { useStore } from './store';

export function useMonitoring() {
  const { state, dispatch } = useStore();
  const monitoring = state.monitoring;

  // Timer effect that runs continuously
  useEffect(() => {
    if (!monitoring.isActive || !monitoring.startTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(monitoring.startTime!).getTime();
      const elapsedSeconds = Math.floor((now - startTime) / 1000) + (monitoring.pausedAt || 0);

      dispatch({ type: 'UPDATE_MONITORING_TIME', elapsedSeconds });
    }, 100); // Update every 100ms for smooth display

    return () => clearInterval(interval);
  }, [monitoring.isActive, monitoring.startTime, monitoring.pausedAt, dispatch]);

  const startMonitoring = useCallback((siteId: string) => {
    dispatch({ type: 'START_MONITORING', siteId });
  }, [dispatch]);

  const stopMonitoring = useCallback(() => {
    dispatch({ type: 'STOP_MONITORING' });
  }, [dispatch]);

  const pauseMonitoring = useCallback(() => {
    dispatch({ type: 'PAUSE_MONITORING' });
  }, [dispatch]);

  const resumeMonitoring = useCallback(() => {
    dispatch({ type: 'RESUME_MONITORING' });
  }, [dispatch]);

  return {
    monitoring,
    startMonitoring,
    stopMonitoring,
    pauseMonitoring,
    resumeMonitoring,
  };
}
