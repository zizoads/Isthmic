
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, PlatformStats, UserProfile, ActiveJob, PlatformMonetizationSettings } from '../types';
import { supabase } from '../services/SupabaseClient';
import { AuthService } from '../services/AuthService';

export interface DomainContextType {
  activeProfile: UserProfile | null;
  setActiveProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  activeJobs: ActiveJob[];
  stats: PlatformStats;
  isInitialLoading: boolean;
  activityLogs: ActivityLog[];
  integrations: ServiceIntegration[];
  isEmailConfirmed: boolean;
  monetization: PlatformMonetizationSettings;
  addLog: (agent: string, msg: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  saveJob: (job: ActiveJob) => Promise<void>;
  clearJob: (id: string) => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  trackUsage: (type: 'scan' | 'audit') => Promise<void>;
  exportVault: () => Promise<void>;
  importVault: (json: string) => Promise<void>;
  wipeLocalVault: () => Promise<void>;
  updateMonetization: (settings: PlatformMonetizationSettings) => Promise<void>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [integrations, setIntegrations] = useState<ServiceIntegration[]>([]);
  const [strategy, setStrategy] = useState<PlatformStrategy>({
    id: 'default', totalBudget: 50000, riskTolerance: 'Balanced', autoPilot: false, investmentThesis: ''
  });
  const [monetization, setMonetization] = useState<PlatformMonetizationSettings>({
    isMonetizationActive: true,
    plans: {
      Free: { price: 0, maxScans: 10, maxAudits: 5, features: ['Basic Search'] },
      Pro: { price: 49, maxScans: 100, maxAudits: 50, features: ['Advanced Search', 'Forensic Audit'] },
      Sovereign: { price: 199, maxScans: 1000, maxAudits: 500, features: ['Unlimited Potential', 'Custom AI Models'] }
    }
  });

  const isEmailConfirmed = useMemo(() => true, []); // Mocked

  // --- RECOVERY LOGIC (The Heart of Pulse Sync) ---
  const loadWorkspace = useCallback(async (uid: string) => {
    const [{ data: d }, { data: s }, { data: j }, { data: i }] = await Promise.all([
      supabase.from('domains').select('*').eq('workspaceId', uid),
      supabase.from('strategies').select('*').eq('id', uid).single(),
      supabase.from('active_jobs').select('*').eq('workspaceId', uid).eq('status', 'running'),
      supabase.from('integrations').select('*').eq('workspaceId', uid)
    ]);
    if (d) setDomains(d);
    if (s) setStrategy(s);
    if (j) setActiveJobs(j);
    if (i) setIntegrations(i);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          setActiveProfile({
            id: profile.id, email: profile.email, name: profile.name, role: profile.role,
            subscriptionTier: profile.subscription_tier, usageStats: profile.usage_stats,
            preferences: profile.preferences, createdAt: profile.created_at, isSyncEnabled: true,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile.id}`
          });
          await loadWorkspace(profile.id);
        }
      }
      setIsInitialLoading(false);
    };
    init();
  }, [loadWorkspace]);

  // --- ACTIONS ---
  const addLog = useCallback((agent: string, message: string, type: any = 'info') => {
    const newLog: ActivityLog = { id: crypto.randomUUID(), workspaceId: 'sys', time: new Date().toLocaleTimeString(), agent, message, type };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const saveJob = useCallback(async (job: ActiveJob) => {
    setActiveJobs(prev => {
      const idx = prev.findIndex(j => j.id === job.id);
      return idx >= 0 ? [...prev.slice(0, idx), job, ...prev.slice(idx + 1)] : [job, ...prev];
    });
    await supabase.from('active_jobs').upsert(job);
  }, []);

  const clearJob = useCallback(async (id: string) => {
    setActiveJobs(prev => prev.filter(j => j.id !== id));
    await supabase.from('active_jobs').delete().eq('id', id);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setActiveProfile(null);
    setDomains([]);
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    const user = await AuthService.login(email, pass);
    setActiveProfile(user);
    await loadWorkspace(user.id);
  }, [loadWorkspace]);

  const signup = useCallback(async (name: string, email: string, pass: string) => {
    const { user } = await AuthService.signup(name, email, pass);
    if (user) {
      setActiveProfile(user);
      await loadWorkspace(user.id);
    }
  }, [loadWorkspace]);

  const trackUsage = useCallback(async (type: 'scan' | 'audit') => {
    if (!activeProfile) return;
    const nextStats = { ...activeProfile.usageStats };
    if (type === 'scan') nextStats.scansThisMonth++;
    else nextStats.auditsThisMonth++;
    
    await supabase.from('profiles').update({ usage_stats: nextStats }).eq('id', activeProfile.id);
    setActiveProfile({ ...activeProfile, usageStats: nextStats });
  }, [activeProfile]);

  const exportVault = useCallback(async () => {
    const data = JSON.stringify({ domains, strategy, integrations });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isthmic_vault_${Date.now()}.json`;
    a.click();
  }, [domains, strategy, integrations]);

  const importVault = useCallback(async (json: string) => {
    try {
      const { domains: d, strategy: s, integrations: i } = JSON.parse(json);
      if (d) setDomains(d);
      if (s) setStrategy(s);
      if (i) setIntegrations(i);
      addLog('System', 'Vault imported successfully', 'success');
    } catch (e) {
      addLog('System', 'Invalid vault file', 'critical');
    }
  }, [addLog]);

  const wipeLocalVault = useCallback(async () => {
    setDomains([]);
    setStrategy({ id: 'default', totalBudget: 50000, riskTolerance: 'Balanced', autoPilot: false, investmentThesis: '' });
    setIntegrations([]);
    addLog('System', 'Local vault sanitized', 'warning');
  }, [addLog]);

  const updateMonetization = useCallback(async (settings: PlatformMonetizationSettings) => {
    setMonetization(settings);
  }, []);

  const stats: PlatformStats = useMemo(() => ({
    totalDiscovered: domains.length,
    totalPurchased: domains.filter(d => d.status === 'purchased').length,
    messagesSent: 0, openRate: 88, avgProfit: 310,
    estimatedPortfolioValue: domains.reduce((acc, d) => acc + (d.price || 0), 0),
    systemResilienceStatus: 'nominal'
  }), [domains]);

  const value = useMemo(() => ({
    activeProfile, setActiveProfile, domains, setDomains, strategy, setStrategy, activeJobs, stats, isInitialLoading,
    activityLogs, integrations, isEmailConfirmed, monetization,
    addLog, saveJob, clearJob, logout, login, signup, trackUsage, exportVault, importVault, wipeLocalVault, updateMonetization
  }), [activeProfile, domains, strategy, activeJobs, stats, isInitialLoading, activityLogs, integrations, isEmailConfirmed, monetization, addLog, saveJob, clearJob, logout, login, signup, trackUsage, exportVault, importVault, wipeLocalVault, updateMonetization]);

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('Context Error');
  return context;
};
