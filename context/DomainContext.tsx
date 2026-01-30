
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, Notification, PlatformStats, UserProfile, PlatformMonetizationSettings } from '../types';
import { AuthService } from '../services/AuthService';
import { supabase } from '../services/SupabaseClient';

interface DomainContextType {
  activeProfile: UserProfile | null;
  isEmailConfirmed: boolean;
  setActiveProfile: (profile: UserProfile | null) => void;
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  integrations: ServiceIntegration[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  stats: PlatformStats;
  monetization: PlatformMonetizationSettings;
  updateMonetization: (settings: PlatformMonetizationSettings) => Promise<void>;
  isInitialLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  addLog: (agent: string, message: string, type?: ActivityLog['type']) => void;
  connectService: (id: string, provider: string) => void;
  exportVault: () => Promise<void>;
  importVault: (json: string) => Promise<void>;
  wipeLocalVault: () => Promise<void>;
  trackUsage: (type: 'scan' | 'audit') => Promise<boolean>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeProfile, setActiveProfileState] = useState<UserProfile | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [integrations, setIntegrations] = useState<ServiceIntegration[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [monetization, setMonetization] = useState<PlatformMonetizationSettings>({
    isMonetizationActive: false,
    currency: 'USD',
    plans: {
      Free: { price: 0, maxScans: 5, maxAudits: 2, features: ['Core Discovery', 'Basic Analytics'] },
      Pro: { price: 49, maxScans: 100, maxAudits: 50, features: ['Drop Sniper', 'Forensic TM Audit', 'Priority AI'] },
      Sovereign: { price: 199, maxScans: 9999, maxAudits: 9999, features: ['Unlimited Agents', 'API Access', 'Dedicated Node'] }
    }
  });

  const [strategy, setStrategy] = useState<PlatformStrategy>({
    id: 'default',
    totalBudget: 50000,
    riskTolerance: 'Balanced',
    autoPilot: false,
    investmentThesis: ''
  });

  const loadUserData = useCallback(async (profile: UserProfile, confirmed: boolean = true) => {
    setActiveProfileState(profile);
    setIsEmailConfirmed(confirmed);
    
    const { data: userDomains } = await supabase.from('domains').select('*').eq('workspaceId', profile.id);
    const { data: userIntegrations } = await supabase.from('integrations').select('*').eq('workspaceId', profile.id);
    const { data: userStrategy } = await supabase.from('strategies').select('*').eq('id', profile.id).single();
    const { data: globalSettings } = await supabase.from('platform_settings').select('*').eq('id', 'global').single();

    if (userDomains) setDomains(userDomains);
    if (userIntegrations) setIntegrations(userIntegrations);
    if (userStrategy) setStrategy(userStrategy);
    if (globalSettings?.monetization_config) setMonetization(globalSettings.monetization_config);

    setIsInitialLoading(false);
  }, []);

  useEffect(() => {
    const boot = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        const user: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          name: profileData?.name || 'User',
          role: profileData?.role || 'Executive',
          subscriptionTier: profileData?.subscription_tier || 'Free',
          usageStats: profileData?.usage_stats || { scansThisMonth: 0, auditsThisMonth: 0 },
          createdAt: session.user.created_at,
          isSyncEnabled: true,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.id}`
        };
        await loadUserData(user, !!session.user.email_confirmed_at);
      } else {
        setIsInitialLoading(false);
      }
    };
    boot();
  }, [loadUserData]);

  const updateMonetization = async (settings: PlatformMonetizationSettings) => {
    setMonetization(settings);
    await supabase.from('platform_settings').upsert({ id: 'global', monetization_config: settings });
  };

  const trackUsage = async (type: 'scan' | 'audit'): Promise<boolean> => {
    if (!activeProfile || !monetization.isMonetizationActive) return true;

    const plan = monetization.plans[activeProfile.subscriptionTier];
    const currentUsage = activeProfile.usageStats;
    
    if (type === 'scan' && currentUsage.scansThisMonth >= plan.maxScans) return false;
    if (type === 'audit' && currentUsage.auditsThisMonth >= plan.maxAudits) return false;

    const updatedStats = {
      ...currentUsage,
      scansThisMonth: type === 'scan' ? currentUsage.scansThisMonth + 1 : currentUsage.scansThisMonth,
      auditsThisMonth: type === 'audit' ? currentUsage.auditsThisMonth + 1 : currentUsage.auditsThisMonth,
    };

    setActiveProfileState(prev => prev ? { ...prev, usageStats: updatedStats } : null);
    await supabase.from('profiles').update({ usage_stats: updatedStats }).eq('id', activeProfile.id);
    return true;
  };

  const login = async (email: string, pass: string) => {
    const user = await AuthService.login(email, pass);
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    await loadUserData(user, !!sbUser?.email_confirmed_at);
  };

  const signup = async (name: string, email: string, pass: string) => {
    const { user, needsConfirmation } = await AuthService.signup(name, email, pass);
    if (user) {
      await loadUserData(user, !needsConfirmation);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setActiveProfileState(null);
    setDomains([]);
  };

  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    if (!activeProfile) return;
    const log: ActivityLog = { id: crypto.randomUUID(), workspaceId: activeProfile.id, time: new Date().toLocaleTimeString(), agent, message, type };
    setActivityLogs(prev => [log, ...prev].slice(0, 50));
  }, [activeProfile]);

  const exportVault = useCallback(async () => {
    if (!activeProfile) return;
    const { data: userDomains } = await supabase.from('domains').select('*').eq('workspaceId', activeProfile.id);
    const blob = new Blob([JSON.stringify({ domains: userDomains, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isthmic-backup-${activeProfile.id}.json`;
    a.click();
    addLog('System', 'Sovereign vault exported successfully.', 'success');
  }, [activeProfile, addLog]);

