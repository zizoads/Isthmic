
import React, { useState } from 'react';
import { Domain } from '../types';
import { translations } from '../translations';
import StatusBadge from './ui/StatusBadge';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  onInspect: (d: Domain) => void;
  lang: 'ar' | 'en';
}

const PipelineDashboard: React.FC<Props> = ({ domains, setDomains, onInspect, lang }) => {
  const t = translations[lang];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const columns = [
    { id: 'available', label: t.status_available, icon: 'fa-search', color: 'indigo' },
    { id: 'processing', label: t.status_processing, icon: 'fa-microchip', color: 'amber' },
    { id: 'purchased', label: t.status_purchased, icon: 'fa-vault', color: 'green' },
    { id: 'negotiating', label: t.status_negotiating, icon: 'fa-handshake', color: 'blue' }
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {columns.map(col => (
        <div key={col.id} className="flex-shrink-0 w-72 flex flex-col gap-3 snap-start">
          <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 mb-2">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{col.label}</span>
            <span className="text-[10px] font-mono text-slate-500">{domains.filter(d => d.status === col.id).length}</span>
          </div>

          <div className="flex-1 space-y-3 min-h-[400px]">
            {domains.filter(d => d.status === col.id).map(domain => (
              <div 
                key={domain.id}
                onClick={() => onInspect(domain)}
                className={`glass-card p-4 rounded-xl cursor-pointer group ${selectedIds.includes(domain.id) ? 'ring-1 ring-indigo-500 bg-indigo-500/5' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                   <div className="text-xs font-black text-white truncate max-w-[140px] tracking-tight">{domain.name}</div>
                   <div className="text-[9px] font-mono text-indigo-400 font-bold">${domain.price}</div>
                </div>
                
                <div className="flex justify-between items-center">
                   <div className="text-[8px] font-bold text-slate-500 uppercase">{domain.sector || 'Uncategorized'}</div>
                   <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fas fa-chevron-right text-[8px] text-slate-600"></i>
                   </div>
                </div>

                {domain.probability && (
                  <div className="mt-3 w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500/40" style={{ width: `${domain.probability * 100}%` }}></div>
                  </div>
                )}
              </div>
            ))}
            
            {domains.filter(d => d.status === col.id).length === 0 && (
              <div className="h-24 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-[9px] font-black text-slate-700 uppercase tracking-widest">
                Empty
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PipelineDashboard;
