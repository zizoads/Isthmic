import React, { useState, useEffect, useRef } from 'react';
import { AgentType, ActivityLog } from '../../types';
import CommandPalette from '../CommandPalette';
import SonnerNotification from '../SonnerNotification';
import SovereignHUD from '../ui/SovereignHUD';
import { useDomainContext } from '../../context/DomainContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { LogOut, User as UserIcon } from 'lucide-react';

interface Props {
  activityLogs: ActivityLog[];
  children: React.ReactNode;
  onSearchDomain: (name: string) => void;
}

const MainLayout: React.FC<Props> = ({ 
  activityLogs, children, onSearchDomain 
}) => {
  const { activeHub, setActiveHub } = useNavigation();
  const { activeProfile, dismissLog } = useDomainContext();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
  }, [activeHub]);

  // 🛡️ التطهير الجذري: التركيز المطلق على التنقيب والذكاء الاصطناعي
  const navItems = [
    { id: AgentType.ALPHA_MINE, label: 'Alpha Mine', icon: 'fa-bolt', sub: 'Discovery & Audit' },
    { id: AgentType.BRAND_INTELLIGENCE, label: 'Brand Intel', icon: 'fa-brain', sub: 'Smart Intelligence' }
  ];

  const handleNavClick = (id: AgentType) => {
    setActiveHub(id);
    setIsSidebarOpen(false);
  };

  const isAdmin = activeProfile?.role === 'Admin';

  return (
    <div className="flex h-screen w-full bg-[#050507] text-white overflow-hidden relative" dir="ltr">
      <SovereignHUD />
      <CommandPalette onSearchDomain={onSearchDomain} />
      <SonnerNotification notifications={activityLogs} onDismiss={dismissLog} />
      
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-16 right-6 z-[200] w-12 h-12 bg-[#d4af37] text-black rounded-2xl shadow-2xl flex items-center justify-center transition-all"
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[140] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <main ref={mainContentRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 pt-20 lg:pt-24 relative z-10 scroll-smooth">
        <div className="max-w-7xl mx-auto pb-40">
          {children}
        </div>
      </main>

      <aside className={`fixed inset-y-0 right-0 w-80 bg-[#08080a] border-l border-white/5 p-8 pt-20 flex flex-col z-[150] transition-all duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="text-right mb-12">
           <h1 className="text-3xl font-serif italic text-white leading-none mb-1">Isthmic Pro</h1>
           <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#d4af37]">Sovereign Command</span>
        </div>
        
        <nav className="flex flex-col gap-4">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => handleNavClick(item.id)} 
              className={`w-full flex items-center justify-end gap-6 p-5 rounded-2xl transition-all border ${activeHub === item.id ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-2xl' : 'bg-white/2 border-white/5 text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <div className="text-right">
                <div className="font-black uppercase text-[11px] tracking-widest">{item.label}</div>
                <div className={`text-[7px] font-bold uppercase tracking-widest opacity-60 ${activeHub === item.id ? 'text-black' : 'text-[#d4af37]'}`}>{item.sub}</div>
              </div>
              <i className={`fas ${item.icon} text-sm`}></i>
            </button>
          ))}
          
          {isAdmin && (
            <button 
              onClick={() => handleNavClick(AgentType.ADMIN_CONTROL)}
              className={`mt-4 w-full flex items-center justify-end gap-6 p-5 rounded-2xl border transition-all ${activeHub === AgentType.ADMIN_CONTROL ? 'bg-red-600 text-white border-red-600 shadow-2xl' : 'border-red-900/30 text-red-500 bg-red-950/10 hover:bg-red-600 hover:text-white'}`}
            >
              <span className="font-black uppercase text-[10px] tracking-widest">Admin Control</span>
              <i className="fas fa-terminal"></i>
            </button>
          )}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
           <button 
             onClick={() => handleNavClick(AgentType.USER_PROFILE)}
             className="flex items-center justify-end gap-3 hover:opacity-80 transition-opacity"
           >
             <div className="text-right">
               <div className="text-[10px] font-bold text-white">{user?.displayName || user?.email}</div>
               <div className="text-[8px] text-slate-500 uppercase tracking-widest">Sovereign User</div>
             </div>
             {user?.photoURL ? (
               <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
             ) : (
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                 <UserIcon className="w-4 h-4 text-slate-400" />
               </div>
             )}
           </button>
           
           <button 
             onClick={logout}
             className="w-full py-2 bg-red-950/20 hover:bg-red-900/40 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-red-900/20 transition-all flex items-center justify-center gap-2"
           >
             <LogOut className="w-3 h-3" />
             Terminate Session
           </button>

           <div className="flex items-center justify-end gap-3 opacity-40">
             <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest italic">Stable Build 2.4.0</span>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default MainLayout;
