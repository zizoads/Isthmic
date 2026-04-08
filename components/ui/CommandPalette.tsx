
import React, { useState, useEffect, useMemo } from 'react';
import { useDomainContext } from '../../context/DomainContext';
import { useNavigation } from '../../context/NavigationContext';
import { AgentType } from '../../types';

interface Props {
  onSearchDomain: (name: string) => void;
}

interface PaletteItem {
  label: string;
  icon: string;
  action: () => void;
  category: string;
  sub?: string;
}

const CommandPalette: React.FC<Props> = ({ onSearchDomain }) => {
  const { domains } = useDomainContext();
  const { setActiveHub } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = useMemo((): PaletteItem[] => [
    { label: 'Alpha Mine (Discovery)', icon: 'fa-bolt', action: () => setActiveHub(AgentType.ALPHA_MINE), category: 'Navigation' },
    { label: 'Executive Suite (Strategy)', icon: 'fa-user-shield', action: () => setActiveHub(AgentType.EXECUTIVE), category: 'Navigation' },
  ], [setActiveHub]);

  const filteredItems = useMemo(() => {
    const domainMatches: PaletteItem[] = domains
      .filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
      .map(d => ({ label: d.name, icon: 'fa-globe', action: () => onSearchDomain(d.name), category: 'Domains', sub: d.sector }));
    
    const cmdMatches = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
    
    return [...cmdMatches, ...domainMatches];
  }, [query, domains, commands, onSearchDomain]);

  useEffect(() => setSelectedIndex(0), [query]);

  const handleAction = (item: PaletteItem) => {
    item.action();
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-[#0a0a0a] border-4 border-white shadow-[20px_20px_0px_0px_rgba(197,160,89,0.3)] overflow-hidden flex flex-col max-h-[70vh] animate-precision"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b-4 border-white flex items-center gap-6 bg-white">
          <i className="fas fa-search text-black text-2xl"></i>
          <input 
            autoFocus
            type="text" 
            placeholder="TYPE_COMMAND_OR_ASSET..."
            className="flex-1 bg-transparent border-none outline-none text-2xl font-black text-black placeholder:text-black/20 uppercase tracking-tighter"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="hidden sm:block px-3 py-1 border-2 border-black text-[10px] font-black text-black">ESC</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {filteredItems.map((item, i) => (
            <button 
              key={i}
              onMouseEnter={() => setSelectedIndex(i)}
              onClick={() => handleAction(item)}
              className={`w-full p-6 flex items-center justify-between transition-all group border-2
                ${selectedIndex === i ? 'bg-[#c5a059] border-[#c5a059] text-black translate-x-2' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
              <div className="flex items-center gap-6">
                <i className={`fas ${item.icon} w-6 text-center text-xl`}></i>
                <div className="text-left">
                  <div className="text-lg font-black uppercase tracking-tight">{item.label}</div>
                  {item.sub && <div className={`text-[10px] font-mono uppercase ${selectedIndex === i ? 'text-black/60' : 'text-[#c5a059]'}`}>// {item.sub}</div>}
                </div>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 border-2 ${selectedIndex === i ? 'border-black' : 'border-white/10'}`}>{item.category}</span>
            </button>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-20 text-center text-slate-700 font-mono italic uppercase tracking-widest text-xs">
               -- No_Results_Found_In_Registry --
            </div>
          )}
        </div>
        
        <div className="p-4 bg-white/5 border-t-2 border-white/10 flex justify-between items-center px-8">
           <div className="flex gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <span><i className="fas fa-arrow-up mr-1"></i><i className="fas fa-arrow-down mr-2"></i> Navigate</span>
              <span><i className="fas fa-level-down-alt rotate-90 mr-2"></i> Select</span>
           </div>
           <div className="text-[9px] font-mono text-slate-700 uppercase">Unit_ID: System_Alpha_99</div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
