
import React, { useState } from 'react';
import { Domain } from '../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  onInspect: (d: Domain) => void;
  onBulkEvaluate?: (ids: string[]) => void;
}

const PipelineDashboard: React.FC<Props> = ({ domains, setDomains, onInspect, onBulkEvaluate }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const columns = [
    { id: 'available', label: 'مكتشف حديثاً', icon: 'fa-search', color: 'indigo' },
    { id: 'processing', label: 'تحت التدقيق', icon: 'fa-microchip', color: 'amber' },
    { id: 'purchased', label: 'في الخزنة', icon: 'fa-vault', color: 'green' },
    { id: 'negotiating', label: 'مفاوضات نشطة', icon: 'fa-handshake', color: 'blue' },
    { id: 'sold', label: 'تمت التصفية', icon: 'fa-money-bill-wave', color: 'emerald' }
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const moveDomain = (id: string, newStatus: Domain['status']) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  return (
    <div className="relative h-full">
      <div className="flex gap-6 overflow-x-auto pb-24 scrollbar-hide min-h-[700px]" dir="rtl">
        {columns.map(col => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex justify-between items-center px-4 py-2 bg-white/50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{domains.filter(d => d.status === col.id).length} أصول</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black text-${col.color}-600`}>{col.label}</span>
                <i className={`fas ${col.icon} text-slate-300 text-xs`}></i>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {domains.filter(d => d.status === col.id).map(domain => (
                <div 
                  key={domain.id}
                  className={`bg-white p-6 rounded-[24px] border transition-all group relative cursor-grab active:cursor-grabbing ${
                    selectedIds.includes(domain.id) ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-lg'
                  }`}
                >
                  <div className="absolute top-4 right-4 z-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(domain.id)}
                      onChange={() => toggleSelect(domain.id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-between items-start mb-4 pr-6">
                    <button onClick={() => onInspect(domain)} className="text-slate-300 hover:text-indigo-500 transition-colors">
                      <i className="fas fa-expand-alt text-xs"></i>
                    </button>
                    <div className="text-right">
                      <div className="font-black text-slate-900 text-sm">{domain.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase">{domain.sector}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                    <div className="text-xs font-black text-indigo-600">${domain.price}</div>
                    <div className="flex gap-1">
                      {col.id !== 'sold' && (
                        <button 
                          onClick={() => moveDomain(domain.id, columns[columns.findIndex(c => c.id === col.id) + 1]?.id as any)}
                          className="w-7 h-7 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          <i className="fas fa-arrow-left text-[10px]"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {domains.filter(d => d.status === col.id).length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-[32px] h-32 flex items-center justify-center text-slate-300 italic text-xs">
                  فارغ
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-[32px] shadow-2xl flex items-center gap-10 animate-slide-up z-[100] border border-white/10">
          <div className="flex items-center gap-4 border-l border-white/10 pl-10">
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-black">{selectedIds.length}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">نطاق محدد</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onBulkEvaluate?.(selectedIds)}
              className="px-6 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-microchip"></i> تدقيق شامل (Batch)
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="px-6 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineDashboard;
