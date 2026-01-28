
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, Notification, PlatformStats, SystemState } from '../types';

interface DomainContextType {
  // State
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
  
  // Actions (Strict Contracts)
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
  const [domains, setDomains] = useState<Domain[]>(() => JSON.parse(localStorage.getItem('ist_domains') || '[]'));
  const [integrations, setIntegrations] = useState<ServiceIntegration[]>(() => JSON.parse(localStorage.getItem('ist_integrations') || '[]'));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [strategy, setStrategy] = useState<PlatformStrategy>(() => JSON.parse(localStorage.getItem('ist_strategy') || JSON.stringify({
    totalBudget: 50000,
    maxPricePerDomain: 1000,
    targetTLDs: ['.com'],
    minLiquidityScore: 70,
    targetROI: 400,
    minHoldingPeriod: 6,
    riskTolerance: 'Balanced',
    autoPilotMode: false,
    investmentThesis: ''
  })));

  // Persistence Engine
  useEffect(() => {
    localStorage.setItem('ist_domains', JSON.stringify(domains));
    localStorage.setItem('ist_strategy', JSON.stringify(strategy));
    localStorage.setItem('ist_integrations', JSON.stringify(integrations));
  }, [domains, strategy, integrations]);

  // Notifications Logic
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(x => x.id !== id));
  }, []);

  const dispatchNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...n, id }]);
    setTimeout(() => dismissNotification(id), n.type === 'critical' ? 10000 : 5000);
  }, [dismissNotification]);

  const resetQuota = useCallback(() => setQuotaExhausted(false), []);

  // Logging Logic
  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const time = new Date().toLocaleTimeString();
    
    let finalMessage = message;
    let finalType = type;
    if (message.includes("QUOTA_EXHAUSTED") || message.includes("RESOURCE_EXHAUSTED") || message.includes("429")) {
      finalMessage = "System Limit Reached: Paid API Key Required for Scaled Operations.";
      finalType = 'critical';
      setQuotaExhausted(true);
    }

    setActivityLogs(prev => [{ id, time, agent, message: finalMessage, type: finalType }, ...prev].slice(0, 100));
    
    if (finalType === 'success' || finalType === 'warning' || finalType === 'critical') {
      dispatchNotification({ agent, message: finalMessage, type: finalType });
    }
  }, [dispatchNotification]);

  const updateStrategy = useCallback((updates: Partial<PlatformStrategy>) => {
    setStrategy(prev => ({ ...prev, ...updates }));
  }, []);

  const updateDomains = useCallback((fn: (prev: Domain[]) => Domain[]) => {
    setDomains(fn);
  }, []);

  const connectService = useCallback((id: string, provider: string) => {
    setIntegrations(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, status: 'connected' } : i);
      return [...prev, { id, provider, name: provider.toUpperCase(), status: 'connected', impactArea: 'System Wide' } as ServiceIntegration];
    });
    addLog('System', `Connected to ${provider.toUpperCase()} API Gateway.`, 'success');
  }, [addLog]);

  // Derivations (Memoized Stats)
  const stats: PlatformStats = useMemo(() => {
    const purchased = domains.filter(d => d.status === 'purchased');
    const spent = purchased.reduce((acc, d) => acc + (d.price || 0), 0);
    const value = purchased.reduce((acc, d) => acc + (d.price ? d.price * 3.5 : 0), 0);
    return {
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      messagesSent: 0,
      openRate: 85,
      repliesReceived: 0,
      avgProfit: 250,
      totalSpent: spent,
      estimatedPortfolioValue: value,
      systemResilienceStatus: quotaExhausted ? 'degraded' : 'nominal'
    };
  }, [domains, integrations, quotaExhausted]);

  const system: SystemState = useMemo(() => ({
    status: stats.systemResilienceStatus,
    lastSync: new Date().toISOString(),
    activeWorkflows: 0
  }), [stats.systemResilienceStatus]);

  return (
    <DomainContext.Provider value={{ 
      domains, setDomains, strategy, setStrategy, integrations, setIntegrations, activityLogs, notifications, system, stats,
      updateDomains, updateStrategy, addLog, dispatchNotification, dismissNotification, connectService, resetQuota
    }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('Sovereign Context Violation: useDomainContext used outside DomainProvider');
  return context;
};
