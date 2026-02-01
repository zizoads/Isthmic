
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
  
  const columns = [
    { id: 'available', label: t.status_available, icon: 'fa-search', color: '#c5a059' },
    { id: 'processing', label: t.status_processing, icon: 'fa-microchip', color: '#6366f1' },
    { id: 'purchased', label: t.status_purchased, icon: 'fa-vault', color: '#10b981' },
    { id: 'negotiating', label: t.status_negotiating, icon: 'fa-handshake', color: '#3b82f6' }
  ];

  return (
    <div className="flex overflow-x-auto pb-10 border-2 border-white/10 bg-[#050505] divide-x-2 divide-white/10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {columns.map(col => (
        <div key={col.id} className="min-w-[320px] flex-shrink-0 flex flex-col">
          <div className="p-8 border-b-2 border-white/10 bg-white/2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3" style={{ backgroundColor: col.color }}></div>
              <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{col.label}</span>
            </div>
            <span className="text-xs font-mono text-slate-500">[{domains.filter(d => d.status === col.id).length}]</span>
          </div>

          <div className="p-6 space-y-6 flex-1 bg-black/40">
            {domains.filter(d => d.status === col.id).map(domain => (
              <div 
                key={domain.id}
                onClick={() => onInspect(domain)}
                className="square-card p-6 border-2 border-white/5 bg-[#0a0a0a] group cursor-pointer hover:border-[#c5a059]"
              >
                <div className="flex justify-between items-start mb-4">
                   <div className="text-base font-black text-white group-hover:text-[#c5a059] transition-colors truncate max-w-[180px]">{domain.name}</div>
                   <div className="text-xs font-mono text-indigo-400 font-bold">${domain.price}</div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{domain.sector || 'N/A'}</div>
                   <div className={`transition-all ${lang === 'ar' ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                      <i className={`fas ${lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'} text-[10px] text-[#c5a059]`}></i>
                   </div>
                </div>

                {domain.probability && (
                  <div className="w-full h-1 bg-white/5 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${domain.probability * 100}%` }}></div>
                  </div>
                )}
              </div>
            ))}
            {domains.filter(d => d.status === col.id).length === 0 && (
              <div className="py-20 text-center opacity-10 border-2 border-dashed border-white/5">
                <i className="fas fa-inbox text-4xl mb-4"></i>
                <p className="text-[9px] uppercase tracking-widest">Empty_Pipeline</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PipelineDashboard;
