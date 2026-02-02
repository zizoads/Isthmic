
import React, { useState, useEffect } from 'react';
import { AgentType } from './types';
import AuthForm from './components/AuthForm';
import OnboardingTour from './components/OnboardingTour';
import MainLayout from './components/layout/MainLayout';
import HubRenderer from './components/layout/HubRenderer';
import { useDomainContext } from './context/DomainContext';
import StrategicBriefingBadge from './components/negotiation/StrategicBriefingBadge';
import ProtocolErrorBoundary from './components/ui/ProtocolErrorBoundary';

const App: React.FC = () => {
  const { 
    domains, 
    setDomains, 
    stats, 
    strategy,
    addLog, 
    integrations, 
    activeProfile, 
    isInitialLoading,
    isTourOpen,
    setIsTourOpen,
    activityLogs,
    setTourStatus,
    isGracePeriodOver,
    logout
  } = useDomainContext();
  
  const [activeHub, setActiveHub] = useState<AgentType>(AgentType.INTELLIGENCE);
  const lang = 'en';

  useEffect(() => {
    if (activeProfile && !activeProfile.preferences?.tourCompleted) {
      setIsTourOpen(true);
    }
  }, [activeProfile, setIsTourOpen]);

  const handleSearchDomain = (name: string) => {
    setActiveHub(AgentType.ACQUISITION);
    addLog('System', `Navigating to ${name} forensics...`, 'info');
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen bg-prestige-ink flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 bg-prestige-gold rounded-3xl flex items-center justify-center text-black font-serif text-4xl italic animate-pulse shadow-2xl shadow-prestige-gold/20">I</div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Initializing Sovereign Core...</div>
      </div>
    );
  }

  if (!activeProfile) {
    return <AuthForm />;
  }

  // Grace Period Enforcement UI
  if (isGracePeriodOver) {
    return (
      <div className="h-screen bg-[#0a0a0c] flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#111113] border border-red-500/30 rounded-[48px] p-12 text-center space-y-10 shadow-2xl relative overflow-hidden">
           <div className="w-24 h-24 bg-red-600/10 rounded-3xl flex items-center justify-center text-red-500 text-4xl mx-auto shadow-2xl animate-pulse">
              <i className="fas fa-lock"></i>
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl prestige-heading text-white italic">Access Temporarily Suspended</h2>
              <p className="text-slate-400 text-lg leading-relaxed italic">
                 "Your 30-day grace period has expired. Sovereign security protocols require a confirmed email address to continue operations."
              </p>
           </div>
           <div className="space-y-4 pt-6">
              <button 
                onClick={() => window.open('https://supabase.com/dashboard/auth/users', '_blank')}
                className="prestige-btn prestige-btn-gold w-full py-5"
              >
                 RESEND CONFIRMATION LINK
              </button>
              <button 
                onClick={logout}
                className="w-full py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white"
              >
                 Switch Account / Logout
              </button>
           </div>
           <i className="fas fa-shield-halved absolute right-[-40px] bottom-[-40px] text-white/[0.02] text-[200px] -rotate-12"></i>
        </div>
      </div>
    );
  }

  return (
    <ProtocolErrorBoundary fallbackName="Isthmic_Core">
      {isTourOpen && <OnboardingTour onComplete={() => setTourStatus(true)} lang={lang} />}
      
      {/* Silent Observer: Stage 3 Neural Link monitoring */}
      <StrategicBriefingBadge objectives={strategy.objectives || []} lang={lang} />

      <MainLayout 
        activeHub={activeHub} 
        setActiveHub={setActiveHub}
        activityLogs={activityLogs}
        lang={lang}
        onSearchDomain={handleSearchDomain}
      >
        <HubRenderer 
          activeHub={activeHub}
          domains={domains}
          setDomains={setDomains}
          stats={stats}
          integrations={integrations}
          addLog={addLog}
          lang={lang}
        />
      </MainLayout>
    </ProtocolErrorBoundary>
  );
};

export default App;
