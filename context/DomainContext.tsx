
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, Notification, PlatformStats, SystemState } from '../types';

interface DomainContextType {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  integrations: ServiceIntegration[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  system: SystemState;
  stats: PlatformStats;
  quotaExhausted: boolean;
  
  updateDomains: (fn: (prev: Domain[]) => Domain[]) => void;
  updateStrategy: (updates: Partial<PlatformStrategy>) => void;
  addLog: (agent: string, message: string, type?: ActivityLog['type']) => void;
  dispatchNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  connectService: (id: string, provider: string) => void;
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
    riskTolerance: 'Balanced',
    investmentThesis: ''
  })));

  useEffect(() => {
    const handleQuotaError = (e: any) => {
      setQuotaExhausted(true);
      addLog('System', e.detail.message, 'critical');
      // إعادة التعيين بعد دقيقة واحدة (فترة السماح التقديرية للـ Rate Limit)
      setTimeout(() => setQuotaExhausted(false), 60000);
    };

    window.addEventListener('ai-quota-exhausted', handleQuotaError);
    return () => window.removeEventListener('ai-quota-exhausted', handleQuotaError);
  }, []);

  useEffect(() => {
    localStorage.setItem('ist_domains', JSON.stringify(domains));
    localStorage.setItem('ist_strategy', JSON.stringify(strategy));
    localStorage.setItem('ist_integrations', JSON.stringify(integrations));
  }, [domains, strategy, integrations]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(x => x.id !== id));
  }, []);

  const dispatchNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...n, id }]);
    setTimeout(() => dismissNotification(id), n.type === 'critical' ? 10000 : 5000);
  }, [dismissNotification]);

  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const time = new Date().toLocaleTimeString();
    setActivityLogs(prev => [{ id, time, agent, message, type }, ...prev].slice(0, 100));
    
    if (type === 'success' || type === 'warning' || type === 'critical') {
      dispatchNotification({ agent, message, type });
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
    addLog('System', `Connected to ${provider.toUpperCase()} Gateway.`, 'success');
  }, [addLog]);

  const stats: PlatformStats = useMemo(() => {
    const purchased = domains.filter(d => d.status === 'purchased');
    return {
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      messagesSent: 0,
      openRate: 85,
      avgProfit: 250,
      estimatedPortfolioValue: purchased.reduce((acc, d) => acc + (d.price * 3.5), 0),
      systemResilienceStatus: quotaExhausted ? 'degraded' : 'nominal'
    };
  }, [domains, quotaExhausted]);

  const system: SystemState = useMemo(() => ({
    status: quotaExhausted ? 'degraded' : 'nominal',
    lastSync: new Date().toISOString(),
    activeWorkflows: 0
  }), [quotaExhausted]);

  return (
    <DomainContext.Provider value={{ 
      domains, setDomains, strategy, setStrategy, integrations, activityLogs, notifications, system, stats, quotaExhausted,
      updateDomains, updateStrategy, addLog, dispatchNotification, dismissNotification, connectService
    }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('useDomainContext must be used within DomainProvider');
  return context;
};
