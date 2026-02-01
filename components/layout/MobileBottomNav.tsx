
import React from 'react';
import { AgentType } from '../../types';

interface Props {
  activeHub: AgentType;
  setActiveHub: (hub: AgentType) => void;
  onOpenMenu: () => void;
  lang: 'ar' | 'en';
}

const MobileBottomNav: React.FC<Props> = ({ activeHub, setActiveHub, onOpenMenu, lang }) => {
  const items = [
    { id: AgentType.INTELLIGENCE, icon: 'fa-brain', label: lang === 'ar' ? 'ذكاء' : 'Intel' },
    { id: AgentType.ACQUISITION, icon: 'fa-crosshairs', label: lang === 'ar' ? 'استحواذ' : 'Hunt' },
    { id: AgentType.OPERATIONS, icon: 'fa-layer-group', label: lang === 'ar' ? 'عمليات' : 'Ops' },
    { id: AgentType.LIQUIDATION, icon: 'fa-money-bill-wave', label: lang === 'ar' ? 'تصفية' : 'Exit' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-[#0a0a0c]/80 backdrop-blur-2xl border-t border-white/5 px-4 pb-safe pt-2 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveHub(item.id)}
            className={`flex flex-col items-center gap-1 p-3 transition-all duration-300 ${
              activeHub === item.id ? 'text-[#d4af37] scale-110' : 'text-slate-500'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center gap-1 p-3 text-white bg-white/5 rounded-2xl border border-white/10"
        >
          <i className="fas fa-bars text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'ar' ? 'المزيد' : 'Menu'}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
