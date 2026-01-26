
import React, { useState } from 'react';
import { Domain } from '../types';
import { translations } from '../translations';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  onInspect: (d: Domain) => void;
  onBulkEvaluate?: (ids: string[]) => void;
  lang: 'ar' | 'en';
}

const PipelineDashboard: React.FC<Props> = ({ domains, setDomains, onInspect, onBulkEvaluate, lang }) => {
  const t = translations[lang];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const columns = [
    { id: 'available', label: t.status_available, icon: 'fa-search', color: 'indigo' },
    { id: 'processing', label: t.status_processing, icon: 'fa-microchip', color: 'amber' },
    { id: 'purchased', label: t.status_purchased, icon: 'fa-vault', color: 'green' },
    { id: 'negotiating', label: t.status_negotiating, icon: 'fa-handshake', color: 'blue' },
    { id: 'sold', label: t.status_sold, icon: 'fa-money-bill-wave', color: 'emerald' }
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const moveDomain = (id: string, newStatus: Domain['status']) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <div className="relative h-full flex flex-col" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
        {columns.map(col => (
          <div key={col.id} className="flex-shrink-0 w-[280px] sm:w-80 flex flex-col gap-4 snap-center">
            <div className="flex justify-between items-center px-4 py-3 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{domains.filter(d => d.status === col.id).length}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black text-${col.color}-600`}>{col.label}</span>
                <i className={`fas ${col.icon} text-slate-400 text-[10px]`}></i>
              </div>
            </div>

            <div className="flex-1 space-y-4 max-h-[60vh] lg:max-h-none overflow-y-auto p-1">
              {domains.filter(d => d.status === col.id).map(domain => (
                <div 
                  key={domain.id}
                  className={`bg-white dark:bg-slate-900 p-5 lg:p-6 rounded-[24px] border transition-all group relative cursor-grab active:cursor-grabbing ${
                    selectedIds.includes(domain.id) ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-xl' : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg'
                  }`}
                >
                  <div className={`absolute top-4 z-10 ${lang === 'ar' ? 'right-4' : 'left-4'}`}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(domain.id)}
                      onChange={() => toggleSelect(domain.id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  <div className={`flex justify-between items-start mb-4 ${lang === 'ar' ? 'pr-6' : 'pl-6'}`}>
                    <button onClick={() => onInspect(domain)} className="text-slate-300 hover:text-indigo-500 transition-colors">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                      <div className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[150px]">{domain.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase">{domain.sector || t.uncategorized}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="text-xs font-black text-indigo-600">${domain.price}</div>
                    <div className="flex gap-1">
                      {col.id !== 'sold' && (
                        <button 
                          onClick={() => moveDomain(domain.id, columns[columns.findIndex(c => c.id === col.id) + 1]?.id as any)}
                          className="w-7 h-7 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          <i className={`fas ${lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'} text-[10px]`}></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-[24px] lg:rounded-[32px] shadow-2xl flex flex-col sm:flex-row items-center gap-4 lg:gap-10 animate-slide-up z-[100] border border-white/10">
          <div className={`flex items-center gap-4 border-white/10 pb-2 sm:pb-0 w-full sm:w-auto justify-center ${lang === 'ar' ? 'sm:border-l sm:pl-10' : 'sm:border-r sm:pr-10'}`}>
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-black">{selectedIds.length}</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => onBulkEvaluate?.(selectedIds)}
              className="flex-1 sm:flex-none px-4 lg:px-6 py-2.5 bg-indigo-600 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-microchip text-[10px]"></i> {t.auditAction}
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="px-4 py-2.5 bg-white/10 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineDashboard;
