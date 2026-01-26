
import React from 'react';
import { Domain } from '../types';

interface Props {
  domain: Domain;
  onClose: () => void;
}

const AgentReasoningLab: React.FC<Props> = ({ domain, onClose }) => {
  return (
    <div className="fixed inset-y-0 left-0 w-[500px] bg-[#0d1117] text-white shadow-2xl z-50 border-r border-white/10 flex flex-col animate-slide-left font-mono" dir="rtl">
      <header className="p-8 border-b border-white/5 flex justify-between items-center">
         <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-500 transition-all">
            <i className="fas fa-times text-xs"></i>
         </button>
         <div className="text-right">
            <h3 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">دليل الإثبات والبيانات الحية</h3>
            <div className="font-bold text-lg tracking-tight">{domain.name}</div>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
         
         {/* Comparable Sales Section */}
         {domain.technicalMetrics?.comparableSales && (
           <section className="animate-fade-in">
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                 <i className="fas fa-history text-indigo-500"></i> مبيعات مشابهة مؤكدة (Comps)
              </h4>
              <div className="space-y-3">
                 {domain.technicalMetrics.comparableSales.map((sale, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                       <div className="text-indigo-400 font-black">${sale.price.toLocaleString()}</div>
                       <div className="text-right">
                          <div className="text-xs font-bold">{sale.domain}</div>
                          <div className="text-[9px] text-slate-500">{sale.date}</div>
                       </div>
                    </div>
                 ))}
              </div>
           </section>
         )}

         <section>
            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">سلسلة التفكير (Chain of Thought)</h4>
            <div className="space-y-4 text-xs leading-relaxed text-slate-400 italic">
               {domain.thinkingPath ? (
                  domain.thinkingPath.split('.').map((p, i) => (
                    p.trim() && (
                      <div key={i} className="flex gap-4 border-r border-indigo-500/30 pr-4 py-1">
                         <span className="text-indigo-500 font-black">0{i+1}</span>
                         <p>{p.trim()}.</p>
                      </div>
                    )
                  ))
               ) : (
                  <div className="p-6 bg-white/5 rounded-2xl text-center opacity-30">جاري انتظار بيانات الاستدلال من المحرك...</div>
               )}
            </div>
         </section>

         {/* Sources Citations */}
         {domain.technicalMetrics?.sourceCitations && (
           <section>
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">المصادر المرجعية (Citations)</h4>
              <div className="flex flex-wrap gap-2">
                 {domain.technicalMetrics.sourceCitations.map((url, i) => (
                    <a 
                      key={i} 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-3 py-1 bg-indigo-600/10 text-indigo-400 text-[9px] rounded-lg border border-indigo-600/20 hover:bg-indigo-600 hover:text-white transition-all max-w-[150px] truncate"
                    >
                       <i className="fas fa-link mr-1"></i> {new URL(url).hostname}
                    </a>
                 ))}
              </div>
           </section>
         )}

         <section className="bg-indigo-600/5 p-6 rounded-3xl border border-indigo-500/10 space-y-4">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">المؤشرات الفنية (Verified)</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <div className="text-[8px] text-slate-500 uppercase">Domain Authority</div>
                  <div className="text-xl font-black text-white">{domain.technicalMetrics?.da || '--'}</div>
               </div>
               <div className="space-y-1">
                  <div className="text-[8px] text-slate-500 uppercase">Backlinks Count</div>
                  <div className="text-xl font-black text-white">{domain.technicalMetrics?.backlinks || '--'}</div>
               </div>
            </div>
         </section>
      </div>

      <footer className="p-8 border-t border-white/5 bg-white/2 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-slate-500 uppercase">البيانات مرتبطة بالبحث المباشر</span>
         </div>
         <button className="bg-indigo-600 px-6 py-3 rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-indigo-600 transition-all">
            تحديث البيانات
         </button>
      </footer>
    </div>
  );
};

export default AgentReasoningLab;
