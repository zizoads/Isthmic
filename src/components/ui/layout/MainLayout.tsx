import React, { ReactNode, useState } from 'react';
import { AgentType } from '../../../types';
import { useNavigation } from '../../../context/NavigationContext';
import { useAuth } from '../../../context/AuthContext';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  activityLogs: any[];
  onSearchDomain: (name: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { activeHub, setActiveHub } = useNavigation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: AgentType.ALPHA_MINE, label: 'Alpha Mine', sub: 'Discovery & Audit' },
    { id: AgentType.BRAND_INTELLIGENCE, label: 'Brand Intel', sub: 'Smart Intelligence' },
    { id: AgentType.CONCEPT_LAB, label: 'Concept Lab', sub: 'Brand Synthesis' },
    { id: AgentType.USER_PROFILE, label: 'Profile', sub: 'Identity' }
  ];

  if (user?.role === 'Admin') {
    navItems.push({ id: AgentType.ADMIN_CONTROL, label: 'Admin', sub: 'System Control' });
  }

  const handleNavClick = (id: AgentType) => {
    setActiveHub(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] text-white overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0c] z-50 absolute top-0 w-full">
        <div>
          <h1 className="text-xl prestige-title italic">Sovereign.</h1>
          <p className="text-[8px] font-black text-[#d4af37] uppercase tracking-widest mt-1">Core Engine v2.3</p>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-[#0a0a0c] flex flex-col transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:pt-0 pt-20
      `}>
        <div className="hidden md:block p-6 border-b border-white/10">
          <h1 className="text-2xl prestige-title italic">Sovereign.</h1>
          <p className="text-[8px] font-black text-[#d4af37] uppercase tracking-widest mt-1">Core Engine v2.3</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                activeHub === item.id 
                  ? 'bg-white/10 border border-white/20' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="text-sm font-bold">{item.label}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{item.sub}</div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative md:pt-0 pt-20">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
