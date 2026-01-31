
import React from 'react';
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
  const { setActivityLogs } = useDomainContext();
  
  const navItems = [
    { id: AgentType.INTELLIGENCE, label: 'Intelligence', icon: 'fa-brain' },
    { id: AgentType.ACQUISITION, label: 'Acquisition', icon: 'fa-crosshairs' },
    { id: AgentType.CODE_AUDITOR, label: 'Code Auditor', icon: 'fa-file-code' }, // الخيار الجديد
    { id: AgentType.OPERATIONS, label: 'Operations', icon: 'fa-layer-group' },
    { id: AgentType.LIQUIDATION, label: 'Liquidation', icon: 'fa-money-bill-wave' },
    { id: AgentType.MANAGEMENT, label: 'Executive', icon: 'fa-user-tie' }
  ];

  const handleDismiss = (id: string) => {
    setActivityLogs(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-foreground font-sans overflow-hidden select-none">
      <CommandPalette setActiveTab={setActiveHub} onSearchDomain={onSearchDomain} />
      <SonnerNotification notifications={activityLogs} onDismiss={handleDismiss} />
      <TickerTape lang={lang} />
      <div className="noise-bg"></div>

      {/* Sidebar Nav - The Column of Authority */}
      <aside className="w-72 border-r border-white/5 bg-black/60 p-10 flex flex-col gap-12 z-50 backdrop-blur-3xl">
        <div className="flex items-center gap-6 group cursor-pointer">
           <div className="w-14 h-14 bg-[#d4af37] rounded-3xl flex items-center justify-center text-black font-serif text-3xl italic shadow-2xl shadow-[#d4af37]/20 transition-transform duration-700 group-hover:rotate-12">I</div>
           <div>
              <h1 className="text-2xl font-serif italic text-white tracking-tighter leading-none">Isthmic.</h1>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#d4af37] opacity-60">Sovereign Pro</span>
           </div>
        </div>
        
        <nav className="flex flex-col gap-3">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveHub(item.id)}
              className={`flex items-center gap-5 px-8 py-5 rounded-[22px] transition-all font-bold uppercase text-[9px] tracking-[0.2em] group
                ${activeHub === item.id ? 'bg-[#d4af37] text-black shadow-2xl scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <i className={`fas ${item.icon} text-sm transition-transform duration-500 group-hover:scale-110`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Network Pulse</span>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-[#d4af37] w-3/4 animate-shimmer"></div>
              </div>
           </div>
           
           <div className="text-[8px] font-mono text-slate-700 uppercase text-center tracking-[0.2em]">
              Ver: 13.0.1_RC1 // CAS_ENABLED
           </div>
        </div>
      </aside>

      {/* Main Workspace - The Light Table */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:p-20 bg-transparent relative pb-40">
        <div className="max-w-7xl mx-auto animate-prestige">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
