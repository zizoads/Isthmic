
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, PlatformStats, UserProfile, ActiveJob, PlatformMonetizationSettings } from '../types';
import { supabase, checkSupabaseConnection } from '../services/SupabaseClient';
import { AuthService } from '../services/AuthService';
import { SovereignShield } from '../services/SovereignShield';

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
  isSyncing: boolean;
  isTourOpen: boolean;
  setIsTourOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  integrations: ServiceIntegration[];
  isEmailConfirmed: boolean;
  monetization: PlatformMonetizationSettings;
  addLog: (agent: string, msg: string, type?: 'info' | 'success' | 'warning' | 'critical', actionLabel?: string, actionPayload?: any, onAction?: (payload: any) => void) => void;
  saveJob: (job: ActiveJob) => Promise<void>;
  clearJob: (id: string) => Promise<void>;
  resumeJob: (jobId: string) => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  trackUsage: (type: 'scan' | 'audit') => Promise<void>;
  exportVault: () => Promise<void>;
  importVault: (json: string) => Promise<void>;
  wipeLocalVault: () => Promise<void>;
  updateMonetization: (settings: PlatformMonetizationSettings) => Promise<void>;
  updateDomain: (domain: Domain) => Promise<void>;
  setTourStatus: (completed: boolean) => Promise<void>;
  connectService: (provider: string, key: string) => Promise<void>;
  isGracePeriodOver: boolean;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [integrations, setIntegrations] = useState<ServiceIntegration[]>([]);
  
  const logsRef = useRef<ActivityLog[]>([]);

  const [strategy, setStrategy] = useState<PlatformStrategy>(() => {
    return SovereignShield.recover<PlatformStrategy>('strategy_draft') || {
      id: 'default', totalBudget: 50000, riskTolerance: 'Balanced', autoPilot: false, investmentThesis: ''
    };
  });
  
  const [monetization, setMonetization] = useState<PlatformMonetizationSettings>({
    isMonetizationActive: true,
    plans: {
      Free: { price: 0, maxScans: 10, maxAudits: 5, features: ['Basic Search'] },
      Pro: { price: 49, maxScans: 100, maxAudits: 50, features: ['Advanced Search', 'Forensic Audit'] },
      Sovereign: { price: 199, maxScans: 1000, maxAudits: 500, features: ['Unlimited Potential', 'Custom AI Models'] }
    }
  });

  const isGracePeriodOver = useMemo(() => {
    if (!activeProfile) return false;
    if (activeProfile.emailConfirmedAt) return false;
    
    const signupDate = new Date(activeProfile.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - signupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 30;
  }, [activeProfile]);

  useEffect(() => {
    if (activeProfile) SovereignShield.protect('strategy_draft', strategy);
  }, [strategy, activeProfile]);

  const addLog = useCallback((agent: string, message: string, type: any = 'info', actionLabel?: string, actionPayload?: any, onAction?: (payload: any) => void) => {
    const newLog: ActivityLog = { 
      id: crypto.randomUUID(), workspaceId: 'sys', time: new Date().toLocaleTimeString(), 
      agent, message, type, actionLabel, actionPayload, onAction
    };
    
    setActivityLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 100);
      logsRef.current = updated;
      return updated;
    });
  }, []);

  const connectService = useCallback(async (provider: string, key: string) => {
    if (!activeProfile) return;
    try {
      const newIntegration: Partial<ServiceIntegration> = {
        workspaceId: activeProfile.id,
        provider: provider as any,
        name: provider.toUpperCase(),
        status: 'connected',
        key: key
      };

      const { error } = await supabase.from('integrations').upsert([newIntegration]);
      if (error) throw error;

      setIntegrations(prev => {
        const idx = prev.findIndex(i => i.provider === provider);
        if (idx >= 0) return [...prev.slice(0, idx), { ...prev[idx], ...newIntegration } as ServiceIntegration, ...prev.slice(idx + 1)];
        return [...prev, newIntegration as ServiceIntegration];
      });

      addLog('Shield', `Gateway ${provider} successfully anchored.`, 'success');
    } catch (e: any) {
      addLog('Shield', `Failed to anchor gateway: ${e.message}`, 'critical');
    }
  }, [activeProfile, addLog]);

  const saveJob = useCallback(async (job: ActiveJob) => {
    setActiveJobs(prev => {
      const idx = prev.findIndex(j => j.id === job.id);
      return idx >= 0 ? [...prev.slice(0, idx), job, ...prev.slice(idx + 1)] : [job, ...prev];
    });
    try {
      await supabase.from('active_jobs').upsert({ ...job, lastUpdate: new Date().toISOString() });
    } catch (e) { console.warn("SYNC_DELAY: Job checkpoint pending..."); }
  }, []);

  const resumeJob = useCallback(async (jobId: string) => {
    const { data } = await supabase.from('active_jobs').select('*').eq('id', jobId).single();
    if (data) {
      setActiveJobs(prev => [...prev.filter(j => j.id !== jobId), data]);
      addLog('System', `Sovereign context resumed: ${data.id}`, 'info');
    }
  }, [addLog]);

  const clearJob = useCallback(async (id: string) => {
    setActiveJobs(prev => prev.filter(j => j.id !== id));
    try { await supabase.from('active_jobs').delete().eq('id', id); } catch (e) {}
  }, []);

  const setTourStatus = useCallback(async (completed: boolean) => {
    if (!activeProfile) return;
    const nextPrefs = { ...activeProfile.preferences, tourCompleted: completed };
    await supabase.from('profiles').update({ preferences: nextPrefs }).eq('id', activeProfile.id);
    setActiveProfile({ ...activeProfile, preferences: nextPrefs });
    if (completed) setIsTourOpen(false);
  }, [activeProfile]);

  const loadWorkspace = useCallback(async (uid: string) => {
    try {
      setIsSyncing(true);
      const isUp = await checkSupabaseConnection();
      if (!isUp) {
        addLog('Shield', 'Database Unreachable. Operating in LOCAL_ONLY mode.', 'warning');
        return;
      }

      const [dRes, sRes, jRes, iRes] = await Promise.all([
        supabase.from('domains').select('*').eq('workspaceId', uid),
        supabase.from('strategies').select('*').eq('id', uid).maybeSingle(),
        supabase.from('active_jobs').select('*').eq('workspaceId', uid).eq('status', 'running'),
        supabase.from('integrations').select('*').eq('workspaceId', uid)
      ]);

      if (dRes.data) setDomains(dRes.data);
      if (sRes.data) {
        setStrategy(sRes.data);
        SovereignShield.protect('strategy_draft', sRes.data);
      }
      
      if (jRes.data && jRes.data.length > 0) {
        setActiveJobs(jRes.data);
        addLog('Core', `ZOMBIE_CONTEXT_DETECTED: Job ${jRes.data[0].id} found.`, 'warning', 'RESUME', jRes.data[0].id, resumeJob);
      }
      if (iRes.data) setIntegrations(iRes.data);

    } catch (e) {
      addLog('System', 'Pulse sync failed. Local cache remains active.', 'critical');
    } finally {
      setIsSyncing(false);
      setIsInitialLoading(false);
    }
  }, [addLog, resumeJob]);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          setActiveProfile({
            id: profile.id, email: profile.email, name: profile.name, role: profile.role,
            subscriptionTier: profile.subscription_tier, usageStats: profile.usage_stats,
            preferences: profile.preferences, createdAt: profile.created_at, 
            emailConfirmedAt: session.user.email_confirmed_at,
            isSyncEnabled: true,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile.id}`
          });
          await loadWorkspace(profile.id);
        } else {
          setIsInitialLoading(false);
        }
      } else {
        setIsInitialLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          setActiveProfile({
            id: profile.id, email: profile.email, name: profile.name, role: profile.role,
            subscriptionTier: profile.subscription_tier, usageStats: profile.usage_stats,
            preferences: profile.preferences, createdAt: profile.created_at, 
            emailConfirmedAt: session.user.email_confirmed_at,
            isSyncEnabled: true,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile.id}`
          });
          loadWorkspace(profile.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setActiveProfile(null);
        setDomains([]);
        setIsInitialLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadWorkspace]);

  const updateDomain = useCallback(async (domain: Domain) => {
    setDomains(prev => prev.map(d => d.id === domain.id ? domain : d));
    await supabase.from('domains').upsert(domain);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    SovereignShield.purge('strategy_draft');
    setActiveProfile(null);
    setDomains([]);
    setActiveJobs([]);
    setIntegrations([]);
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
    a.href = url; a.download = `isthmic_vault_${Date.now()}.json`;
    a.click();
  }, [domains, strategy, integrations]);

  const importVault = useCallback(async (json: string) => {
    try {
      const { domains: d, strategy: s, integrations: i } = JSON.parse(json);
      if (d) setDomains(d); if (s) setStrategy(s); if (i) setIntegrations(i);
      addLog('System', 'Vault Imported Successfully', 'success');
    } catch (e) { addLog('System', 'Invalid Vault Signature', 'critical'); }
  }, [addLog]);

  const wipeLocalVault = useCallback(async () => {
    setDomains([]);
    setStrategy({ id: 'default', totalBudget: 50000, riskTolerance: 'Balanced', autoPilot: false, investmentThesis: '' });
    SovereignShield.purge('strategy_draft');
    addLog('System', 'Local Vault Purged', 'warning');
  }, [addLog]);

  const updateMonetization = useCallback(async (settings: PlatformMonetizationSettings) => {
    setMonetization(settings);
  }, []);

  const stats: PlatformStats = useMemo(() => ({
    totalDiscovered: domains.length,
    totalPurchased: domains.filter(d => d.status === 'purchased').length,
    messagesSent: 0, openRate: 88, avgProfit: 310,
    estimatedPortfolioValue: domains.reduce((acc, d) => acc + (d.price || 0), 0),
    systemResilienceStatus: isSyncing ? 'syncing' : 'nominal'
  }), [domains, isSyncing]);

  const value = useMemo(() => ({
    activeProfile, setActiveProfile, domains, setDomains, strategy, setStrategy, activeJobs, stats, isInitialLoading, isSyncing, isTourOpen, setIsTourOpen,
    activityLogs, setActivityLogs, integrations, isEmailConfirmed: !!activeProfile?.emailConfirmedAt, monetization,
    addLog, saveJob, clearJob, resumeJob, logout, login, signup, trackUsage, exportVault, importVault, wipeLocalVault, updateMonetization, updateDomain, setTourStatus, connectService, isGracePeriodOver
  }), [activeProfile, domains, strategy, activeJobs, stats, isInitialLoading, isSyncing, isTourOpen, activityLogs, integrations, monetization, addLog, saveJob, clearJob, logout, login, signup, trackUsage, exportVault, importVault, wipeLocalVault, updateMonetization, updateDomain, resumeJob, setTourStatus, connectService, isGracePeriodOver]);

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('Context Error');
  return context;
};
