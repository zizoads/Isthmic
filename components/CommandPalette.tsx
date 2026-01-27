
import React, { useState, useEffect, useMemo } from 'react';
import { useDomainContext } from '../context/DomainContext';
import { AgentType } from '../types';

interface Props {
  setActiveTab: (tab: AgentType) => void;
  onSearchDomain: (name: string) => void;
}

interface PaletteItem {
  label: string;
  icon: string;
  action: () => void;
  category: string;
  sub?: string;
}

const CommandPalette: React.FC<Props> = ({ setActiveTab, onSearchDomain }) => {
  const { domains } = useDomainContext();
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
    { label: 'Intelligence Hub', icon: 'fa-brain', action: () => setActiveTab(AgentType.INTELLIGENCE), category: 'Navigation' },
    { label: 'Acquisition Desk', icon: 'fa-crosshairs', action: () => setActiveTab(AgentType.ACQUISITION), category: 'Navigation' },
    { label: 'Operations Hub', icon: 'fa-layer-group', action: () => setActiveTab(AgentType.OPERATIONS), category: 'Navigation' },
    { label: 'Liquidation Engine', icon: 'fa-money-bill-wave', action: () => setActiveTab(AgentType.LIQUIDATION), category: 'Navigation' },
    { label: 'Executive Suite', icon: 'fa-file-signature', action: () => setActiveTab(AgentType.MANAGEMENT), category: 'Navigation' },
  ], [setActiveTab]);

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
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0b0e14] rounded-[24px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[70vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b dark:border-white/5 flex items-center gap-4 bg-slate-50/50 dark:bg-white/2">
          <i className="fas fa-search text-slate-400"></i>
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search assets..."
            className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-800 dark:text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.map((item, i) => (
            <button 
              key={i}
              onMouseEnter={() => setSelectedIndex(i)}
              onClick={() => handleAction(item)}
              className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${selectedIndex === i ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
            >
              <div className="flex items-center gap-4">
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <div className="text-left">
                  <div className="text-sm font-bold">{item.label}</div>
                  {item.sub && <div className="text-[9px] uppercase opacity-60">{item.sub}</div>}
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{item.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
