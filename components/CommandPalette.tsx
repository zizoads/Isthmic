
import React, { useState, useEffect } from 'react';
import { Domain } from '../types';

interface Props {
  domains: Domain[];
  setActiveTab: (tab: any) => void;
  onSearchDomain: (name: string) => void;
}

const CommandPalette: React.FC<Props> = ({ domains, setActiveTab, onSearchDomain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

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

  if (!isOpen) return null;

  const filteredDomains = domains.filter(d => d.name.includes(query.toLowerCase())).slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm bg-slate-900/20 animate-fade-in" dir="rtl">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center gap-4 bg-slate-50/50">
          <i className="fas fa-search text-slate-400"></i>
          <input 
            autoFocus
            type="text" 
            placeholder="بحث عن نطاق، مهمة، أو أمر استراتيجي..."
            className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-800 placeholder:text-slate-300 text-right"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="px-2 py-1 bg-white border rounded-lg text-[10px] font-black text-slate-400 shadow-sm">ESC</kbd>
        </div>
        
        <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-hide text-right">
          {query.length > 0 && (
            <div className="mb-6">
              <h4 className="px-4 mb-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">الأصول المتطابقة</h4>
              {filteredDomains.map(d => (
                <button 
                  key={d.id}
                  onClick={() => { onSearchDomain(d.name); setIsOpen(false); }}
                  className="w-full p-4 hover:bg-slate-50 rounded-2xl flex items-center justify-between transition-all group"
                >
                  <span className="text-xs font-black text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">فتح التفاصيل</span>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{d.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{d.sector} • ${d.price}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div>
            <h4 className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">أوامر سريعة</h4>
            {[
              { label: 'إطلاق مسح العقل المدبر', icon: 'fa-brain', action: () => setActiveTab('MASTER_BRAIN') },
              { label: 'فتح تقرير الأرباح', icon: 'fa-file-invoice-dollar', action: () => setActiveTab('EXECUTIVE') },
              { label: 'فحص النطاقات الساقطة (Drop)', icon: 'fa-crosshairs', action: () => setActiveTab('DROP_SNIPER') },
              { label: 'إضافة مفتاح API جديد', icon: 'fa-key', action: () => setActiveTab('MASTER_BRAIN') }
            ].map((cmd, i) => (
              <button 
                key={i}
                onClick={() => { cmd.action(); setIsOpen(false); }}
                className="w-full p-4 hover:bg-indigo-50 rounded-2xl flex items-center justify-between transition-all group"
              >
                <i className={`fas ${cmd.icon} text-slate-300 group-hover:text-indigo-500 transition-colors`}></i>
                <span className="font-bold text-slate-700 text-sm">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t flex justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <span><i className="fas fa-arrow-up-down mr-2"></i> للتنقل</span>
           <span><i className="fas fa-turn-down mr-2 rotate-90"></i> للاختيار</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
