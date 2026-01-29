
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, Notification, PlatformStats, SystemState } from '../types';

interface DomainContextType {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  integrations: ServiceIntegration[];
  setIntegrations: React.Dispatch<React.SetStateAction<ServiceIntegration[]>>;
  activityLogs: ActivityLog[];
  notifications: Notification[];
  system: SystemState;
  stats: PlatformStats;
  updateDomains: (fn: (prev: Domain[]) => Domain[]) => void;
  updateStrategy: (updates: Partial<PlatformStrategy>) => void;
  addLog: (agent: string, message: string, type?: ActivityLog['type']) => void;
  dispatchNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  connectService: (id: string, provider: string) => void;
  resetQuota: () => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domains, setDomains] = useState<Domain[]>(() => JSON.parse(globalThis.localStorage?.getItem('ist_domains') || '[]'));
  const [integrations, setIntegrations] = useState<ServiceIntegration[]>(() => JSON.parse(globalThis.localStorage?.getItem('ist_integrations') || '[]'));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [strategy, setStrategy] = useState<PlatformStrategy>(() => JSON.parse(globalThis.localStorage?.getItem('ist_strategy') || JSON.stringify({
    totalBudget: 50000,
    riskTolerance: 'Balanced',
    autoPilot: false,
    investmentThesis: ''
  })));

  useEffect(() => {
    globalThis.localStorage?.setItem('ist_domains', JSON.stringify(domains));
    globalThis.localStorage?.setItem('ist_strategy', JSON.stringify(strategy));
    globalThis.localStorage?.setItem('ist_integrations', JSON.stringify(integrations));
  }, [domains, strategy, integrations]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(x => x.id !== id));
  }, []);

  const dispatchNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = globalThis.crypto.randomUUID();
    setNotifications(prev => [...prev, { ...n, id }]);
    setTimeout(() => dismissNotification(id), n.type === 'critical' ? 10000 : 5000);
  }, [dismissNotification]);

  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    const id = globalThis.crypto.randomUUID();
    const time = new Date().toLocaleTimeString();
    let finalMessage = message;
    let finalType = type;

    if (message.includes("QUOTA_EXHAUSTED") || message.includes("429")) {
      finalMessage = "System Limit Reached: Recovery Protocol Initialized.";
      finalType = 'critical';
      setQuotaExhausted(true);
    }

    setActivityLogs(prev => [{ id, time, agent, message: finalMessage, type: finalType }, ...prev].slice(0, 100));
    if (['success', 'warning', 'critical'].includes(finalType)) {
      dispatchNotification({ agent, message: finalMessage, type: finalType });
    }
  }, [dispatchNotification]);

  const stats = useMemo(() => {
    const purchased = domains.filter(d => d.status === 'purchased');
    return {
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      messagesSent: 0,
      openRate: 85,
      avgProfit: 250,
      estimatedPortfolioValue: purchased.reduce((acc, d) => acc + (d.price * 3.5), 0),
      systemResilienceStatus: quotaExhausted ? 'degraded' : 'nominal' as 'nominal' | 'degraded'
    };
  }, [domains, quotaExhausted]);

  const value = useMemo(() => ({
    domains, setDomains, strategy, setStrategy, integrations, setIntegrations, activityLogs, notifications, stats,
    system: { status: stats.systemResilienceStatus, lastSync: new Date().toISOString(), activeWorkflows: 0 },
    updateDomains: (fn: (prev: Domain[]) => Domain[]) => setDomains(fn),
    updateStrategy: (u: Partial<PlatformStrategy>) => setStrategy(p => ({ ...p, ...u })),
    addLog, dispatchNotification, dismissNotification,
    connectService: (id: string, provider: string) => {
      setIntegrations(prev => [...prev.filter(i => i.id !== id), { id, provider, name: provider.toUpperCase(), status: 'connected', impactArea: 'Global' }]);
      addLog('System', `Integrated ${provider.toUpperCase()} Gateway.`, 'success');
    },
    resetQuota: () => setQuotaExhausted(false)
  }), [domains, strategy, integrations, activityLogs, notifications, stats, addLog, dispatchNotification, dismissNotification]);

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('Context Violation');
  return context;
};
