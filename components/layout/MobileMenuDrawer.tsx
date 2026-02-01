
import React from 'react';
import { AgentType, UserProfile } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setActiveHub: (hub: AgentType) => void;
  activeProfile: UserProfile | null;
  logout: () => void;
  lang: 'ar' | 'en';
}

const MobileMenuDrawer: React.FC<Props> = ({ isOpen, onClose, setActiveHub, activeProfile, logout, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[2000] animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`absolute right-0 top-0 bottom-0 w-[80%] bg-[#0a0a0c] border-l border-white/10 p-8 flex flex-col shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex justify-between items-center mb-12">
           <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center text-black font-serif text-xl italic shadow-xl">I</div>
           <button onClick={onClose} className="text-slate-500 hover:text-white"><i className="fas fa-times text-xl"></i></button>
        </div>

        <div className="space-y-2 flex-1">
          <button 
            onClick={() => { setActiveHub(AgentType.MANAGEMENT); onClose(); }}
            className="w-full text-left p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4 group"
          >
            <i className="fas fa-user-tie text-[#d4af37]"></i>
            <span className="text-xs font-black uppercase text-white">{lang === 'ar' ? 'الجناح التنفيذي' : 'Executive Suite'}</span>
          </button>
          
          <button 
            onClick={() => { setActiveHub(AgentType.CODE_AUDITOR); onClose(); }}
            className="w-full text-left p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4"
          >
            <i className="fas fa-file-code text-indigo-400"></i>
            <span className="text-xs font-black uppercase text-white">{lang === 'ar' ? 'مدقق الكود' : 'Code Auditor'}</span>
          </button>

          <button 
            onClick={() => { setActiveHub(AgentType.ADMIN); onClose(); }}
            className="w-full text-left p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center gap-4"
          >
            <i className="fas fa-user-shield text-[#d4af37]"></i>
            <span className="text-xs font-black uppercase text-[#d4af37]">{lang === 'ar' ? 'لوحة المسؤول' : 'Admin Hub'}</span>
          </button>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
           <div className="flex items-center gap-4">
              <img src={activeProfile?.avatar} className="w-12 h-12 rounded-full border border-white/10" alt="User" />
              <div>
                 <div className="text-sm font-bold text-white">{activeProfile?.name}</div>
                 <div className="text-[10px] text-slate-500 uppercase">{activeProfile?.subscriptionTier}</div>
              </div>
           </div>
           <button 
            onClick={logout}
            className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest"
           >
             Terminate Session
           </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuDrawer;
