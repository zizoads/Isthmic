
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, PlatformStats, UserProfile, ServiceIntegration, PlanDetails, ActiveJob } from '../types';
import { OrchestrationService } from '../services/ai/OrchestrationService';

export interface DomainContextType {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  stats: PlatformStats;
  addLog: (agent: string, msg: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  activityLogs: any[];
  setActivityLogs: React.Dispatch<React.SetStateAction<any[]>>;
  integrations: ServiceIntegration[];
  activeProfile: UserProfile | null;
  setActiveProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isInitialLoading: boolean;
  isTourOpen: boolean;
  setIsTourOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTourStatus: (completed: boolean) => Promise<void>;
  isGracePeriodOver: boolean;
  logout: () => void;
  login: (email: string, pass: string) => Promise<void>;
  trackUsage: (type: 'scan' | 'audit') => Promise<void>;
  updateDomain: (domain: Domain) => Promise<void>;
  connectService: (provider: string, key: string) => Promise<void>;
  exportVault: () => void;
  importVault: (data: string) => void;
  monetization: {
    plans: Record<string, PlanDetails>;
  };
  activeJobs: ActiveJob[];
  saveJob: (job: ActiveJob) => Promise<void>;
  clearJob: (jobId: string) => Promise<void>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<ServiceIntegration[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [strategy, setStrategy] = useState<PlatformStrategy>({
    id: 'default',
    totalBudget: 50000,
    riskTolerance: 'Balanced',
    autoPilot: false,
    investmentThesis: '',
    rejectionPatterns: []
  });

  const monetization = {
    plans: {
      Free: { price: 0, maxScans: 10, maxAudits: 5, features: ['Basic Market Sweep', 'Public Signals'] },
      Pro: { price: 49, maxScans: 100, maxAudits: 50, features: ['Advanced Discovery', 'Forensic Depth', 'Priority Alerts'] },
      Sovereign: { price: 199, maxScans: 1000, maxAudits: 500, features: ['Full Auto-Pilot', 'Institutional Vault', 'Linguistic Lab'] }
    }
  };

  const addLog = useCallback((agent: string, message: string, type: any = 'info') => {
    const newLog = { id: crypto.randomUUID(), time: new Date().toLocaleTimeString(), agent, message, type };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const isGracePeriodOver = useMemo(() => {
    if (!activeProfile || activeProfile.emailConfirmedAt) return false;
    const signupDate = new Date(activeProfile.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - signupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  }, [activeProfile]);

  const login = useCallback(async (email: string, pass: string) => {
    const { AuthService } = await import('../services/AuthService');
    const profile = await AuthService.login(email, pass);
    setActiveProfile(profile);
    addLog('System', 'Sovereign link established.', 'success');
  }, [addLog]);

  const logout = useCallback(() => {
    setActiveProfile(null);
    addLog('System', 'Session terminated.', 'info');
  }, [addLog]);

  const setTourStatus = useCallback(async (completed: boolean) => {
    if (activeProfile) {
      const nextProfile = { ...activeProfile, preferences: { ...activeProfile.preferences, tourCompleted: completed } };
      setActiveProfile(nextProfile);
      setIsTourOpen(!completed);
    }
  }, [activeProfile]);

  const trackUsage = useCallback(async (type: 'scan' | 'audit') => {
    if (activeProfile) {
      const stats = { ...activeProfile.usageStats };
      if (type === 'scan') stats.scansThisMonth++;
      else stats.auditsThisMonth++;
      setActiveProfile({ ...activeProfile, usageStats: stats });
    }
  }, [activeProfile]);

  const updateDomain = useCallback(async (domain: Domain) => {
    setDomains(prev => prev.map(d => d.id === domain.id ? domain : d));
  }, []);

  const connectService = useCallback(async (provider: string, key: string) => {
    setIntegrations(prev => {
      const existing = prev.find(i => i.provider === provider);
      if (existing) return prev.map(i => i.provider === provider ? { ...i, status: 'connected' } : i);
      return [...prev, { id: crypto.randomUUID(), workspaceId: activeProfile?.id || 'default', provider, status: 'connected' }];
    });
    addLog('Integrator', `Service ${provider} successfully anchored.`, 'success');
  }, [activeProfile, addLog]);

  const exportVault = useCallback(() => {
    const data = JSON.stringify({ domains, strategy, integrations });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `isthmic_vault_${Date.now()}.json`;
    link.click();
  }, [domains, strategy, integrations]);

  const importVault = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.domains) setDomains(parsed.domains);
      if (parsed.strategy) setStrategy(parsed.strategy);
      if (parsed.integrations) setIntegrations(parsed.integrations);
      addLog('System', 'Vault restored successfully.', 'success');
    } catch (e) {
      addLog('System', 'Vault restoration failed: Invalid sequence.', 'critical');
    }
  }, [addLog]);

  const saveJob = useCallback(async (job: ActiveJob) => {
    setActiveJobs(prev => {
      const existing = prev.find(j => j.id === job.id);
      if (existing) return prev.map(j => j.id === job.id ? job : j);
      return [job, ...prev];
    });
  }, []);

  const clearJob = useCallback(async (jobId: string) => {
    setActiveJobs(prev => prev.filter(j => j.id !== jobId));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const stats: PlatformStats = useMemo(() => {
    const avgAlignment = domains.length > 0 
      ? domains.reduce((acc, d) => acc + (d.strategicAlignmentScore || 0), 0) / domains.length 
      : 0;

    const velocity = strategy.objectives?.[0]?.alignmentHistory 
      ? OrchestrationService.calculateAlignmentVelocity(strategy.objectives[0].alignmentHistory)
      : 0;

    return {
      totalDiscovered: domains.length,
      totalPurchased: domains.filter(d => d.status === 'purchased').length,
      messagesSent: 0,
      openRate: 88,
      avgProfit: 310,
      estimatedPortfolioValue: domains.reduce((acc, d) => acc + (d.price || 0), 0),
      alignmentVelocity: velocity || (avgAlignment > 70 ? 12 : 0),
      systemResilienceStatus: 'nominal'
    };
  }, [domains, strategy.objectives]);

  return (
    <DomainContext.Provider value={{ 
      domains, setDomains, strategy, setStrategy, stats, addLog, activityLogs, setActivityLogs,
      integrations, activeProfile, setActiveProfile, isInitialLoading, isTourOpen, setIsTourOpen,
      setTourStatus, isGracePeriodOver, logout, login, trackUsage, updateDomain, connectService,
      exportVault, importVault, monetization, activeJobs, saveJob, clearJob
    }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('DomainContext must be used within provider');
  return context;
};
