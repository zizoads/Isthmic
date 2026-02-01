
import React, { useEffect, useState } from 'react';
import { AgentType, ActivityLog } from '../../types';
import CommandPalette from '../CommandPalette';
import SonnerNotification from '../SonnerNotification';
import TickerTape from '../TickerTape';
import MobileBottomNav from './MobileBottomNav';
import MobileMenuDrawer from './MobileMenuDrawer';
import { useDomainContext } from '../../context/DomainContext';

interface Props {
  activeHub: AgentType;
  setActiveHub: (hub: AgentType) => void;
  activityLogs: ActivityLog[];
  lang: 'ar' | 'en';
  children: React.ReactNode;
  onSearchDomain: (name: string) => void;
}

const MainLayout: React.FC<Props> = ({ 
  activeHub, setActiveHub, activityLogs, lang, children, onSearchDomain 
}) => {
  const { setActivityLogs, activeProfile, addLog, logout } = useDomainContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleChaosShortcut = (e: KeyboardEvent) => {
      if (activeProfile?.email.toLowerCase() === 'azeddinebeldjilali9@gmail.com') {
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
          const current = localStorage.getItem('isthmic_chaos_failure') === 'true';
          localStorage.setItem('isthmic_chaos_failure', (!current).toString());
          addLog('Chaos_Engine', !current ? 'PROTOCOL_X_ACTIVATED' : 'RECOVERY_INITIATED', !current ? 'critical' : 'success');
          window.location.reload();
        }
      }
    };
    window.addEventListener('keydown', handleChaosShortcut);
    return () => window.removeEventListener('keydown', handleChaosShortcut);
  }, [addLog, activeProfile]);

  const navItems = [
    { id: AgentType.INTELLIGENCE, label: lang === 'ar' ? 'الاستخبارات' : 'Intelligence', icon: 'fa-brain' },
    { id: AgentType.ACQUISITION, label: lang === 'ar' ? 'الاستحواذ' : 'Acquisition', icon: 'fa-crosshairs' },
    { id: AgentType.CODE_AUDITOR, label: lang === 'ar' ? 'المدقق' : 'Auditor', icon: 'fa-file-code' },
    { id: AgentType.OPERATIONS, label: lang === 'ar' ? 'العمليات' : 'Operations', icon: 'fa-layer-group' },
    { id: AgentType.LIQUIDATION, label: lang === 'ar' ? 'التصفية' : 'Liquidation', icon: 'fa-money-bill-wave' },
    { id: AgentType.MANAGEMENT, label: lang === 'ar' ? 'التنفيذي' : 'Executive', icon: 'fa-user-tie' }
  ];

  const isAdmin = activeProfile?.role === 'Admin';

  const handleDismiss = (id: string) => {
    setActivityLogs(prev => prev.filter(n => n.id !== id));
  };

  const handleNavClick = (id: AgentType) => {
    setActiveHub(id);
    if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-foreground font-sans overflow-hidden">
      <CommandPalette setActiveTab={handleNavClick} onSearchDomain={onSearchDomain} />
      <SonnerNotification notifications={activityLogs} onDismiss={handleDismiss} />
      <TickerTape lang={lang} />
      <div className="noise-bg"></div>

      {/* Sidebar - Hidden on mobile */}
      <aside className={`mobile-hide fixed inset-y-0 left-0 w-72 border-r border-white/5 bg-black/60 p-8 flex flex-col z-50 backdrop-blur-3xl transition-all duration-500`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-4 mb-12">
           <div className="w-12 h-12 bg-[#d4af37] rounded-2xl flex items-center justify-center text-black font-serif text-2xl italic shadow-2xl">I</div>
           <div>
              <h1 className="text-xl font-serif italic text-white leading-none">Isthmic.</h1>
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#d4af37] opacity-60">Sovereign Pro</span>
           </div>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold uppercase text-[9px] tracking-widest
                ${activeHub === item.id ? 'bg-[#d4af37] text-black shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <i className={`fas ${item.icon} text-sm`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        {isAdmin && (
          <button 
            onClick={() => handleNavClick(AgentType.ADMIN)}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold uppercase text-[9px] tracking-widest mt-auto border border-[#d4af37]/20
              ${activeHub === AgentType.ADMIN ? 'bg-[#d4af37] text-black shadow-xl' : 'text-[#d4af37] hover:bg-[#d4af37]/10'}`}
          >
            <i className="fas fa-user-shield text-sm"></i>
            {lang === 'ar' ? 'لوحة المسؤول' : 'Admin Panel'}
          </button>
        )}
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-12 bg-transparent relative pb-32 lg:pb-40 safe-bottom">
        <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
          {children}
        </div>
      </main>

      {/* Mobile Controls */}
      <MobileBottomNav 
        activeHub={activeHub} 
        setActiveHub={handleNavClick} 
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        lang={lang} 
      />
      <MobileMenuDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        setActiveHub={handleNavClick}
        activeProfile={activeProfile}
        logout={logout}
        lang={lang}
      />
    </div>
  );
};

export default MainLayout;
