
import React, { useState, useEffect, useMemo } from 'react';
import { useDomainContext } from '../context/DomainContext';
import { AgentType } from '../types';

interface Props {
  setActiveTab: (tab: AgentType) => void;
  onSearchDomain: (name: string) => void;
}

// Define interface for Command Palette items to avoid property missing errors
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
    { label: 'Go to Intelligence Hub', icon: 'fa-brain', action: () => setActiveTab(AgentType.INTELLIGENCE), category: 'Navigation' },
    { label: 'Open Acquisition Desk', icon: 'fa-crosshairs', action: () => setActiveTab(AgentType.ACQUISITION), category: 'Navigation' },
    { label: 'View Portfolio Operations', icon: 'fa-layer-group', action: () => setActiveTab(AgentType.OPERATIONS), category: 'Navigation' },
    { label: 'Analyze Market Trends', icon: 'fa-chart-line', action: () => setActiveTab(AgentType.LIQUIDATION), category: 'Tools' },
    { label: 'Generate Executive Memo', icon: 'fa-file-signature', action: () => setActiveTab(AgentType.MANAGEMENT), category: 'Tools' },
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
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={() => setIsOpen(false)}>
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
            className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-800 dark:text-white placeholder:text-slate-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border dark:border-white/10 rounded text-[9px] font-black text-slate-400">ESC</kbd>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item, i) => (
                <button 
                  key={i}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => handleAction(item)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all group ${selectedIndex === i ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${selectedIndex === i ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/5'}`}>
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">{item.label}</div>
                      {/* Fixed: TypeScript error where 'sub' property was missing from some items in filteredItems */}
                      {item.sub && <div className={`text-[9px] uppercase font-black ${selectedIndex === i ? 'text-white/60' : 'text-slate-500'}`}>{item.sub}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${selectedIndex === i ? 'text-white/40' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}>{item.category}</span>
                    <i className="fas fa-chevron-right text-[10px] opacity-30"></i>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 italic text-sm">No results found for "{query}"</div>
          )}
        </div>
        
        <div className="p-3 bg-slate-50 dark:bg-white/2 border-t dark:border-white/5 flex justify-center gap-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">
           <span><i className="fas fa-arrow-up-down mr-2"></i> Navigate</span>
           <span><i className="fas fa-turn-down mr-2 rotate-90"></i> Execute</span>
           <span><i className="fas fa-hashtag mr-2"></i> Filter</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
