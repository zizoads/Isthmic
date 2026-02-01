
import React, { useState, useEffect } from 'react';
import { AgentType } from './types';
import AuthForm from './components/AuthForm';
import OnboardingTour from './components/OnboardingTour';
import MainLayout from './components/layout/MainLayout';
import HubRenderer from './components/layout/HubRenderer';
import { useDomainContext } from './context/DomainContext';

const App: React.FC = () => {
  const { 
    domains, 
    setDomains, 
    stats, 
    addLog, 
    integrations, 
    activeProfile, 
    isInitialLoading,
    isTourOpen,
    setIsTourOpen,
    activityLogs,
    setTourStatus
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

  return (
    <>
      {isTourOpen && <OnboardingTour onComplete={() => setTourStatus(true)} lang={lang} />}
      
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
    </>
  );
};

export default App;
