import React, { useState, useEffect } from 'react';
import { AgentType } from './types';
import MainLayout from './components/layout/MainLayout';
import HubRenderer from './components/layout/HubRenderer';
import ProtocolErrorBoundary from './components/ui/ProtocolErrorBoundary';
import AuthForm from './components/AuthForm';
import { useDomainContext } from './context/DomainContext';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const context = useDomainContext();
  const { user, loading } = useAuth();
  const [activeHub, setActiveHub] = useState<AgentType>(AgentType.INTELLIGENCE);

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.body.style.backgroundColor = '#0a0a0c';
    
    if (window.location.search.includes('reset')) {
        window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (context.activeProfile && context.domains.length <= 1) {
      // @ts-ignore
      context.performStrategicMining("High-Alpha AI Assets");
    }
  }, [context.activeProfile]);

  if (!context) return (
    <div className="h-screen flex items-center justify-center bg-black text-[#d4af37] font-mono">
      FATAL_CORE_ERROR: CONTEXT_UNAVAILABLE
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white overflow-hidden relative">
      <ProtocolErrorBoundary>
        {loading ? (
          <div className="h-screen flex flex-col items-center justify-center bg-black relative z-10">
            <div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37]">Authenticating Sovereign State...</p>
          </div>
        ) : !user ? (
          <AuthForm />
        ) : (
          <div className="relative z-10 h-screen overflow-hidden">
            <MainLayout 
              activeHub={activeHub} 
              setActiveHub={setActiveHub} 
              activityLogs={context.activityLogs} 
              onSearchDomain={(name) => console.log("System targeting:", name)}
            >
              <HubRenderer 
                activeHub={activeHub}
                domains={context.domains}
                stats={context.stats}
                addLog={context.addLog}
              />
            </MainLayout>
          </div>
        )}
      </ProtocolErrorBoundary>
    </div>
  );
};

export default App;