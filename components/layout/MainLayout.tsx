
import React, { useEffect, useState } from 'react';
import { AgentType, ActivityLog } from '../../types';
import CommandPalette from '../CommandPalette';
import SonnerNotification from '../SonnerNotification';
import TickerTape from '../TickerTape';
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
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false); // إغلاق تلقائي على الهاتف
    }
  };

  const handleLogout = async () => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-foreground font-sans overflow-hidden">
      <CommandPalette setActiveTab={handleNavClick} onSearchDomain={onSearchDomain} />
      <SonnerNotification notifications={activityLogs} onDismiss={handleDismiss} />
      <TickerTape lang={lang} />
      <div className="noise-bg"></div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-xl border-b border-white/5 z-[60] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d4af37] rounded-xl flex items-center justify-center text-black font-serif text-xl italic">I</div>
          <span className="text-sm font-serif italic text-white">Isthmic.</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-xl border border-white/10"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[51]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-white/5 bg-[#0a0a0c] lg:bg-black/60 p-8 flex flex-col z-[55] backdrop-blur-3xl transition-transform duration-500
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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

          {isAdmin && (
            <button 
              onClick={() => handleNavClick(AgentType.ADMIN)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold uppercase text-[9px] tracking-widest mt-4 border border-[#d4af37]/20
                ${activeHub === AgentType.ADMIN ? 'bg-[#d4af37] text-black shadow-xl' : 'text-[#d4af37] hover:bg-[#d4af37]/10'}`}
            >
              <i className="fas fa-user-shield text-sm"></i>
              {lang === 'ar' ? 'لوحة المسؤول' : 'Admin Panel'}
            </button>
          )}
        </nav>

        {/* User Actions / Logout */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full border border-[#d4af37]/30 p-0.5">
                <img src={activeProfile?.avatar} className="w-full h-full rounded-full object-cover" alt="User" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black text-white truncate">{activeProfile?.name}</div>
                <div className="text-[8px] text-slate-500 truncate">{activeProfile?.subscriptionTier}</div>
              </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
           >
              <span className="text-[9px] font-black uppercase tracking-widest">
                {lang === 'ar' ? 'تسجيل الخروج' : 'Terminate Link'}
              </span>
              <i className="fas fa-power-off text-sm"></i>
           </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 bg-transparent relative pb-40 mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