  const importVault = useCallback(async (json: string) => {
    if (!activeProfile) return;
    try {
      const data = JSON.parse(json);
      if (data.domains && Array.isArray(data.domains)) {
        const { error } = await supabase.from('domains').upsert(
          data.domains.map((d: any) => ({ ...d, workspaceId: activeProfile.id }))
        );
        if (error) throw error;
        const { data: refreshed } = await supabase.from('domains').select('*').eq('workspaceId', activeProfile.id);
        if (refreshed) setDomains(refreshed);
        addLog('System', 'Sovereign vault restored successfully.', 'success');
      }
    } catch (e) {
      addLog('System', 'Vault restoration failed.', 'critical');
    }
  }, [activeProfile, addLog]);

  const wipeLocalVault = useCallback(async () => {
    if (!activeProfile) return;
    const { error } = await supabase.from('domains').delete().eq('workspaceId', activeProfile.id);
    if (error) {
      addLog('System', 'Vault sanitization failed.', 'critical');
    } else {
      setDomains([]);
      addLog('System', 'Local vault sanitized and wiped.', 'warning');
    }
  }, [activeProfile, addLog]);

  const stats = useMemo(() => ({
    totalDiscovered: domains.length,
    totalPurchased: domains.filter(d => d.status === 'purchased').length,
    messagesSent: 0,
    openRate: 85,
    avgProfit: 250,
    estimatedPortfolioValue: domains.reduce((acc, d) => acc + (d.price || 0), 0),
    systemResilienceStatus: 'nominal' as const
  }), [domains]);

  const value = useMemo(() => ({
    activeProfile, isEmailConfirmed, setActiveProfile: setActiveProfileState, domains, setDomains, strategy, setStrategy, integrations, activityLogs, notifications, stats, isInitialLoading,
    login, signup, logout, addLog, exportVault, importVault, wipeLocalVault, monetization, updateMonetization, trackUsage,
    connectService: (id: string, provider: string) => {
      if (!activeProfile) return;
      setIntegrations(prev => [...prev, { id, workspaceId: activeProfile.id, provider, name: provider.toUpperCase(), status: 'connected', impactArea: 'Global' }]);
    }
  }), [activeProfile, isEmailConfirmed, domains, strategy, integrations, activityLogs, notifications, stats, isInitialLoading, exportVault, importVault, wipeLocalVault, monetization]);

  return <DomainContext.Provider value={value as any}>{children}</DomainContext.Provider>;
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('Context Error');
  return context;
};
